<template>
    <div class="three-part-flexbox">
            <div style="flex:0 1 auto"  class="flex-part-top" >
                <div class="symmetric-grid">
                <div style="flex:3">
                    <h4 style="margin-right:5px;color:var(--TxtColor);">{{letter.title}}</h4>
                </div>
                <div style="flex:1;justify-content:space-around" class="symmetric-grid">
                    <div class="popup" data-content='یادداشت شخصی'> <i class="action-icon icon-comment" style="font-size: x-large"></i></div>
                    <div class="popup" v-if="canFinalize" data-content='اختتام سریع' @click="finalizeLetterFast" > <i  class="action-icon icon-closeFast" ></i></div>
                    <div v-if="finalizing" class="ui active inline small loader"></div>
                    <div style="padding-top:5px" class="popup" v-if="canReject" data-content='بازگردانی نامه' @click="restoreLetter" > <i  style="font-size:20pt" class="action-icon icon-rejectClose" ></i></div>
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
                 <!-- <div>
                    <div v-if="isReceived">نامه های دریافتی</div>
                    <div v-else>نامه های ارسالی</div>
                </div> -->
            </div>
            <div style="flex:6" class="flex-part-middle">
           
            <div class="container3">
                <div class="symmetric-grid" >
                    <h4 class="highlight" v-if="isReceived">{{letter.sender.nameOnly}}</h4>
                    <div class="ld-rcvs" v-else style="flex:1 0 auto">
                        <h5 class="ld-rcvs highlight">{{receiversStr}}</h5>
                    </div>
                    <div class="popup" data-content='دانلود_فایل_اصلی' style="flex:0 1 auto; text-align:end;">
                        <i @click="downloadLetterPdf()" class="helper-icon-large icon-download"></i>
                    </div>
                </div>
                <div>
                    <div style="color:var(--TxtColor) !important">
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
            <div  style="height: 100%">
                <div v-if="letter.comment">
                    <div  style="margin: 10px 0;color:var(--TxtColor) !important">هامش: {{letter.comment}}</div>
                    <div class="symmetric-grid" style="padding:20px">
                        <div style="flex:1"></div>
                        <!-- <div style="flex:2;border-bottom:2px #e7e7e7 solid;"></div> -->
                        <div style="flex:1"></div>
                    </div>
                </div>
                <div style="display:flex;flex-direction:column;align-items: center; height:100%">
                    <!-- <p> -->
                        <!-- {{letter.abstract}} -->
                        <!-- <div class="action-button" style="font-size:x-large" @click="fitImage()" v-if="noPdfExists"><i class="icon icon-fitImage"></i></div> -->
                        <div  style="font-size:large;color:var(--color-success)" v-if="noPdfExists"> {{viewedFileName}} </div>
                        <div ref="previewContainer" style="padding:5px;flex:1;min-height:400px;width:100%; color:var(--TxtColor);" class="ng-scope pdfobject-container">

                            <span v-if="hasHtmlMainFile" v-html="htmlSrc"></span>
                            <div v-else-if="noPdfExists">
                                <img :src="pdfSrc" width="100%" height="100%" alt="مشاهده پیش نمایش امکان پذیر نیست" style="overflow: auto;color:var(--color-danger);min-height:100px;max-width:100%;max-height:100%"/>
                            </div>
                            <div v-else-if="pdfLoaded" style="width:100%;height:100%">
                                <iframe  :src="pdfSrc" type="application/pdf" width="100%" height="100%" style="overflow: auto;"></iframe>
                            </div>
                            <!--  -->
                            

                            
                        </div>
                        

                        <!-- <object :data="pdfSrc" type="application/pdf" width="100%" >
                            <p><b>Example fallback content</b>: This browser does not support PDFs. Please download the PDF to view it: <a href="/pdf/sample.pdf">Download PDF</a>.</p>
                        </object> -->
                    <!-- </p> -->
                </div>
            </div>
        </div>
        <div  style="flex:0 1 auto;display:flex;flex-direction:column;align-items:strech" class="flex-part-bottom">
            <div style="flex:1; display:flex;justify-content:space-around" class="container1">
                <div v-if="nextEnterpriseForms.length>0" style="flex:1;text-align: center;" class="action-icon">
                    <div style="flex:1" id="nextforms-dropdown"  class="ui icon pointing  bottom left  dropdown">
  		                <i class=" icon-enterpriseForm xlarg-text"></i>
  		                <div class="menu">
    		                <div v-for="form in nextEnterpriseForms" :key="form.id" class="item menu-item" style="max-height:10px !important;padding:0 5px !important"><div style="padding-left:5px" @click="loadNextForm(form.id)" >{{form.name}}</div> </div>
  		                </div>
	                </div>
                </div>
                <div style="flex:1;text-align: center;" class="action-icon">
                    <div style="flex:1" id="return-dropdown"  class="ui icon top left dropdown">
  		                <i class=" icon-replay xlarg-text"></i>
  		                <div class="menu">
    		                <div class="item menu-item" style="max-height:10px !important;padding:0 5px !important"><div style="padding-left:5px">عطف</div> <i class="action-icon icon-SendLetterFast" @click="sendFastDependOn('bending')"></i> </div>
    		                <div class="item menu-item" style="max-height:10px !important;padding:0 5px !important"><div style="padding-left:5px">پیرو</div> <i class="action-icon icon-SendLetterFast"  @click="sendFastDependOn('following')"></i></div>
    		                <div class="item menu-item" style="max-height:10px !important;padding:0 5px !important"><div style="padding-left:5px">بازگشت</div> <i class="action-icon icon-SendLetterFast"  @click="sendFastDependOn('returning')"></i></div>
                            <div class="item menu-item" style="max-height:10px !important;padding:0 5px !important"><div style="padding-left:5px">پیوست به</div> <i class="action-icon icon-SendLetterFast"  @click="sendFastDependOn('attaching')"></i></div>
  		                </div>
	                </div>
                </div>
                <div style="flex:1;text-align: center;" @click="forwardLetter()"  class=" action-icon">
                    <i class=" icon-ForwardLetter xlarg-text"></i>
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
import LetterTrailTree from './LetterTrail/LetterTrailTree.vue';
import { LetterTrail } from '@/store/models/Letter/LetterTrail';
import * as $ from 'jquery';
import FinalizeLetter from './FinalizeLetter/FinalizeLetter.vue';
import * as util from '@/util/utils.ts';
import { LetterSearchResult } from '../../../store/models/Letter/LetterSearchResult';
import * as enterpriseFormService from '@/store/Services/enterpriseFormService';
import store from '@/store';
import { EnterpriseForm } from '@/store/models/EnterpriseForm/EnterpriseForm';


@Component({
    name:"LetterDetails",
    components:{LetterAttachment, LetterTrailTree, FinalizeLetter}
})
export default class LetterDetails extends Vue {
   
    isReceived = true;
    pdfSrc = {} as any;
    @Prop() letter?: Letter;
    nextEnterpriseForms = [] as EnterpriseForm[];
    @Watch("letter")
    onLetterChanged(newVal: Letter, oldVal: Letter){
        // if(this.letter){
        //     alert(this.letter.id);
        //     alert(this.letter.letterPossessionId);
        // }
        console.log(this.letter);
        this.setIsReceived();
        this.setPdfUrl();
        this.canFinalize = !newVal.isClosed;
        this.canReject = newVal.isClosed;
        this.nextEnterpriseForms = [];
        this.loadNextForms();
    }
    
    created(){
        this.setIsReceived();
        this.loadNextForms();
        if(this.letter){
            this.canFinalize = !this.letter.isClosed;
            this.canReject = this.letter.isClosed;
        }
        store.state.eventHub.$on('show-file-requested',this.onShowFileRequested);
    }
    viewedFileName = "";
    async onShowFileRequested(fileId: string)
    {
        
                const file = await fileService.getFile(fileId);
                if(file.extension.toLowerCase().includes("pdf")){
                    //for pdf insert code here
                    this.noPdfExists = false;
                    this.pdfSrc = "data:application/pdf;base64," + file.content;
                    this.viewedFileName = file.extension;
                    this.hasHtmlMainFile = false;
                    this.pdfLoaded = true;
                }
                else{
                  
                    this.noPdfExists = true;
                    this.pdfSrc = "data:image/png;base64," + file.content;
                    this.viewedFileName = file.extension;
                    this.hasHtmlMainFile = false;
                }
                
            
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
    pdfLoaded = false;
    noPdfExists = false;
    htmlSrc = "";
    hasHtmlMainFile = false;
    async setPdfUrl(){
         if(this.letter === undefined)return;
         this.pdfLoaded = false;
         this.noPdfExists = false;
        if(this.letter.parts === undefined || this.letter.parts === null)return;
            const file = await fileService.getFile(this.letter.parts[0].file.id);
            if(this.letter.parts[0].file.extension.toLowerCase().includes('.html')){
                this.htmlSrc = util.b64DecodeUnicode(file.content);
                this.hasHtmlMainFile = true;
            }
            else if(this.letter.parts[0].file.extension.toLowerCase().includes('.pdf')){
                this.pdfSrc = "data:application/pdf;base64," + file.content;
                this.pdfLoaded = true;
                this.hasHtmlMainFile = false;
            }else{
                this.noPdfExists = true;
                this.pdfSrc = "data:image/png;base64," + file.content;
                this.hasHtmlMainFile = false;
        }
    }
    async mounted(){
        $("#options-dropdown").dropdown({action: 'hide',silent: true});
        $("#return-dropdown").dropdown({action: 'nothing',silent: true});
        $(".popup").popup();
        await this.setPdfUrl();
    }

    updated(){
         $("#nextforms-dropdown").dropdown({action: 'hide',silent: true});
    }

    finalizeLetter(){
        if(this.letter === undefined || this.letter === null) return;
        this.$emit('finalize-letter',this.letter.id);
    }
    canFinalize = true;
    canReject = false;
    finalizing = false;
    async finalizeLetterFast(){
        if(!this.letter)return
        this.finalizing = true;
        this.canFinalize = false;
        const result =  await letterService.CloseLetterFast(this.letter.letterPossessionId);
        this.$emit('letter-closed-fast',this.letter.letterPossessionId);
        this.letter.isClosed = true;
        this.finalizing = false;
        this.canReject = true;
      
    }
    async restoreLetter(){
        if(!this.letter)return
        this.finalizing = true;
        this.canReject = false;
        const result =  await letterService.RejectClosedLetter(this.letter.letterPossessionId);
        this.$emit('closed-letter-rejected',this.letter.letterPossessionId);
        this.letter.isClosed = false;
        this.finalizing = false;
        this.canFinalize = true;
    }
    forwardLetter(){
        if(this.letter)
            this.$emit('forward-letter',this.letter.letterPossessionId);
    }

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

    async loadNextForms(){
        if(!this.letter)return;
        if(!this.letter.isEnterpriseForm) return;
        const ownerId =  store.state.ownerId;
        const letterId = this.letter.id;
        const forms = await enterpriseFormService.getNextForms(letterId,ownerId);
        this.nextEnterpriseForms = forms;
       
    }

    loadNextForm(formId: string){
        //const nextForm =  this.nextEnterpriseForms.find(form=>form.id === formId);
        if(!this.letter)return;
        const request  = {} as any;
        request.formId = formId;
        request.letterId = this.letter.id;
        request.ownerId = store.state.ownerId;
        request.possessionId = this.letter.letterPossessionId;
        this.$emit('next-form-selected',request);
    }

    fitImage(){
        console.log($(this.$refs.previewContainer).find('img'));
    }

    
}
</script>
<style lang="less" scoped>
.ld-rcvs{
    overflow: hidden;
    text-overflow: ellipsis;
}

</style>

