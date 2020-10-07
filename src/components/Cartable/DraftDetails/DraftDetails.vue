<template>
    <div class="three-part-flexbox">
        <div style="flex:0 1 auto" class="flex-part-top">
            <div style="flex:1;" class="endalign-grid">
                <div class="popup"  data-content='حذف پیش نویس' @click="deleteDraft()"> <i class="action-icon icon-Deleted" style="font-size:x-large"></i></div>
                <div class="popup"  data-content='یادداشت شخصی'> <i class="action-icon icon-comment" style="font-size:x-large"></i></div>
                <div class="popup"  data-content='پیگیری نامه' @click="showTrail()"> <i class="action-icon icon-letterTrail" style="font-size:x-large"></i></div>
            </div>
        </div>
        <div style="flex:6" class="flex-part-middle">   
            <div style="height: 100%">
                <div class="symmetric-grid" style="margin-bottom: 5px">
                    <div style="flex:1;margin-left:5px">
                        عنوان
                    </div>
                    <div style="flex:10; width:100%; padding: 5px; margin-right:2px;border-radius:5px" class="bg1">
                        <input v-model="letter.title" type="text" class="fc1" style="width:100%;background-color:transparent;border:none">
                    </div>
                </div>
                <div>
                    <div class="symmetric-grid" style="margin-bottom: 5px">
                        <div style="flex:1; margin-left:5px;">
                            پیش نویس
                        </div>
                        <div style="flex:10">
                            <RecipientLookup :recipients="recipients" @recipient-selected="selectRecipient($event, 'draft')" />
                        </div>
                    </div>
                    <div class="symmetric-grid">
                        <div style="flex:1"></div>
                        <FastSendRecipientSelector style="flex:10" :autoCompleteDataType="'draft'" :recipients="selectedDraftRecipients" @recipient-removed="onRecipientRemoved($event,'draft')" />
                    </div>
                    <div class="symmetric-grid" style="margin-bottom: 5px">
                        <div style="flex:1;margin-left:5px">
                            اصلی
                        </div>
                        <div style="flex:10">
                            <RecipientLookup :recipients="recipients" @recipient-selected="selectRecipient($event,'main')" />
                        </div>
                    </div>
                    <div class="symmetric-grid">
                        <div style="flex:1"></div>
                        <FastSendRecipientSelector style="flex:10" :autoCompleteDataType="'all'" :recipients="selectedMainRecipients" @recipient-removed="onRecipientRemoved($event,'main')" />
                    </div>
                    <div class="symmetric-grid" style="margin-bottom: 5px">
    
                        <div style="flex:1;margin-left:5px">
                            رونوشت
                        </div>
                        <div style="flex:10">
                            <RecipientLookup :recipients="recipients" @recipient-selected="selectRecipient($event,'copy')" />
                        </div>
                    </div>
                    <div class="symmetric-grid">
                        <div style="flex:1"></div>
                        <FastSendRecipientSelector style="flex:10" :autoCompleteDataType="'copy'" :recipients="selectedCopyRecipients" @recipient-removed="onRecipientRemoved($event,'copy')" />
                    </div>
                </div>
                <div class="symmetric-grid" style="margin-bottom: 5px">
                    <div style="flex:1;margin-left:5px">
                        فوریت
                    </div>
                    <div style="flex:10; width:100%;min-height: 26px;padding-top:3px; border-radius:5px" class="bg1">
                        <PrioritySelector @priority-changed="onPriorityChanged($event)" :priority="letter.priority" />
                    </div>
                </div>
                <div class="symmetric-grid" style="margin-bottom: 5px">
                    <div style="flex:1;margin-left:5px">
                        وابستگی
                    </div>
                    <div style="flex:10; display:flex; width:100%;border-radius:5px;background-color:transparent;">
                        <div style="display:flex;flex-direction:column; width:100%">
                            <DependentItem :letter="item" v-for="(item,index) in dependentLetters" :key="index" />
                        </div>
                    </div>
                </div>
                <div class="symmetric-grid" style="margin-bottom: 5px">
                    <div style="flex:1;margin-left:5px">
                        پیوست
                    </div>
                    <div style="flex:10; display:flex; width:100%;border-radius:5px;background-color:transparent;">
                        <div style="flex:5;justify-content:flex-start;flex-wrap:wrap" class="symmetric-grid">
                            <LetterAttachment v-for="(file,index) in attachments" :key="index" :canRemove=true :file="file" :index="index" @remove="onAttachmentRemoved($event)" style="margin:2px" />
                        </div>
                        <div style="flex:1; display:flex; justify-content:flex-end" class="large-text action-icon">
                            <FileSelector @file-changed="onFileSelectorChanged($event)" />
                            <progress v-if="loadingFile" :value="loadedPercent" max="100"></progress>
                        </div>
                    </div>
                </div>
                <div style="display:flex; height:100%">
                    <div style="padding:5px;flex:1;min-height:400px" class="ng-scope pdfobject-container">
                            <iframe v-if="pdfLoaded" :src="pdfSrc" type="application/pdf" width="100%" height="100%" style="overflow: auto;"></iframe>
                    </div>
                </div>
            </div>
        </div>
        <div style="flex:0 1 auto;display:flex;flex-direction:column;align-items:strech" class="flex-part-bottom">
            <InPlaceMessageBox 
            :message="message"
            :messageType="messageType"
            :buttons="msgBoxBtns"
            v-if="shallShowInPlaceMessageBox"
            @button-clicked="onMessageBoxButtonClick($event)"
            />
            <div v-else style="flex:1; display:flex;justify-content:space-around" class="container1">
                <div style="flex:1;text-align: center;" class=" action-icon">
                    <i class=" icon-saveDraft xlarg-text"></i>
                </div>
                <!-- <SendButtonWithOptions @send="send()" :signProp="sign" :setCopyProp="setCopy" @options-changed="toggleSendOption($event)"/> -->
                <div style="flex:1;text-align: center;" @click="send()" class=" action-icon">
                    <i class=" icon-send xlarg-text"></i>
                </div>
                
            </div>
        </div>
        
        <MessageBox 
        :message="message"
        :messageType="messageType"
        :buttons="msgBoxBtns"
        :isActive="shallShowMessageBox"
        @button-clicked="onMessageBoxButtonClick($event)"
        />
        <FullPageTrail  :isActive="shallShowTrail" @close="onLetterTrailClose" :letterPossessionId="letter.letterPossessionId" :letterNo="letter.letterNo" />
        <FullPageLoader :isActive="loading"/>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
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
import PrioritySelector from '@/components/Cartable/FastSend/PrioritySelector/PrioritySelector.vue';
import store from '@/store';
import * as letterOwnerService from '@/store/Services/letterOwnerService';
import { DependentLetter } from '@/store/models/Letter/DependentLetter';
import FileSelector from '@/components/UiComponents/FileSelector.vue';
import File from '../../../store/models/Letter/File';
import FullPageLoader from '@/components/UiComponents/FullPageLoader.vue';
import { LetterOwner } from '@/store/models/LetterOwner/LetterOwner';
import { LetterOwnerEmail } from '@/store/models/LetterOwner/LetterOwnerEmail';
import LetterReferencesToOtherLetters from '@/store/models/Letter/LetterReferencesToOtherLetters';
import MessageBox from '@/components/UiComponents/MessageBox.vue';
import InPlaceMessageBox from '@/components/UiComponents/InPlaceMessageBox.vue';
import FullPageTrail from '@/components/UiComponents/FullPageTrail.vue'
import SendButtonWithOptions from '@/components/Cartable/FastSend/SendButtonWithOptions.vue';
@Component({
    name: "DraftDetails",
    components: { LetterAttachment, LetterTrailTree, RecipientLookup, FastSendRecipientSelector , PrioritySelector, FileSelector, FullPageLoader, MessageBox, FullPageTrail,InPlaceMessageBox, SendButtonWithOptions}
})
export default class DraftDetails extends Vue {

    isReceived = true;
    pdfSrc = {} as any;
    loadedPercent = 0;
    attachments = [] as File[];
    priority = 0;
    loadingFile = false;
    loading = false;
    shallShowTrail = false;
    shallShowInPlaceMessageBox = false;
    sign = true;
    setCopy = true;
    @Prop() letter?: DraftLetter;
    @Watch("letter")
    async onLetterChanged(newVal: DraftLetter, oldVal: DraftLetter) {
        const ownerId = store.state.ownerId;
        this.recipients = [];
        this.loading = true;
        this.recipients = await letterOwnerService.getOwnerRecipients(ownerId);
        this.loadSelectedRecipients();
        this.setPdfUrl();
        this.setAttachments();
        this.loading = false;
        // console.log("_____________________________________");
        // console.log(newVal);
        // console.log("_____________________________________");
    }

    recipients: LetterOwnerWithFaxAndEmails[] = [];
    selectedMainRecipients: LetterOwnerForSendingFaxAndEmailAndSms[] = [];
    selectedDraftRecipients: LetterOwnerForSendingFaxAndEmailAndSms[] = [];
    selectedCopyRecipients: LetterOwnerForSendingFaxAndEmailAndSms[] = [];
    @Prop() dependentLetters?: DependentLetter[];

    async created() {
        const ownerId = store.state.ownerId;
        this.loading = true;
        this.recipients = await letterOwnerService.getOwnerRecipients(ownerId);
        this.loadSelectedRecipients();
        this.setPdfUrl();
        this.setAttachments();
        this.loading = false;
    }
 

    get letterTime() {

        if (!this.letter) return '';
        const date = new Date(this.letter.sendTime.substring(0, this.letter.sendTime.length - 1));
        return (date).toLocaleTimeString();
    }
    async downloadLetterPdf() {
        if (this.letter === undefined) return;
        if (this.letter.parts === undefined || this.letter.parts === null) return;
        const file = await fileService.getFile(this.letter.parts[0].file.id);
        const blob = converBase64toBlob(file.content || "", '');
        saveFile(blob, file.extension);
    }
    pdfLoaded = false;
    async setPdfUrl() {
        if (this.letter === undefined) return;
        this.pdfLoaded = false;
        if (this.letter.parts === undefined || this.letter.parts === null) return;
        const letterInfo =  this.getSendLetterDto();
        const file = await fileService.convertWordToPdf(this.letter.parts[0].file.id,letterInfo);
        this.pdfSrc = "data:application/pdf;base64," + file.content;
        this.pdfLoaded = true;


    }
    async mounted() {
        $("#options-dropdown").dropdown({ action: 'hide', silent: true });
        $("#return-dropdown").dropdown({ action: 'nothing', silent: true });
        $(".popup").popup();
        await this.setPdfUrl();
    }

    finalizeLetter() {
        if (this.letter === undefined || this.letter === null) return;
        this.$emit('finalize-letter', this.letter.id);
    }
    

    get receiversStr() {
        if (!this.letter) return '';
        if (!this.letter.recievers) return '';
        let result = '';
        this.letter.recievers.forEach(x => {
            if (result !== '') result = result + ' | ' + x.nameOnly;
            else result = x.nameOnly;
        });
        return result;
    }

    sendFastDependOn(mode: string) {
        this.$emit('send-fast-dependon', mode);
    }
    
    onFileSelectorChanged(file: any){
        
        const reader = new FileReader();
        reader.addEventListener("progress",(evt)=>{
            this.loadedPercent = (evt.loaded / evt.total) * 100;
        });
        reader.addEventListener("loadend",(x)=>{
            const attachedFile = {} as File;
            if(x.target)
            {
                attachedFile.id = '00000000-0000-0000-0000-000000000000';
                attachedFile.extension = file.name;
                attachedFile.content =  util.base64RemovePrefix((x.target as any).result);
                this.attachments.push(attachedFile);
            }
            this.loadingFile = false;
        });
        this.loadingFile = true;
        reader.readAsDataURL(file);
    }
    onAttachmentRemoved(index: number){
            this.attachments.splice(index,1);
    }
    onPriorityChanged(priority: string){
        if(priority === 'low')
            this.priority = 1;
        else if(priority === 'med')
            this.priority = 5;
        else if(priority === 'high')
            this.priority = 10;
    }
    selectRecipient(recipient: LetterOwnerWithFaxAndEmails, listName: string){
        let addedItem =  this.selectedMainRecipients.find(item=>item.id === recipient.id);
        if(!addedItem) 
            addedItem = this.selectedCopyRecipients.find(item=>item.id === recipient.id);
        if(!addedItem)
            addedItem = this.selectedDraftRecipients.find(item=>item.id === recipient.id);
        if(!addedItem){
            if(listName === 'main'){
                this.selectedMainRecipients.push(letterOwnerService.getLetterOwnerForSendingFaxAndEmailAndSms(recipient));
            }
            else if(listName === 'copy'){
                this.selectedCopyRecipients.push(letterOwnerService.getLetterOwnerForSendingFaxAndEmailAndSms(recipient));
            }
            else if(listName === 'draft'){
                this.selectedDraftRecipients.push(letterOwnerService.getLetterOwnerForSendingFaxAndEmailAndSms(recipient));
            }
            
        }
            
    }
    onRecipientRemoved(id: string, listName: string){

        let list = [] as LetterOwnerForSendingFaxAndEmailAndSms[];
        if(listName == 'main'){
            list = this.selectedMainRecipients;
        }
        else if(listName == 'draft'){
            list = this.selectedDraftRecipients;
        }
        else if(listName == 'copy'){
            list = this.selectedCopyRecipients;
        }
        const removedItem =  list.find(item=>item.id === id);
        if(!removedItem)return;
        const index =  list.indexOf(removedItem);
        list.splice(index,1);        
    }
    loadSelectedRecipients(){
        
        if(!this.letter)return;
        this.selectedMainRecipients = [];
        this.selectedCopyRecipients = [];
        this.selectedDraftRecipients= [];
        if(this.letter.draftReceivers && this.letter.draftReceivers.childMainReceivers){
            this.letter.draftReceivers.childMainReceivers.forEach(element => {
                const recipient =  this.recipients.find(x=>x.id === element.id);
                if(recipient){
                    element.nameOnly = recipient.nameOnly;
                    element.post = recipient.post;
                    element.emails = recipient.emails;
                    element.emails.forEach(email=>{
                        if(element.selectedEmails.find(x=>x === email.id)) email.canBeUsedForSending = true;
                    });
                    this.selectedMainRecipients.push(element);
                }
                    
                
            });
        }
        if(this.letter.draftReceivers && this.letter.draftReceivers.childCopyReceivers){
            this.letter.draftReceivers.childCopyReceivers.forEach(element => {
                const recipient =  this.recipients.find(x=>x.id === element.id);
                if(recipient){
                    element.nameOnly = recipient.nameOnly;
                    element.post = recipient.post;
                    element.emails = recipient.emails;
                    element.emails.forEach(email=>{
                        if(element.selectedEmails.find(x=>x === email.id)) email.canBeUsedForSending = true;
                    });
                    this.selectedCopyRecipients.push(element);
                }
            });
        }
        if(this.letter.draftReceivers && this.letter.draftReceivers.childDraftReceivers){
            this.setDraftReceiversRecursive(this.letter.draftReceivers.childDraftReceivers);
            this.selectedDraftRecipients.push(...this.letter.draftReceivers.childDraftReceivers);
        }

        
    }
    setDraftReceiversRecursive(draftReceivers: LetterOwnerForSendingFaxAndEmailAndSms[]){
            draftReceivers.forEach(element => {
                    const recipient =  this.recipients.find(x=>x.id === element.id);
                    if(recipient){
                        element.nameOnly = recipient.nameOnly;
                        element.post = recipient.post;
                        element.emails = recipient.emails;
                        element.emails.forEach(email=>{
                            if(element.selectedEmails.find(x=>x === email.id)) email.canBeUsedForSending = true;
                        });
                    if(element.childDraftReceivers)
                        this.setDraftReceiversRecursive(element.childDraftReceivers)
                }
                
            });
    }
    removeNotSelectedEmails(list: LetterOwnerForSendingFaxAndEmailAndSms[]){
        list.forEach(recipient=>{
            const emailsToRemove = [] as LetterOwnerEmail[];
            for(let i = 0;i<recipient.emails.length; i++ ){
                if(!recipient.emails[i].canBeUsedForSending)
                    emailsToRemove.push(recipient.emails[i]);
            }
            emailsToRemove.forEach(removingEmail=>{
                const index =  recipient.emails.indexOf(removingEmail);
                recipient.emails.splice(index,1);
            }); 
        });
    }
    getSendLetterDto(){
        if(!this.letter)return
        const dto = {} as any;
        dto.title = this.letter.title;
        dto.abstract = this.letter.abstract;
        dto.parts = [] as Parts[];
        if(this.letter.parts)
            dto.parts[0] = this.letter.parts[0];
        this.attachments.forEach((attachedItem,index)=>{
            const part = {} as Parts;
            part.partIndex = index;
            part.file = attachedItem;
            dto.parts.push(part);
        });
        const sender = {} as LetterOwner;
        sender.id = store.state.ownerId;
        dto.sender = sender;
        this.removeNotSelectedEmails(this.selectedMainRecipients);
        this.removeNotSelectedEmails(this.selectedCopyRecipients);
        this.removeNotSelectedEmails(this.selectedDraftRecipients);
        dto.recievers = this.selectedMainRecipients;
        dto.copyRecievers = this.selectedCopyRecipients;
        dto.draftRecievers = this.selectedDraftRecipients;
        dto.priority = this.priority;
         const tempArray = [] as LetterReferencesToOtherLetters[];
        if(this.dependentLetters){
           
            this.dependentLetters.forEach(x=>{
                const dependencyItem = {} as LetterReferencesToOtherLetters;
                dependencyItem.letterId = x.id;
                dependencyItem.letterTitle = x.title;
                dependencyItem.letterNo = x.letterNo;
                if(x.dependencyType === 'bending')//refrence
                    dependencyItem.dependencyType = 2
                else if(x.dependencyType === 'following')//follow
                    dependencyItem.dependencyType = 1
                else if(x.dependencyType === 'returning')//answer
                    dependencyItem.dependencyType = 0
                else if(x.dependencyType === 'attaching')//attach
                    dependencyItem.dependencyType = 3
                tempArray.push(dependencyItem);
                
            });
            dto.letterRefrences = tempArray;
        }
        //dto.transferType = this.letter.transferType;
        
        return dto;
    }
    msgBoxBtns = '';
    messageType = '';
    message = '';
    shallShowMessageBox = false;
    
    isLetterSent = false;
    mode = 'send';
    async send(){
        if(!this.letter)return;
        this.msgBoxBtns = 'ok';
        this.messageType = 'fail';
        if(this.letter.title.trim() === ''){
            this.message = 'عنوان نامه وارد نشده است';
            this.shallShowInPlaceMessageBox = true;
            return;
        }
        if(this.selectedMainRecipients.length === 0  && this.selectedDraftRecipients.length === 0)
        {
            this.message = 'هیچ گیرنده اصلی یا پیش نویس انتخاب نشده است';
            this.shallShowInPlaceMessageBox = true;
            return;
        }
      
        this.loading = true;
        let dto = {} as any;
        dto = this.getSendLetterDto();
        dto.parentDraftLetterId = this.letter.id;
        
        if(this.mode == 'send'){
            const info = await letterService.SendLetter(dto);
            if(info.letterNo !== '') this.message = `نامه با شماره ${info.letterNo} ارسال شد.`
            if(info.isAnyDraftSaved) 
            {
                if(this.message !== '') this.message = this.message + '\n';
                this.message = this.message + 'پیش نویس ارسال شد';
            }
            if(this.message != ''){
                this.msgBoxBtns = 'ok';
                this.messageType = 'success';
                this.shallShowInPlaceMessageBox = true;
                this.isLetterSent = true;
            }
            else{
                this.message = 'خطایی رخ داده است';
                this.msgBoxBtns = 'ok';
                this.messageType = 'fail';
                this.shallShowInPlaceMessageBox = true;

            }
        }
        else{
            // if(!shallSaveforSender){
            //     dto.sener = null;
            // }
            const request = {} as any;
            request.dto = dto;
            const info = await letterService.SaveDraft(request);
            if(info && info.isAnyDraftSaved){
                this.messageType = 'success';
                this.message = 'پیش نویس ارسال شد';
                this.msgBoxBtns = 'ok';
                this.shallShowInPlaceMessageBox = true;
                this.isLetterSent = true;
            }
        }
        this.loading = false;

    }
    setAttachments(){
        this.attachments = [];
        if(!this.letter)return;
        if(!this.letter.parts)return;
        for (let index = 1; index < this.letter.parts.length; index++) {
            this.attachments.push(this.letter.parts[index].file);
        }
    }
    deleteDraft(){
        if(!this.letter) return;
        if(this.letter.childLetters && this.letter.childLetters.length >0)
        {
            this.message = "حذف این نامه امکان پذیر نیست";
            this.messageType = "fail";
            this.msgBoxBtns = "ok";
            this.shallShowMessageBox = true;
            return;
        }
        this.messageType = "";
        this.message = 'آیا از حذف نامه اطمینان دارید؟';
        this.msgBoxBtns = 'yesNo';
        this.shallShowMessageBox = true;
    }
    async onMessageBoxButtonClick(button: string){
        this.shallShowMessageBox = false;          
        this.shallShowInPlaceMessageBox = false;
        if(button === 'yes'){
            this.shallShowMessageBox = false;
            letterService.deleteLetter(this.letter as Letter);
            this.$emit('delete-letter',this.letter);
        }
    }

    showTrail(){
        this.shallShowTrail = true;
    }

    onLetterTrailClose(){
        this.shallShowTrail = false;
    }
}
</script>
<style lang="less" scoped>
.ld-rcvs {
    overflow: hidden;
    text-overflow: ellipsis;
}

.endalign-grid>div {
    margin: 10px;
}
</style>

