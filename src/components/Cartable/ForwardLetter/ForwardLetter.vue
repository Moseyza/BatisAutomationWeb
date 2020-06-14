<template>
    <div class="three-part-flexbox">
       <div class="flex-part-top">
            گیرنده اصلی:
           <!-- <div id="main-recipient-dropdown" class="ui fluid search selection dropdown" style="direction:ltr">
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
           </div> -->
           <RecipientLookup :recipients="recipients" @recipient-selected="selectMainRecipient($event)"/>
           <RecipientSelector :recipients="selectedMainRecipients" 
           @recipient-removed="onMainRecipientRemoved($event)"
           @paraph="onParaph($event)"
           />

            گیرنده رونوشت:
           <!-- <div id="copy-recipient-dropdown" class="ui fluid search selection dropdown" style="direction:ltr">
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
           </div> -->
           <RecipientLookup :recipients="recipients" @recipient-selected="selectCopyRecipient($event)"/>
           <RecipientSelector :recipients="selectedCopyRecipients" 
           @recipient-removed="onCopyRecipientRemoved($event)"
           @paraph="onParaph($event)"
           />
       </div>
       <div class="flex-part-middle" ></div>
       <div class="flex-part-bottom" >
           <div style="display:flex">
               <div @click="cancel" class="action-icon bg1" style="flex:1;text-align:center"><i style="color:inherit" class="icon icon-x"></i></div>
               <div @click="send" class="action-icon bg1" style="flex:1;text-align:center"><i style="color:inherit" class="icon icon-telegram"></i></div>
            </div>
        </div>
    </div>
   
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import * as letterOwnerService from '@/store/Services/letterOwnerService';
import * as letterService from '@/store/Services/letterServices';
import store from '@/store';
import * as $ from 'jquery';
import RecipientSelector from './RecipientSelector/RecipientSelector.vue';
import { LetterOwnerWithFaxAndEmails } from '@/store/models/LetterOwner/LetterOwnerWithFaxAndEmails';
import {LetterOwnerWithSendingInformationAndAttachments } from '@/store/models/LetterOwner/LetterOwnerWithSendingInformationAndAttachments';
import * as autoCompleteDataService from '@/store/Services/autoCompleteDataService.ts';
import { AutoCompleteData } from '@/store/models/Letter/AutoCompleteData';
import ToggleSwitch from '@/components/UiComponents/ToggleSwitch.vue';
import { LetterOwnerEmail } from '@/store/models/LetterOwner/LetterOwnerEmail';
import { Letter } from '@/store/models/Letter/Letter';
import * as util from '@/util/utils';
import RecipientLookup from './RecipientLookup/RecipientLookup.vue';
@Component({
    components: {RecipientSelector, ToggleSwitch, RecipientLookup}
})
export default class ForwardLetter extends Vue{
    recipients: LetterOwnerWithFaxAndEmails[] = [];
    selectedMainRecipients:  LetterOwnerWithSendingInformationAndAttachments [] = [];
    selectedCopyRecipients:  LetterOwnerWithSendingInformationAndAttachments [] = [];
    autoCompleteData: AutoCompleteData[] = [];
    @Prop() letter?: Letter;
    async created(){
        const ownerId = store.state.ownerId;
        this.recipients =   await letterOwnerService.getOwnerRecipients(ownerId);
    }
    async mounted(){
        $('#main-recipient-dropdown').dropdown({action:'hide',silent: true ,message: {noResults : 'یافت نشد'}});
        $('#copy-recipient-dropdown').dropdown({action:'hide',silent: true ,message: {noResults : 'یافت نشد'}});
       
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
    
    async send(){
        this.selectedMainRecipients.forEach(recipient=>{
            const emailsToRemove = [] as LetterOwnerEmail[];
            for(let i = 0;i<recipient.emails.length; i++ ){
                if(!recipient.emails[i].canBeUsedForSending)
                    emailsToRemove.push(recipient.emails[i]);
            }
            emailsToRemove.forEach(removingEmail=>{
                const index =  recipient.emails.indexOf(removingEmail);
                recipient.emails.splice(index,1);
            });
            recipient.attachments.forEach(file=>{
                file.content = util.base64ToArrayBuffer(file.content);
            });   
        });
        this.selectedCopyRecipients.forEach(recipient=>{
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
        if(!this.letter)return;
        await letterService.ForwardLetter(this.letter.letterPossessionId,this.selectedMainRecipients,this.selectedCopyRecipients)
        this.$emit("forward-done");
    }

    cancel(){
        this.$emit("forward-canceled");
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
