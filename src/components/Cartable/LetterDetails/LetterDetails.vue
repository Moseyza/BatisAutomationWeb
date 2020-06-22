<template>
    <div class="three-part-flexbox">
            <div style="flex:1"  class="flex-part-top" >
                <div class="symmetric-grid">
                <div style="flex:3">
                    <h4>{{letter.title}}</h4>
                </div>
                <div style="flex:1" class="symmetric-grid">
                    <i class="action-icon icon-comment"></i>
                    <i class="action-icon icon-stampFast"></i>
                    <div id="options-dropdown"  class="ui icon top left dropdown">
  		                <i class="action-icon icon-threeDots"></i>
  		                <div class="menu">
    		                <div class="item menu-item" @click="finalizeLetter()" ><div style="padding-left:5px">اختتام</div> <i class="fixed-icon icon-stamp"></i> </div>
    		                <div class="item menu-item"><div style="padding-left:5px">چاپ</div> <i class="fixed-icon icon-print"></i></div>
    		                <div class="item menu-item"><div style="padding-left:5px">جریان وابستگی</div> <i class="fixed-icon icon-tree"></i></div>
                            <div class="item menu-item"><div style="padding-left:5px">مشاهده گزارش</div> <i class="fixed-icon icon-form1"></i></div>
  		                </div>
	                </div>
                </div>
                </div>
                 <div>
                    <div v-if="isReceived">نامه های دریافتی</div>
                    <div v-else>نامه های ارسالی</div>
                </div>
            </div>
            <div style="flex:6" class="flex-part-middle">
           
            <div class="container3">
                <div class="symmetric-grid" >
                    <h4 class="highlight" v-if="isReceived">{{letter.sender.nameOnly}}</h4>
                    <div v-else style="max-height: 20px; overflow: auto; flex:1">
                        <div v-for="(receiver,index) in letter.recievers" :key="index"><h4 class="highlight">{{receiver.nameOnly}}</h4> <br/></div>
                    </div>
                    <div style="flex:1; text-align:end">
                        <i @click="downloadLetterPdf()" class="helper-icon-large icon-pdf"></i>
                    </div>
                </div>
                <div>
                    <div>
                        {{letterTime}}
                    </div>
                    <div>
                        <LetterTrailTree :letterId="letter.letterPossessionId"></LetterTrailTree>
                    </div>
                </div>
                <div class="wrap-grid">
                    <LetterAttachment
                    v-for="part in attachments"
                    :key="part.id"
                    :file="part.file"
                    >
                    </LetterAttachment>
                </div>
            </div>
            <div style="height: 100%">
                <div v-if="letter.comment !==''">
                    <div style="margin: 10px 0">هامش: {{letter.comment}}</div>
                    <div class="symmetric-grid" style="padding:20px">
                        <div style="flex:1"></div>
                        <div style="flex:2;border-bottom:2px #e7e7e7 solid;"></div>
                        <div style="flex:1"></div>
                    </div>
                </div>
                <div style="display:flex; height:100%">
                    <!-- <p> -->
                        <!-- {{letter.abstract}} -->
                        <div style="padding:5px;flex:1" class="ng-scope pdfobject-container">
                            <iframe :src="pdfSrc" type="application/pdf" width="100%" height="100%" style="overflow: auto;"></iframe>
                        </div>

                        <!-- <object :data="pdfSrc" type="application/pdf" width="100%" >
                            <p><b>Example fallback content</b>: This browser does not support PDFs. Please download the PDF to view it: <a href="/pdf/sample.pdf">Download PDF</a>.</p>
                        </object> -->
                    <!-- </p> -->
                </div>
            </div>
            </div>
        <div  style="flex:.5 1 0;display:flex;flex-direction:column;align-items:strech" class="flex-part-bottom">
            <div style="flex:1; display:flex;justify-content:space-around" class="container1">
                <div style="flex:1;text-align: center;" class="action-icon "><i class=" icon-replay xlarg-text"></i></div>
                <div style="flex:1;text-align: center;" class="action-icon"><i class=" icon-replayAll xlarg-text"></i></div>
                <div style="flex:1;text-align: center;" @click="forwardLetter()"  class=" action-icon"><i class=" icon-forward xlarg-text"></i></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { Letter } from '@/store/models/Letter/Letter';
import { saveFile, converBase64toBlob, getPersianDate } from '@/util/utils';
import LetterAttachment from '@/components/Cartable/LetterDetails/LetterAttachment/LetterAttachment.vue';
import * as fileService from '@/store/Services/fileService';
import * as letterService from '@/store/Services/letterServices';
import Parts from '@/store/models/Letter/Parts';
import LetterTrailTree from './LetterTrail/LetterTrailTree.vue';
import { LetterTrail } from '@/store/models/Letter/LetterTrail';
import * as $ from 'jquery';
import FinalizeLetter from './FinalizeLetter/FinalizeLetter.vue';
import * as util from '@/util/utils.ts';
@Component({
    name:"LetterDetails",
    components:{LetterAttachment, LetterTrailTree, FinalizeLetter}
})
export default class LetterDetails extends Vue {

    isReceived = true;
    pdfSrc = {} as any;
    @Prop() letter?: Letter;
    @Watch("letter")
    onLetterChanged(newVal: Letter, oldVal: Letter){
        this.setIsReceived();
        this.setPdfUrl();
    }
    created(){
        this.setIsReceived();
    }
    get attachments(){
        
        const result: Parts[] = [];
        if(this.letter === undefined)return result;
        if(this.letter.parts === undefined || this.letter.parts === null)return result;
        for(let i = 1;i<this.letter.parts.length;i++){
            result.push(this.letter.parts[i]);
        }
        return result;
    }

    get letterTime(){
        if(this.letter === undefined) return '';
        const date = new Date( this.letter.sendTime.substring(0,this.letter.sendTime.length -1));
        //date.setMinutes(date.getMinutes() - 270);
        return (date).toLocaleTimeString();
    }

   
    
    setIsReceived(){
        this.isReceived = false;
        if(this.letter == undefined)return;
        if(this.letter.recievers === null)
            this.isReceived = true;
    }

    async downloadLetterPdf(){
        if(this.letter === undefined)return;
        if(this.letter.parts === undefined || this.letter.parts === null)return;
        const file = await fileService.getFile(this.letter.parts[0].file.id);
        const blob =  converBase64toBlob(file.content||"",'');
        saveFile(blob,file.extension);
    }
    async setPdfUrl(){
         if(this.letter === undefined)return;
        if(this.letter.parts === undefined || this.letter.parts === null)return;
            const file = await fileService.getFile(this.letter.parts[0].file.id);
            // const blob =  converBase64toBlob(file.content,file.extension);
            // this.pdfSrc = blob;
            // console.log(blob);
            this.pdfSrc = "data:application/pdf;base64," + file.content;

        
    }
    async mounted(){
        $("#options-dropdown").dropdown({action: 'hide',silent: true});
        await this.setPdfUrl();
    }

    finalizeLetter(){
        if(this.letter === undefined || this.letter === null) return;
        this.$emit('finalize-letter',this.letter.id);
    }
    forwardLetter(){
        if(this.letter)
            this.$emit('forward-letter',this.letter.id);
    }

}
</script>
<style lang="less" scoped>
</style>

