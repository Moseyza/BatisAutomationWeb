<template>
    <div class="single-recipient" >
        <div class="item-block" >
            <div class="xsmall-text nowrap" style="flex:3">{{recipient.nameOnly}}</div>
            <div class="xxsmall-text nowrap" style="flex:4">{{recipient.post}}</div>
            <div class="symmetric-grid" style="flex:2">
                <div @click="toggleMail()" > <i class="icon-mail icon" :class="{active: isMailActive}"></i> </div>
                <div @click="toggleTelegram()"> <i class="icon-telegram icon" :class="{active: this.recipient.shallReceiveMessageViaMessagingApp}"></i> </div>
                <div @click="toggleSms()" > <i   class="icon-sms icon" :class="{active: this.recipient.shallReceiveSms}"></i> </div>
                <div @click="remove()"> <i class="icon-x icon action-icon"></i> </div>
            </div>
        </div>
        <div class="item-block xxsmall-text">
            هامش:   <input type="text" list="items"  v-model="recipient.forwardingComment" >
                    <datalist id="items">
                        <option v-for="item in autoCompleteData" :key="item.id" :value="item.name" />
                    </datalist> 
                    <label v-if="!loadingFile" :for="fileInputId">
                        <i class="icon icon-paperclip action-icon"></i>
                        <input type="file" :id="fileInputId" style="display:none" >
                    </label>
                    <progress v-else :value="loadedPercent" max="100"></progress>
                    
        </div>
        <div class="item-block xxsmall-text" style="justify-content: flex-start;overflow-x: auto;" v-if="recipient.attachments.length > 0">
            پیوست:
            <LetterAttachment v-for="(file,index) in recipient.attachments" 
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
import LetterAttachment from '@/components/Cartable/LetterDetails/LetterAttachment/LetterAttachment.vue';
import * as util from '@/util/utils.ts';
import * as $ from 'jquery';
@Component({
    components: { LetterAttachment }
})
export default class SingleSelectedRecipient extends Vue{
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
    
    @Prop() recipient?: LetterOwnerWithSendingInformationAndAttachments;
    @Prop() autoCompleteData?: AutoCompleteData[];
    mounted(){
        $('#'+this.fileInputId).change(this.onFileChanged.bind(this));
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
        background-color: #3f3f3f;
        margin: 2px 2px;
        padding: 2px 5px;
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



