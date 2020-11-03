<template>
    <div class="three-part-flexbox">
            <div style="flex:1"  class="flex-part-top" >
                <div class="symmetric-grid">
                <div style="flex:3">
                    <h4>{{searchResult.title}}</h4>
                </div>
                <div style="flex:1;justify-content:space-around" class="symmetric-grid">
                    <i class="action-icon icon-comment" style="font-size: x-large"></i>
                    <i class="action-icon icon-closeFast"></i>
                    <div id="options-dropdown"  class="ui icon top left dropdown">
  		                <i class="action-icon icon-threeDots" style="font-size: x-large"></i>
  		                <div class="menu">
    		                <div class="item menu-item" @click="finalizeLetter()" ><div style="padding-left:5px">اختتام</div> <i class="fixed-icon icon-closeLetter"></i> </div>
    		                <div class="item menu-item"><div style="padding-left:5px">چاپ</div> <i class="fixed-icon icon-print"></i></div>
    		                <div class="item menu-item"><div style="padding-left:5px">جریان وابستگی</div> <i class="fixed-icon icon-notRouted"></i></div>
                            <div class="item menu-item"><div style="padding-left:5px">مشاهده گزارش</div> <i class="fixed-icon icon-report"></i></div>
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
                    <h4 class="highlight" v-if="isReceived">{{searchResult.from.nameOnly}}</h4>
                    <div v-else style="max-height: 20px; overflow: auto; flex:1">
                        <div v-for="(receiver,index) in searchResult.to" :key="index"><h4 class="highlight">{{receiver.nameOnly}}</h4> <br/></div>
                    </div>
                    <div style="flex:1; text-align:end">
                        <i @click="downloadLetterPdf()" class="helper-icon-large icon-file-pdf"></i>
                    </div>
                </div>
                <div>
                    <div>
                        {{letterTime}}
                    </div>
                    <div>
                        <LetterTrailTreeMobile :letterId="searchResult.possessionId"></LetterTrailTreeMobile>
                    </div>
                </div>
                <div class="wrap-grid">
                    <LetterAttachmentMobile
                    v-for="part in attachments"
                    :key="part.id"
                    :file="part.file"
                    >
                    </LetterAttachmentMobile>
                </div>
            </div>
            <div style="height: 100%">
                <div v-if="searchResult.comment !==''">
                    <div style="margin: 10px 0">هامش: {{searchResult.comment}}</div>
                    <div class="symmetric-grid" style="padding:20px">
                        <div style="flex:1"></div>
                        <!-- <div style="flex:2;border-bottom:2px #e7e7e7 solid;"></div> -->
                        <div style="flex:1"></div>
                    </div>
                </div>
                <div style="display:flex; height:100%">
                    <!-- <p> -->
                        <!-- {{letter.abstract}} -->
                        <div style="padding:5px;flex:1" class="ng-scope pdfobject-container">
                            <iframe v-if="pdfLoaded" :src="pdfSrc" type="application/pdf" width="100%" height="100%" style="overflow: auto;"></iframe>
                        </div>
                </div>
            </div>
            </div>
        <div  style="flex:.5 1 0;display:flex;flex-direction:column;align-items:strech" class="flex-part-bottom">
            <div style="flex:1; display:flex;justify-content:space-around" class="container1">
                <div style="flex:1;text-align: center;" class="action-icon "><i class=" icon-replay xlarg-text"></i></div>
                <div style="flex:1;text-align: center;" class="action-icon"><i class=" icon-replayAll xlarg-text"></i></div>
                <div style="flex:1;text-align: center;" @click="forwardLetter()"  class=" action-icon"><i class=" icon-ForwardLetter xlarg-text"></i></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { saveFile, converBase64toBlob, getPersianDate } from '@/util/utils';
import LetterAttachmentMobile from '@/components/MobileComponents/LetterDetailsMobile/LetterAttachmentMobile/LetterAttachmentMobile.vue';
import * as fileService from '@/store/Services/fileService';
import * as letterService from '@/store/Services/letterServices';
import Parts from '@/store/models/Letter/Parts';
import LetterTrailTreeMobile from './LetterTrailMobile/LetterTrailTreeMobile.vue';
import { LetterTrail } from '@/store/models/Letter/LetterTrail';
import * as $ from 'jquery';
import FinalizeLetterMobile from './FinalizeLetterMobile/FinalizeLetterMobile.vue';
import * as util from '@/util/utils.ts';
import { LetterSearchResult } from '../../../store/models/Letter/LetterSearchResult';
@Component({
    name:"SearchResultDetails",
    components:{LetterAttachmentMobile, LetterTrailTreeMobile, FinalizeLetterMobile}
})
export default class SearchResultDetailsMobile extends Vue {

    isReceived = true;
    pdfSrc = {} as any;
    @Prop() searchResult?: LetterSearchResult;
    @Watch("letter")
    onLetterChanged(newVal: LetterSearchResult, oldVal: LetterSearchResult){
        this.setIsReceived();
        this.setPdfUrl();
    }
    
       
    created(){
        this.setIsReceived();
    }
    get attachments(){
        
        const result: Parts[] = [];
        if(this.searchResult === undefined)return result;
        if(this.searchResult.parts === undefined || this.searchResult.parts === null)return result;
        for(let i = 1;i<this.searchResult.parts.length;i++){
            result.push(this.searchResult.parts[i]);
        }
        return result;
    }

    get letterTime(){
        
        if(!this.searchResult) return '';
        const date = new Date( this.searchResult.sendTime.substring(0,this.searchResult.sendTime.length -1));
        return (date).toLocaleTimeString();
    }

   
    
    setIsReceived(){
        this.isReceived = false;
        if(this.searchResult == undefined)return;
        if(this.searchResult.to === null)
            this.isReceived = true;
    }

    async downloadLetterPdf(){
        if(this.searchResult === undefined)return;
        if(this.searchResult.parts === undefined || this.searchResult.parts === null)return;
        const file = await fileService.getFile(this.searchResult.parts[0].file.id);
        const blob =  converBase64toBlob(file.content||"",'');
        saveFile(blob,file.extension);
    }
    pdfLoaded = false;
    async setPdfUrl(){
         if(this.searchResult === undefined)return;
        if(this.searchResult.parts === undefined || this.searchResult.parts === null)return;
            this.pdfLoaded = false;
            const file = await fileService.getFile(this.searchResult.parts[0].file.id);
            // const blob =  converBase64toBlob(file.content,file.extension);
            // this.pdfSrc = blob;
            // console.log(blob);
            this.pdfSrc = "data:application/pdf;base64," + file.content;
            this.pdfLoaded = true;

        
    }
    async mounted(){
        $("#options-dropdown").dropdown({action: 'hide',silent: true});
        await this.setPdfUrl();
    }

    finalizeLetter(){
        if(this.searchResult === undefined || this.searchResult === null) return;
        this.$emit('finalize-letter',this.searchResult.letterId);
    }
    forwardLetter(){
        if(this.searchResult)
            this.$emit('forward-letter',this.searchResult.letterId);
    }

}
</script>
<style lang="less" scoped>
</style>

