<template>
    <div class="three-part-flexbox">
        <div style="flex:0 1 auto" class="flex-part-top">
            <div style="flex:1;" class="endalign-grid">
                <div class="popup"  data-content='حذف پیش نویس'> <i class="action-icon icon-Deleted" style="font-size:x-large"></i></div>
                <div class="popup"  data-content='یادداشت شخصی'> <i class="action-icon icon-comment" style="font-size:x-large"></i></div>
                <div class="popup"  data-content='پیگیری نامه'> <i class="action-icon icon-letterTrail" style="font-size:x-large"></i></div>
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
                        <PrioritySelector @priority-changed="onPriorityChanged($event)" />
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
            </div>
        </div>
        <div style="flex:0 1 auto;display:flex;flex-direction:column;align-items:strech" class="flex-part-bottom">
            <div style="flex:1; display:flex;justify-content:space-around" class="container1">
                <div style="flex:1;text-align: center;" @click="forwardLetter()" class=" action-icon">
                    <i class=" icon-saveDraft xlarg-text"></i>
                </div>
                <div style="flex:1;text-align: center;" @click="forwardLetter()" class=" action-icon">
                    <i class=" icon-send xlarg-text"></i>
                </div>
            </div>
        </div>
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
@Component({
    name: "DraftDetails",
    components: { LetterAttachment, LetterTrailTree, RecipientLookup, FastSendRecipientSelector , PrioritySelector, FileSelector}
})
export default class DraftDetails extends Vue {

    isReceived = true;
    pdfSrc = {} as any;
    loadedPercent = 0;
    attachments = [] as File[];
    priority = 0;
    loadingFile = false;
    @Prop() letter?: DraftLetter;
    @Watch("letter")
    onLetterChanged(newVal: DraftLetter, oldVal: DraftLetter) {
        this.setPdfUrl();
        this.loadSelectedRecipients();
    }

    recipients: LetterOwnerWithFaxAndEmails[] = [];
    selectedMainRecipients: LetterOwnerForSendingFaxAndEmailAndSms[] = [];
    selectedDraftRecipients: LetterOwnerForSendingFaxAndEmailAndSms[] = [];
    selectedCopyRecipients: LetterOwnerForSendingFaxAndEmailAndSms[] = [];
    @Prop() dependentLetters?: DependentLetter[];

    async created() {
        const ownerId = store.state.ownerId;
        this.recipients = await letterOwnerService.getOwnerRecipients(ownerId);
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
        const file = await fileService.getFile(this.letter.parts[0].file.id);

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
        this.selectedDraftRecipients = [];
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

