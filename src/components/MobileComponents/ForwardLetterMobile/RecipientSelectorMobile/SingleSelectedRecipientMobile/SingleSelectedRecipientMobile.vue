<template>
    <div class="single-recipient" >
        <div class="item-block" >
            <div class="xsmall-text nowrap" style="flex:3">{{recipient.nameOnly}}</div>
            <div class="xxsmall-text nowrap" style="flex:4">{{recipient.post}}</div>
            <div class="symmetric-grid" style="flex:2">
                <div @click="toggleMail()" > <i class="icon-email icon" :class="{active: isMailActive}"></i> </div>
                <div @click="toggleTelegram()"> <i class="icon-telegram icon" :class="{active: this.recipient.shallReceiveMessageViaMessagingApp}"></i> </div>
                <div @click="toggleSms()" > <i   class="icon-sms icon" :class="{active: this.recipient.shallReceiveSms}"></i> </div>
                <div @click="remove()"> <i class="icon-removeFile icon action-icon"></i> </div>
            </div>
        </div>
        <div class="item-block xxsmall-text">
            <div style="flex:0 1 auto"> هامش:</div>
             <CommentEditorMobile style="flex:1;width:100%"  @comment-changed="onCommentChanged($event)" :data="autoCompleteData"/>
                     <!-- <SimpleLookup
                    :validValues="autoCompleteValidValues" 
                    :color="'transparent'"
                    :allowUserEntry="true" 
                    @value-selected="onValueSelected($event)" 
                    @value-cleared="onValueCleared()"
                    /> -->
            <div style="flex:0 1 auto" >
                    <FileSelector @file-changed="onFileSelectorChanged($event)"/>
                    <progress v-if="loadingFile" :value="loadedPercent" max="100"></progress>
            </div>  
        </div>
        <div class="item-block xxsmall-text" style="justify-content: flex-start;overflow-x: auto;" v-if="recipient.attachments.length > 0">
            پیوست:
            <LetterAttachmentMobile v-for="(file,index) in recipient.attachments" 
            :key="index"
            :canRemove=true
            :file ="file"
            :index ="index"
            @remove="onAttachmentRemoved($event)"
            />
        </div>
        <div v-if="isMailActive && recipient.emails.length >0" class="item-block xxsmall-text">
             ایمیل:  
            <div class="symmetric-grid" style="overflow-x:auto;overflow-y:hidden;margin-right:2px">
                <div style="min-width: fit-content;" v-for="(email , index) in recipient.emails" :key="index">
                    <input id="mail" type="checkbox" v-model="email.canBeUsedForSending">
                    <label for="mail">{{email.email}}</label>
                    <i v-if="index < recipient.emails.length - 1" class="icon icon-verticalLine"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component , Prop} from 'vue-property-decorator';
import { LetterOwnerWithSendingInformationAndAttachments } from '@/store/models/LetterOwner/LetterOwnerWithSendingInformationAndAttachments';
import { AutoCompleteData } from '@/store/models/Letter/AutoCompleteData';
import File from '@/store/models/Letter/File';
import LetterAttachmentMobile from '@/components/MobileComponents/LetterDetailsMobile/LetterAttachmentMobile/LetterAttachmentMobile.vue';
import * as util from '@/util/utils.ts';
import * as $ from 'jquery';
import FileSelector from '@/components/UiComponents/FileSelector.vue';
import * as autoCompleteDataService from '@/store/Services/autoCompleteDataService.ts';
import SimpleLookupMobile from '@/components/MobileComponents/EnterpriseFormMobile/SimpleLookupMobile/SimpleLookupMobile.vue';
import { ValidValuesForSingleColumn, ValidValues } from '@/store/models/EnterpriseForm/EnterpriseFormValidValues';
import CommentEditorMobile from '@/components/MobileComponents/ForwardLetterMobile/RecipientSelectorMobile/CommentEditorMobile/CommentEditorMobile.vue';

@Component({
    components: { LetterAttachmentMobile, FileSelector ,SimpleLookupMobile, CommentEditorMobile}
})
export default class SingleSelectedRecipientMobile extends Vue{
    isTelegramActive = false;
    isMailActive = false;
    isSmsActive = false;
    loadingFile = false;
    loadedPercent = 0;
    currentAttachedFileName = '';
    get fileInputId(){
        if(this.recipient)
            return 'file-' + this.recipient.id;
        return '';
    }

    get dataListId(){
         if(this.recipient)
            return 'list-' + this.recipient.id;
        return '';
    }
    
    @Prop() recipient?: LetterOwnerWithSendingInformationAndAttachments;
    autoCompleteData = [] as AutoCompleteData[];
    @Prop() autoCompleteDataType?: string;
    async mounted(){
           if(this.autoCompleteDataType === 'all')
            this.autoCompleteData =  await autoCompleteDataService.getForwardingAutoCompleteData();
         else if(this.autoCompleteDataType === 'copy')
            this.autoCompleteData = await autoCompleteDataService.getSendCopyAutoCompleteData();
         else if(this.autoCompleteDataType === 'draft')
            this.autoCompleteData = await autoCompleteDataService.getSendDraftAutoCompleteData();
    }
    get autoCompleteValidValues(){
        const result = [] as ValidValues[];
        if(!this.autoCompleteData)return result;
        this.autoCompleteData.forEach(d=>{
            const validVal = {} as ValidValues;
            validVal.item1 = d.id;
            validVal.item2 = d.name;
            result.push(validVal);
        });
        return result;
    }
    remove(){
        if(this.recipient)
            this.$emit('recipient-removed',this.recipient.id);
    }
    toggleTelegram(){
        if(!this.recipient)return;
        this.recipient.shallReceiveMessageViaMessagingApp = !this.recipient.shallReceiveMessageViaMessagingApp;
    }
    toggleSms(){
        if(!this.recipient)return;
        this.recipient.shallReceiveSms = !this.recipient.shallReceiveSms
        
    }
    toggleMail(){
        this.isMailActive = !this.isMailActive;
        if(this.recipient){
            if(this.recipient.emails.length > 0 && this.isMailActive )
                this.recipient.emails[0].canBeUsedForSending = true;
            else{
                this.recipient.emails.forEach(mail=>{mail.canBeUsedForSending = false;});
            }
        }
    }
    paraph(){
        if(this.recipient)
            this.$emit("paraph",this.recipient.id);
    }
    onFileSelectorChanged(file: any){
        const reader = new FileReader();
        reader.addEventListener("progress",(evt)=>{
            this.loadedPercent = (evt.loaded / evt.total) * 100;
        });
        reader.addEventListener("loadend",(x)=>{
            const attachedFile = {} as File;
            if(x.target && this.recipient)
            {
                attachedFile.id = '00000000-0000-0000-0000-000000000000';
                attachedFile.extension = file.name;
                attachedFile.content = (x.target as any).result;
                this.recipient.attachments.push(attachedFile);
            }
            this.loadingFile = false;
        });
        
        this.loadingFile = true;
        reader.readAsDataURL(file);
        
    }
    onFileChanged(e: any){
        if(!this.recipient)return;
        const file = e.target.files[0];
        this.currentAttachedFileName = file.currentAttachedFileName;
        const reader = new FileReader();
        reader.addEventListener("progress",(evt)=>{
            this.loadedPercent = (evt.loaded / evt.total) * 100;
        });
        reader.addEventListener("loadend",(x)=>{
            const attachedFile = {} as File;
            if(x.target && this.recipient)
            {
                attachedFile.id = '00000000-0000-0000-0000-000000000000';
                attachedFile.extension = file.name;
                attachedFile.content = (x.target as any).result;
                this.recipient.attachments.push(attachedFile);
            }
            this.loadingFile = false;
        });
        
        this.loadingFile = true;
        reader.readAsDataURL(file);
    }

    onAttachmentRemoved(index: number){
        if(this.recipient){
            this.recipient.attachments.splice(index,1);
        }
    }

    onValueSelected(val: ValidValues){
        if(!this.recipient)return;
        this.recipient.forwardingComment = val.item2;
    }

    onValueCleared(){
        if(!this.recipient)return;
        this.recipient.forwardingComment = "";
    }
    onCommentChanged(comment: string){
        
         if(!this.recipient)return;
        this.recipient.forwardingComment = comment;
    }
   
}
</script>

<style lang="less" scoped>

    .single-recipient{
        margin: 2px 2px 5px 5px;
    }
    .item-block{
        display: flex;
        justify-content: space-between;
        width: 350px;
        border-radius: 3px;
        margin: 2px 2px;
        padding: 2px 5px;
        background-color: var(--LineItem);
    }

    .active{
        color: #69b578;
    }
    .icon{
        font-size: medium !important;
    }
    input[type=text]{
        width: 100%;
        background-color: transparent;
        border: none;
        color:inherit;
        padding: 0 2px;
    }
    input[type=checkbox]{
        vertical-align: middle;
    }
</style>



