<template>
    <div class="three-part-flexbox">
       
       <div class="flex-part-top">
            گیرنده اصلی:
           <RecipientLookup :recipients="recipients" @recipient-selected="selectMainRecipient($event)"/>
           <RecipientSelector :autoCompleteDataType="'all'" :recipients="selectedMainRecipients" 
           @recipient-removed="onMainRecipientRemoved($event)"
           />

            گیرنده رونوشت:
           <RecipientLookup :recipients="recipients" @recipient-selected="selectCopyRecipient($event)"/>
           <RecipientSelector :autoCompleteDataType="'copy'" :recipients="selectedCopyRecipients" 
           @recipient-removed="onCopyRecipientRemoved($event)"
           />
       </div>
       <div class="flex-part-middle" >
            <div v-if="attachments.length > 0">پیوست ها:</div> 
            <div class="wrap-grid">
                    <LetterAttachment
                    v-for="part in attachments"
                    :key="part.id"
                    :file="part.file"
                    >
                    </LetterAttachment>
            </div>
            <div class="container3 chamfer">
                <div>{{letter.title}}</div>
                <div>{{letter.abstract}}</div>
            </div>
       </div>
       <div class="flex-part-bottom" style="flex:0" >
                <InPlaceMessageBox 
                v-if="shallShowMessageBox" 
               :buttons="msgBoxBtns" 
               :message="message" 
               :messageType="messageType"
               @button-clicked="onMessageBoxBtnClicked($event)"/>
               <div v-else style="display:flex">
                    <div @click="cancel" class="action-icon bg1" style="flex:1;text-align:center"><i style="color:inherit" class="icon icon-cancel"></i></div>
                    <div @click="send" class="action-icon bg1" style="flex:1;text-align:center"><i style="color:inherit" class="icon icon-send"></i></div>
               </div>
              
        </div>
        <FullPageLoader :isActive="loading"/>
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
import Parts from '@/store/models/Letter/Parts';
import LetterAttachment from '@/components/Cartable/LetterDetails/LetterAttachment/LetterAttachment.vue';
import InPlaceMessageBox from '@/components/UiComponents/InPlaceMessageBox.vue';
import FullPageLoader from '@/components/UiComponents/FullPageLoader.vue';
@Component({
    components: {RecipientSelector, ToggleSwitch, RecipientLookup, LetterAttachment,InPlaceMessageBox , FullPageLoader}
})
export default class ForwardLetter extends Vue{
    recipients: LetterOwnerWithFaxAndEmails[] = [];
    selectedMainRecipients:  LetterOwnerWithSendingInformationAndAttachments [] = [];
    selectedCopyRecipients:  LetterOwnerWithSendingInformationAndAttachments [] = [];
    autoCompleteData: AutoCompleteData[] = [];
    msgBoxBtns = 'ok';
    message = '';
    messageType = '';
    shallShowMessageBox = false;
    isDone = false;
    loading = false;
    @Prop() letter?: Letter;
    get attachments(){
        
        const result: Parts[] = [];
        if(this.letter === undefined)return result;
        if(this.letter.parts === undefined || this.letter.parts === null)return result;
        for(let i = 1;i<this.letter.parts.length;i++){
            result.push(this.letter.parts[i]);
        }
        return result;
    }
    async created(){
        const ownerId = store.state.ownerId;
        this.recipients =   await letterOwnerService.getOwnerRecipients(ownerId);
    }
    // async mounted(){
    //     $('#main-recipient-dropdown').dropdown({action:'hide',silent: true ,message: {noResults : 'یافت نشد'}});
    //     $('#copy-recipient-dropdown').dropdown({action:'hide',silent: true ,message: {noResults : 'یافت نشد'}});
       
    // }
    
    selectMainRecipient(recipient: LetterOwnerWithFaxAndEmails){
        let addedItem =  this.selectedMainRecipients.find(item=>item.id === recipient.id);
        if(!addedItem) 
            addedItem = this.selectedCopyRecipients.find(item=>item.id === recipient.id);
        if(!addedItem)
            this.selectedMainRecipients.push(letterOwnerService.getLetterOwnerWithSendingInfo(recipient));
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
            this.selectedCopyRecipients.push(letterOwnerService.getLetterOwnerWithSendingInfo(recipient));
    }
    onCopyRecipientRemoved(id: string){
        const removedItem =  this.selectedCopyRecipients.find(item=>item.id === id);
        if(!removedItem)return;
        const index =  this.selectedCopyRecipients.indexOf(removedItem);
        this.selectedCopyRecipients.splice(index,1);        
    }
    
    async send(){
        if(this.selectedMainRecipients.length === 0 && this.selectedCopyRecipients.length === 0){
            this.messageType = 'fail';
            this.message = 'هیچ گیرنده اصلی یا رونوشت انتخاب نشده است';
            this.shallShowMessageBox = true;
            return;
        }
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
                file.content = util.base64RemovePrefix(file.content);
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
        this.loading = true;
        const result = await letterService.ForwardLetter(this.letter.letterPossessionId,this.selectedMainRecipients,this.selectedCopyRecipients)
        this.loading = false;
        if(result != null){
            this.message = "ارجاع انجام شد";
            this.messageType = 'success';
            this.shallShowMessageBox = true;
            this.isDone = true;
        }
        this.$emit("forward-done",this.letter.letterPossessionId);
    }

    cancel(){
        this.$emit("forward-canceled");
    }
    onMessageBoxBtnClicked(btn: string){
        this.shallShowMessageBox = false;
        if(this.isDone)
            this.cancel();
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
