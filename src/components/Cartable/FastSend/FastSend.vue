<template>
    <div class="three-part-flexbox">
  
        <div class="flex-part-top" style="flex:0.01"></div>
        <div class="flex-part-middle" style="flex:7">
            <div>
            <div class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1; margin-left:5px;">
                    گیرنده پیش نویس:  
                </div>
                <div style="flex:5">
                    <RecipientLookup   :recipients="recipients" @recipient-selected="selectRecipient($event, 'draft')"   />    
                </div>
            </div>
            <FastSendRecipientSelector  :autoCompleteDataType="'draft'" :recipients="selectedDraftRecipients" @recipient-removed="onRecipientRemoved($event,'draft')"/>
            <div class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1;margin-left:5px">
                    گیرنده اصلی:  
                </div>
                <div style="flex:5">
                    <RecipientLookup  :recipients="recipients" @recipient-selected="selectRecipient($event,'main')"   />    
                </div>
            </div>
            <FastSendRecipientSelector :autoCompleteDataType="'all'" :recipients="selectedMainRecipients" @recipient-removed="onRecipientRemoved($event,'main')"/>
            <div class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1;margin-left:5px">
                    گیرنده رونوشت:  
                </div>
                <div style="flex:5">
                    <RecipientLookup   :recipients="recipients" @recipient-selected="selectRecipient($event,'copy')"   />    
                </div>
            </div>
            <FastSendRecipientSelector :autoCompleteDataType="'copy'"  :recipients="selectedCopyRecipients" @recipient-removed="onRecipientRemoved($event,'copy')"/>
            <div class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1;margin-left:5px">
                    عنوان:
                </div>
                <div style="flex:5; width:100%; padding: 5px; margin-right:2px;border-radius:5px" class="bg1" >
                    <input v-model="title" type="text"  class="fc1" style="width:100%;background-color:transparent;border:none">
                </div>
            </div>
            <div class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1;margin-left:5px">
                    پیوست:
                </div>
                <div style="flex:5; display:flex; width:100%;border-radius:5px;background-color:transparent;"  >
                    
                    <div style="flex:5;justify-content:flex-start;overflow: auto" class="symmetric-grid" >
                        <LetterAttachment v-for="(file,index) in attachments" 
                        :key="index"
                        :canRemove=true
                        :file ="file"
                        :index ="index"
                        @remove="onAttachmentRemoved($event)"
                        style="margin:0 2px"
                        />
                    </div>
                    
                    <div style="flex:1; display:flex; justify-content:flex-end" class="large-text action-icon">
                        <FileSelector  @file-changed="onFileSelectorChanged($event)"/>
                        <progress v-if="loadingFile" :value="loadedPercent" max="100"></progress>
                    </div>

                </div>
                
            </div>
            </div>
            <div class="flex-part-bottom container chamfer fc1" style="min-height: 150px;margin-left:0;display:flex;flex-direction:column">
                <div>
                    متن نامه:
                </div>
                <div>
                    <textarea v-model="content" cols="30" rows="10"  class="fc1 bg1"   style="resize:vertical;width:100%;flex:1;padding:5px;" ></textarea>
                </div>
            </div>
        </div>
        <div class="flex-part-bottom container1" style="flex:0.3; margin-left:0">
            <div style="display:flex">
                    <div @click="cancel" class="action-icon bg1" style="flex:1;text-align:center"><i style="color:inherit" class="icon icon-x"></i></div>
                    <div @click="send" class="action-icon bg1" style="flex:1;text-align:center"><i style="color:inherit" class="icon icon-telegram"></i></div>
            </div>
        </div>
        <MessageBox 
       :isActive="shallShowMessageBox" 
       :buttons="msgBoxBtns" 
       :message="message"
       :messageType="messageType"
       @button-clicked="onMessageBoxBtnClicked($event)"/>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import RecipientLookup from '@/components/Cartable/ForwardLetter/RecipientLookup/RecipientLookup.vue';
import FastSendRecipientSelector from '@/components/Cartable/FastSend/FastSendRecipientSelector/FastSendRecipientSelector.vue';
import { LetterOwnerWithFaxAndEmails } from '@/store/models/LetterOwner/LetterOwnerWithFaxAndEmails';
import * as letterOwnerService from '@/store/Services/letterOwnerService';
import store from '@/store';
import { LetterOwnerForSendingFaxAndEmailAndSms } from '../../../store/models/LetterOwner/LetterOwnerForSendingFaxAndEmailAndSms';
import MessageBox from '@/components/UiComponents/MessageBox.vue';
import FileSelector from '@/components/UiComponents/FileSelector.vue';
import File from '../../../store/models/Letter/File';
import LetterAttachment from '@/components/Cartable/LetterDetails/LetterAttachment/LetterAttachment.vue';
import Parts from '../../../store/models/Letter/Parts';
import { LetterOwner } from '../../../store/models/LetterOwner/LetterOwner';
import * as letterService from '@/store/Services/letterServices';
import { isMoment } from 'moment';
import * as util from '@/util/utils';

@Component({
    components:{RecipientLookup, FastSendRecipientSelector, MessageBox, FileSelector, LetterAttachment}
})
export default class FastSent extends Vue{
    recipients: LetterOwnerWithFaxAndEmails[] = [];
    selectedMainRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];
    selectedDraftRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];
    selectedCopyRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];
    shallShowMessageBox = false;
    msgBoxBtns = 'ok';
    messageType = 'success';
    message="";
    title = '';
    content = '';
    loadingFile = false;
    loadedPercent = 0;
    currentAttachedFileName = '';
    isLetterSent = false;
    attachments = [] as File[];

    async created(){
        const ownerId = store.state.ownerId;
        this.recipients =   await letterOwnerService.getOwnerRecipients(ownerId);
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
    test(){
        console.log(this.selectedDraftRecipients);
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
    async send(){
        this.msgBoxBtns = 'ok';
        this.messageType = 'fail';
        if(this.title.trim() === ''){
            this.message = 'عنوان نامه وارد نشده است';
            this.shallShowMessageBox = true;
            return;
        }
        if(this.content === '' ){
            this.message = 'متن نامه وارد نشده است';
            this.shallShowMessageBox = true;
            return;
        }
        if(this.selectedMainRecipients.length === 0  && this.selectedDraftRecipients.length === 0)
        {
            this.message = 'هیچ گیرنده اصلی یا پیش نویس انتخاب نشده است';
            this.shallShowMessageBox = true;
            return;
        }
        const dto = {} as any;
        dto.stringContent = this.content;
        dto.abstract = this.content;
        dto.title = this.title;
        dto.parts = [] as Parts[];
        this.attachments.forEach((attachedItem,index)=>{
            const part = {} as Parts;
            part.partIndex = index;
            part.file = attachedItem;
            dto.parts.push(part);
        });
        const sender = {} as LetterOwner;
        sender.id = store.state.ownerId;
        dto.sender = sender;
        dto.recievers = this.selectedMainRecipients;
        dto.copyRecievers = this.selectedCopyRecipients;
        dto.draftRecievers = this.selectedDraftRecipients;
        dto.priority = 0;
        const info = await letterService.SendLetterFast(dto);
        if(info.letterNumber){
            this.message = `نامه با شماره ${info.letterNumber} ارسال شد.`
            this.msgBoxBtns = 'ok';
            this.messageType = 'success';
            this.shallShowMessageBox = true;
            this.isLetterSent = true;
        }
    

    }
    cancel(){
        this.msgBoxBtns = 'yesNo';
        this.message = "آیا مطمئن هستید؟";
        this.messageType = '';
        this.shallShowMessageBox = true;
    }
    onMessageBoxBtnClicked(btn: string){
        if(this.isLetterSent)
            this.$emit('fastsend-canceled');
        if(btn === 'ok' || btn === 'no')
            this.shallShowMessageBox = false;
        else if(btn === "yes"){
            this.shallShowMessageBox = false;
            this.$emit('fastsend-canceled');
        }
    }
    }

</script>