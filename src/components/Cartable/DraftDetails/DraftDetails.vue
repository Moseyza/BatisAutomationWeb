  <template>
    <div class="three-part-flexbox">
            <div style="flex:1"  class="flex-part-top" >
                <div class="symmetric-grid">
                <div style="flex:3">
                    <h4>{{letter.title}}</h4>
                </div>
                <div style="flex:1;justify-content:space-around" class="symmetric-grid">
                    <i class="action-icon icon-comment" style="font-size: x-large"></i>
                    <div class="popup" v-if="canFinalize" data-content='حذف پیش نویس' > <i  class="action-icon icon-Deleted" style="font-size:x-large" ></i></div>
                    <!-- <div id="options-dropdown"  class="ui icon top left dropdown">
  		                <i class="action-icon icon-threeDots" style="font-size: x-large"></i>
  		                <div class="menu">
    		                <div class="item menu-item" @click="finalizeLetter()" ><div style="padding-left:5px">اختتام</div> <i class="fixed-icon icon-closeLetter"></i> </div>
    		                <div class="item menu-item"><div style="padding-left:5px">چاپ</div> <i class="fixed-icon icon-print"></i></div>
    		                <div class="item menu-item"><div style="padding-left:5px">جریان وابستگی</div> <i class="fixed-icon icon-notRouted"></i></div>
                            <div class="item menu-item"><div style="padding-left:5px">مشاهده گزارش</div> <i class="fixed-icon icon-report"></i></div>
  		                </div>
	                </div> -->
                </div>
                </div>
                 <div>
                    <div>پیش نویس ها</div>
                </div>
            </div>
            <div style="flex:6" class="flex-part-middle">
           
            <div class="container3">
                <div>
                    <div>
                        {{letterTime}}
                    </div>
                    <div>
                        <LetterTrailTree :letterId="letter.letterPossessionId" :letterNo="letter.letterNo"></LetterTrailTree>
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
                <div v-if="letter.comment">
                    <div  style="margin: 10px 0">هامش: {{letter.comment}}</div>
                    <div class="symmetric-grid" style="padding:20px">
                        <div style="flex:1"></div>
                        <div style="flex:1"></div>
                    </div>
                </div>
                <div>
                    <div  class="symmetric-grid" style="margin-bottom: 5px">
                    <div  style="flex:1; margin-left:5px;">
                        پیش نویس 
                    </div>
                    <div style="flex:10">
                         <RecipientLookup   :recipients="recipients" @recipient-selected="selectRecipient($event, 'draft')"   />    
                    </div>
                    </div>
                    <div  class="symmetric-grid">
                    <div style="flex:1">
                    </div>
                    <FastSendRecipientSelector style="flex:10"  :autoCompleteDataType="'draft'" :recipients="selectedDraftRecipients" @recipient-removed="onRecipientRemoved($event,'draft')"/>
                    </div>
                    <div  class="symmetric-grid" style="margin-bottom: 5px">
                    <div style="flex:1;margin-left:5px">
                    اصلی
                    </div>
                    <div style="flex:10">
                    <RecipientLookup  :recipients="recipients" @recipient-selected="selectRecipient($event,'main')"   />    
                    </div>
                    </div>
            <div  class="symmetric-grid">
                <div style="flex:1">

                </div>
                <FastSendRecipientSelector  style="flex:10" :autoCompleteDataType="'all'" :recipients="selectedMainRecipients" @recipient-removed="onRecipientRemoved($event,'main')"/>
            </div>
            

            <div  class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1;margin-left:5px">
                 رونوشت 
                </div>
                <div style="flex:10">
                    <RecipientLookup   :recipients="recipients" @recipient-selected="selectRecipient($event,'copy')"   />    
                </div>
            </div>
            <div  class="symmetric-grid">
                <div style="flex:1">

                </div>
            <FastSendRecipientSelector style="flex:10" :autoCompleteDataType="'copy'"  :recipients="selectedCopyRecipients" @recipient-removed="onRecipientRemoved($event,'copy')"/>
            </div>
                </div>
                <!-- <div style="display:flex; height:100%">
                        <div style="padding:5px;flex:1;min-height:400px" class="ng-scope pdfobject-container">
                            <iframe v-if="pdfLoaded" :src="pdfSrc" type="application/pdf" width="100%" height="100%" style="overflow: auto;"></iframe>
                        </div>

                    
                </div> -->
            </div>
            </div>
        <div  style="flex:0 1 auto;display:flex;flex-direction:column;align-items:strech" class="flex-part-bottom">
            <div style="flex:1; display:flex;justify-content:space-around" class="container1">
              
                <div style="flex:1;text-align: center;" @click="forwardLetter()"  class=" action-icon">
                    <i class=" icon-send xlarg-text"></i>
                </div>
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
import LetterTrailTree from '@/components/Cartable/LetterDetails/LetterTrail/LetterTrailTree.vue';
import { LetterTrail } from '@/store/models/Letter/LetterTrail';
import * as $ from 'jquery';
import * as util from '@/util/utils.ts';
import { LetterSearchResult } from '../../../store/models/Letter/LetterSearchResult';
import { DraftLetter } from '../../../store/models/Letter/DraftLetter';
import RecipientLookup from '@/components/Cartable/ForwardLetter/RecipientLookup/RecipientLookup.vue';
import FastSendRecipientSelector from '@/components/Cartable/FastSend/FastSendRecipientSelector/FastSendRecipientSelector.vue';
import { LetterOwnerWithFaxAndEmails } from '@/store/models/LetterOwner/LetterOwnerWithFaxAndEmails';
import { LetterOwnerForSendingFaxAndEmailAndSms } from '@/store/models/LetterOwner/LetterOwnerForSendingFaxAndEmailAndSms';
import store from '@/store';
import * as letterOwnerService from '@/store/Services/letterOwnerService';
@Component({
    name:"DraftDetails",
    components:{LetterAttachment, LetterTrailTree, RecipientLookup, FastSendRecipientSelector}
})
export default class DraftDetails extends Vue {

    isReceived = true;
    pdfSrc = {} as any;
    @Prop() letter?: DraftLetter;
    @Watch("letter")
    onLetterChanged(newVal: DraftLetter, oldVal: DraftLetter){
        this.setPdfUrl();
        this.canFinalize = !newVal.isClosed;
        this.canReject = newVal.isClosed;
        console.log('__________________________');
        console.log(newVal.draftReceivers);
    }

    recipients: LetterOwnerWithFaxAndEmails[] = [];
    selectedMainRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];
    selectedDraftRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];
    selectedCopyRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];
    
       
    async created(){
        const ownerId = store.state.ownerId;
        this.recipients =   await letterOwnerService.getOwnerRecipients(ownerId);
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
        
        if(!this.letter) return '';
        const date = new Date( this.letter.sendTime.substring(0,this.letter.sendTime.length -1));
        return (date).toLocaleTimeString();
    }

   
    
 

    async downloadLetterPdf(){
        if(this.letter === undefined)return;
        if(this.letter.parts === undefined || this.letter.parts === null)return;
        const file = await fileService.getFile(this.letter.parts[0].file.id);
        const blob =  converBase64toBlob(file.content||"",'');
        saveFile(blob,file.extension);
    }
    pdfLoaded = false;
    async setPdfUrl(){
         if(this.letter === undefined)return;
         this.pdfLoaded = false;
        if(this.letter.parts === undefined || this.letter.parts === null)return;
            const file = await fileService.getFile(this.letter.parts[0].file.id);
            
            this.pdfSrc = "data:application/pdf;base64," + file.content;
            this.pdfLoaded = true;

        
    }
    async mounted(){
        $("#options-dropdown").dropdown({action: 'hide',silent: true});
        $("#return-dropdown").dropdown({action: 'nothing',silent: true});
        $(".popup").popup();
        await this.setPdfUrl();
    }

    finalizeLetter(){
        if(this.letter === undefined || this.letter === null) return;
        this.$emit('finalize-letter',this.letter.id);
    }
    canFinalize = true;
    canReject = false;
    finalizing = false;
    // async finalizeLetterFast(){
    //     if(!this.letter)return
    //     this.finalizing = true;
    //     this.canFinalize = false;
    //     const result =  await letterService.CloseLetterFast(this.letter.letterPossessionId);
    //     this.$emit('letter-closed-fast',this.letter.letterPossessionId);
    //     this.letter.isClosed = true;
    //     this.finalizing = false;
    //     this.canReject = true;
      
    // }
    // async restoreLetter(){
    //     if(!this.letter)return
    //     this.finalizing = true;
    //     this.canReject = false;
    //     const result =  await letterService.RejectClosedLetter(this.letter.letterPossessionId);
    //     this.$emit('closed-letter-rejected',this.letter.letterPossessionId);
    //     this.letter.isClosed = false;
    //     this.finalizing = false;
    //     this.canFinalize = true;
    // }
    // forwardLetter(){
    //     if(this.letter)
    //         this.$emit('forward-letter',this.letter.letterPossessionId);
    // }

    get receiversStr()
    {
        if(!this.letter)return '';
        if(!this.letter.recievers) return '';
        let result = '';
        this.letter.recievers.forEach(x=>{
            if(result !== '') result = result + ' | ' + x.nameOnly;
            else result = x.nameOnly;
        });
        return result;
    }

    sendFastDependOn(mode: string){
        this.$emit('send-fast-dependon',mode);
    }

}
</script>
<style lang="less" scoped>
.ld-rcvs{
    overflow: hidden;
    text-overflow: ellipsis;
}

</style>

