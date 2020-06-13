<template>
    <div class="three-part-flexbox">
        <button @click="test()">test</button>
       <div class="flex-part-top">
           <div id="comment-dimmer" class="ui page  dimmer ">
                <div class="content paraph-form">
                    <div class="paraph-title">هامش برای {{recipientForComment.nameOnly}}</div>
                    <div class="paraph-body">
                        <div >
                            <input list="list"  v-model="comment" style="width: 100%">
                            <datalist id="list">
                            <option v-for="item in autoCompleteData" :key="item.id" :value="item.name" ></option>
                            </datalist>
                        </div>
                        <div>
                            <div style="text-align: right;margin:3px 0" ><ToggleSwitch @checked-changed="applyToAllMainRecipients($event)"/> اعمال برای تمام گیرندگان اصلی</div>
                            <div style="text-align: right;margin:3px 0" ><ToggleSwitch @checked-changed="applyToAllCopyRecipients($event)"/> اعمال برای تمام گیرندگان رونوشت</div>
                        </div>
                        <div>
                            <button @click="confirmComment()" class="ui blue button">ثبت</button>
                            <button @click="cancelComment()" class="ui red button">انصراف</button>

                        </div>
                    </div>
                </div>
            </div>
            گیرنده اصلی:
           <div id="main-recipient-dropdown" class="ui fluid search selection dropdown" style="direction:ltr">
            <input type="hidden" >
            <i class="icon-dropdownArrow" style="right: 0"></i>
            <div class="left menu">
                <div class="item"  v-for="recipient in recipients" :key="recipient.id" >
                    <div @click="selectMainRecipient(recipient)" class="recipient-item"> 
                        <div style="flex:3;font-size:medium;text-align:right" >{{recipient.nameOnly}}</div>
                        <div style="flex:1;font-size:small" >{{recipient.post}}</div>
                    </div>
                </div>
            </div>
           </div>
           <RecipientSelector :recipients="selectedMainRecipients" 
           @recipient-removed="onMainRecipientRemoved($event)"
           @paraph="onParaph($event)"
           />

            گیرنده رونوشت:
           <div id="copy-recipient-dropdown" class="ui fluid search selection dropdown" style="direction:ltr">
            <input type="hidden" >
            <i class="icon-dropdownArrow" style="right: 0"></i>
            <div class="left menu">
                <div class="item"  v-for="recipient in recipients" :key="recipient.id" >
                    <div @click="selectCopyRecipient(recipient)" class="recipient-item"> 
                        <div style="flex:3;font-size:medium;text-align:right" >{{recipient.nameOnly}}</div>
                        <div style="flex:1;font-size:small" >{{recipient.post}}</div>
                    </div>
                </div>
            </div>
           </div>
           <RecipientSelector :recipients="selectedCopyRecipients" 
           @recipient-removed="onCopyRecipientRemoved($event)"
           @paraph="onParaph($event)"
           />
       </div>
       <div class="flex-part-middle" ></div>
       <div class="flex-part-bottom" ></div>
    </div>
   
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import * as letterOwnerService from '@/store/Services/letterOwnerService';
import store from '@/store';
import * as $ from 'jquery';
import RecipientSelector from './RecipientSelector/RecipientSelector.vue';
import { LetterOwnerWithFaxAndEmails } from '@/store/models/LetterOwner/LetterOwnerWithFaxAndEmails';
import {LetterOwnerWithSendingInformationAndAttachments } from '@/store/models/LetterOwner/LetterOwnerWithSendingInformationAndAttachments';
import * as autoCompleteDataService from '@/store/Services/autoCompleteDataService.ts';
import { AutoCompleteData } from '@/store/models/Letter/AutoCompleteData';
import ToggleSwitch from '@/components/UiComponents/ToggleSwitch.vue';
@Component({
    components: {RecipientSelector, ToggleSwitch}
})
export default class ForwardLetter extends Vue{
    recipients: LetterOwnerWithFaxAndEmails[] = [];
    recipientForComment?: LetterOwnerWithSendingInformationAndAttachments = {} as LetterOwnerWithSendingInformationAndAttachments;
    selectedMainRecipients:  LetterOwnerWithSendingInformationAndAttachments [] = [];
    selectedCopyRecipients:  LetterOwnerWithSendingInformationAndAttachments [] = [];
    autoCompleteData: AutoCompleteData[] = [];
    comment = '';
    shallApplyToAllMainRecipients =false;
    shallApplyToAllCopyRecipients = false;
    async created(){
        const ownerId = store.state.ownerId;
        this.recipients =   await letterOwnerService.getOwnerRecipients(ownerId);
    }
    async mounted(){
        $('#main-recipient-dropdown').dropdown({action:'hide',silent: true ,message: {noResults : 'یافت نشد'}});
        $('#copy-recipient-dropdown').dropdown({action:'hide',silent: true ,message: {noResults : 'یافت نشد'}});
       
    }
    test(){
        console.log(this.selectedMainRecipients);
    }
    getLetterOwnerWithSendingInfo(recipient: LetterOwnerWithFaxAndEmails): LetterOwnerWithSendingInformationAndAttachments{
        const result = {} as LetterOwnerWithSendingInformationAndAttachments;
        result.id = recipient.id;
        result.name = recipient.name;
        result.nameOnly = recipient.nameOnly;
        result.post = recipient.post;
        result.ownerType = recipient.ownerType;
        result.emails = [];
        if(recipient.emails)
            recipient.emails.forEach(email=>{
                result.emails.push(email);
            });
        result.shallReceiveSms = false;
        result.shallReceiveMessageViaMessagingApp = false;
        result.attachments = [];
        return result;
    }
    selectMainRecipient(recipient: LetterOwnerWithFaxAndEmails){
        let addedItem =  this.selectedMainRecipients.find(item=>item.id === recipient.id);
        if(!addedItem) 
            addedItem = this.selectedCopyRecipients.find(item=>item.id === recipient.id);
        if(!addedItem)
            this.selectedMainRecipients.push(this.getLetterOwnerWithSendingInfo(recipient));
    }
    onMainRecipientRemoved(id: string){
        const removedItem =  this.selectedMainRecipients.find(item=>item.id === id);
        if(!removedItem)return;
        const index =  this.selectedMainRecipients.indexOf(removedItem);
        this.selectedMainRecipients.splice(index,1);        
    }
    selectCopyRecipient(recipient: LetterOwnerWithFaxAndEmails){
        let addedItem =  this.selectedCopyRecipients.find(item=>item.id === recipient.id);
        if(!addedItem) 
            addedItem = this.selectedMainRecipients.find(item=>item.id === recipient.id);
        if(!addedItem)
            this.selectedCopyRecipients.push(this.getLetterOwnerWithSendingInfo(recipient));
    }
    onCopyRecipientRemoved(id: string){
        const removedItem =  this.selectedCopyRecipients.find(item=>item.id === id);
        if(!removedItem)return;
        const index =  this.selectedCopyRecipients.indexOf(removedItem);
        this.selectedCopyRecipients.splice(index,1);        
    }
    onParaph(recipientId: string){
        this.recipientForComment = this.selectedMainRecipients.find(item=>item.id === recipientId);
        if(!this.recipientForComment)
        {
            this.recipientForComment = this.selectedCopyRecipients.find(item=>item.id === recipientId);
            
        }
        if(this.recipientForComment){
            this.comment = this.recipientForComment.forwardingComment;
            $("#comment-dimmer").dimmer("show");
        }
    }
    applyToAllMainRecipients(checked: boolean){
        this.shallApplyToAllMainRecipients = checked;
    }

    applyToAllCopyRecipients(checked: boolean){
        this.shallApplyToAllCopyRecipients = checked;
    }

    confirmComment(){
        if(this.shallApplyToAllMainRecipients){
            this.selectedMainRecipients.forEach(item=>{
                item.forwardingComment = this.comment;
            });
        }
        if(this.shallApplyToAllCopyRecipients){
             this.selectedCopyRecipients.forEach(item=>{
                item.forwardingComment = this.comment;
            });
        }

        let currentRecipientId = '';
        if(this.recipientForComment)
            currentRecipientId = this.recipientForComment.id;
        let currentRecipient =  this.selectedMainRecipients.find(item=>item.id === currentRecipientId)
        if(currentRecipient)
        {
            const index =  this.selectedMainRecipients.indexOf(currentRecipient);
            this.selectedMainRecipients[index].forwardingComment = this.comment;
        }else{
            currentRecipient =  this.selectedCopyRecipients.find(item=>item.id === currentRecipientId)
            if(currentRecipient)
            {
                const index =  this.selectedCopyRecipients.indexOf(currentRecipient);
                this.selectedCopyRecipients[index].forwardingComment = this.comment;
            }   
        }
        $("#comment-dimmer").dimmer("hide");
    }
    cancelComment(){
         $("#comment-dimmer").dimmer("hide");
    }
}
</script>

<style lang="less" scoped>
    .recipient-item{
        display: flex;
        justify-content: space-between;
    }

    .paraph-form{
        border: 1px solid #939393;
        border-radius: 3px;
        background-color: #5f5f5f;
        min-width: 400px;
        min-height: 100px;
    }
    .paraph-body{
        padding: 5px;

    }
    .paraph-body>div{
        margin: 5px 0px;
    }
    .paraph-title{
        background-color: #3f3f3f;
        padding: 5px;
    }
</style>
