<template>
    <div class="three-part-flexbox">
        <!-- <div   id="main-container" > -->
            <div style="flex:1"  class="flex-part-top" >
                <div class="symmetric-grid">
                <div style="flex:3">
                    <h3>{{letter.title}}</h3>
                </div>
                <div style="flex:1" class="symmetric-grid">
                    <i class="action-icon icon-comment"></i>
                    <i class="action-icon icon-closedLetter"></i>
                    <i class="action-icon icon-threeDots"></i>
                </div>
                </div>
                 <div>
                    <div v-if="isReceived">نامه های دریافتی</div>
                    <div v-else>نامه های ارسالی</div>
                </div>
            </div>
            <div style="flex:6" class="flex-part-middle">
           
            <div class="container3">
                <div class="symmetric-grid">
                    <h4 class="highlight" v-if="isReceived">{{letter.sender.nameOnly}}</h4>
                    <div v-else>
                        <div v-for="receiver in letter.recievers" :key="receiver.id"><h4 class="highlight">{{receiver.nameOnly}}</h4> <br/></div>
                    </div>
                    <div>
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
            <div>
                <div v-if="letter.comment !==''">
                    <div style="margin: 10px 0">هامش: {{letter.comment}}</div>
                    <div class="symmetric-grid" style="padding:20px">
                        <div style="flex:1"></div>
                        <div style="flex:2;border-bottom:2px #e7e7e7 solid;"></div>
                        <div style="flex:1"></div>
                    </div>
                </div>
                <div>
                    <p>
                        {{letter.abstract}}
                    </p>
                </div>
            </div>
            </div>
        <!-- </div> -->
        <div  style="flex:.5 1 0;display:flex;flex-direction:column;align-items:strech" class="flex-part-bottom">
            <div style="flex:1; display:flex;justify-content:space-around" class="container5">
                <div style="flex:1;text-align: center;"><i class="icon-download action-icon"></i></div>
                <div style="flex:1;text-align: center;"><i class="icon-download action-icon"></i></div>
                <div style="flex:1;text-align: center;"><i class="icon-download action-icon"></i></div>
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
@Component({
    components:{LetterAttachment, LetterTrailTree}
})
export default class LetterDetails extends Vue {

    isReceived = true;
    @Prop() letter?: Letter;
    @Watch("letter")
    onLetterChanged(newVal: Letter, oldVal: Letter){
        this.setIsReceived();
        //this.getLetterTrail();
    }
    created(){
        this.setIsReceived();
        //this.getLetterTrail();
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
        const date = new Date( this.letter.sendTime);
        date.setMinutes(date.getMinutes() - 270);
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
    
    
}
</script>
<style lang="less" scoped>
    #main-container{
       //display: flex;
    }
</style>

