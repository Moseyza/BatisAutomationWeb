<template>
    <div class="single-recipient" >
        <div class="item-block" >
            <div class="xsmall-text nowrap" style="flex:3">{{recipient.nameOnly}}</div>
            <div class="xxsmall-text nowrap" style="flex:4">{{recipient.post}}</div>
            <div class="symmetric-grid" style="flex:2">
                <div @click="toggleMail()" > <i class="icon-mail icon" :class="{active: isMailActive}"></i> </div>
                <div @click="toggleTelegram()"> <i class="icon-telegram icon" :class="{active: this.recipient.shallSendViaMessagingApp}"></i> </div>
                <div @click="toggleSms()" > <i   class="icon-sms icon" :class="{active: this.recipient.shallSendSms}"></i> </div>
                <div @click="remove()"> <i class="icon-x icon action-icon"></i> </div>
            </div>
        </div>
        <div class="item-block xxsmall-text">
            
            هامش:   <input type="text" :list="dataListId"  v-model="recipient.forwardingComment" >
                    <datalist :id="dataListId">
                        <option v-for="item in autoCompleteData" :key="item.id" :value="item.name" />
                    </datalist> 
                    
                    
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
        <div v-if="autoCompleteDataType === 'draft'" class="item-block xxsmall-text single-column" >
             <div >
                <div class="symmetric-grid"><div class="xxsmall-text" style="flex:1">گیرنده پیش نویس</div><div style="flex:3"><RecipientLookup :recipients="recipientRecipients" @recipient-selected="selectRecipient($event,'draft')"/></div></div>
                <div v-if="recipient.childDraftReceivers.length >0" id="selection-area" style="padding:5px;border:1px solid white;border-radius:5px">
                <FastSendSelectedRecipient 
                v-for="recipient in recipient.childDraftReceivers"
                :key="recipient.id"
                :recipient="recipient"
                @recipient-removed="onRecipientRemoved($event,'draft')"
                :autoCompleteDataType="'draft'"
                />
                </div>
             </div>

             <div >
                <div class="symmetric-grid"><div class="xxsmall-text" style="flex:1">گیرنده اصلی</div><div style="flex:3"><RecipientLookup  :recipients="recipientRecipients" @recipient-selected="selectRecipient($event,'main')"/></div></div>
                <div v-if="recipient.childMainReceivers.length >0" id="selection-area" style="padding:5px;border:1px solid white;border-radius:5px">
                <FastSendSelectedRecipient 
                v-for="recipient in recipient.childMainReceivers"
                :key="recipient.id"
                :recipient="recipient"
                @recipient-removed="onRecipientRemoved($event,'main')"
                :autoCompleteDataType="'all'"
                />
                </div>
             </div>

              <div >
                <div class="symmetric-grid"><div class="xxsmall-text" style="flex:1">گیرنده رونوشت</div><div style="flex:3"><RecipientLookup  :recipients="recipientRecipients" @recipient-selected="selectRecipient($event,'copy')"/></div></div>
                <div v-if="recipient.childCopyReceivers.length >0" id="selection-area" style="padding:5px;border:1px solid white;border-radius:5px">
                <FastSendSelectedRecipient 
                v-for="recipient in recipient.childCopyReceivers"
                :key="recipient.id"
                :recipient="recipient"
                @recipient-removed="onRecipientRemoved($event,'copy')"
                :autoCompleteDataType="'copy'"
                />
                </div>
             </div>
             
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component , Prop} from 'vue-property-decorator';
import { AutoCompleteData } from '@/store/models/Letter/AutoCompleteData';
import File from '@/store/models/Letter/File';
import LetterAttachment from '@/components/Cartable/LetterDetails/LetterAttachment/LetterAttachment.vue';
import * as util from '@/util/utils.ts';
import * as $ from 'jquery';
import FileSelector from '@/components/UiComponents/FileSelector.vue';
import * as autoCompleteDataService from '@/store/Services/autoCompleteDataService.ts';
import RecipientLookup from '@/components/Cartable/ForwardLetter/RecipientLookup/RecipientLookup.vue';
//import FastSendRecipientSelector from '@/components/Cartable/FastSend/FastSendRecipientSelector/FastSendRecipientSelector.vue';
import { LetterOwnerForSendingFaxAndEmailAndSms } from '../../../../../store/models/LetterOwner/LetterOwnerForSendingFaxAndEmailAndSms';
import * as letterOwnerService from '@/store/Services/letterOwnerService';
import { LetterOwnerWithFaxAndEmails } from '../../../../../store/models/LetterOwner/LetterOwnerWithFaxAndEmails';
@Component({
    name:"FastSendSelectedRecipient",
    components: { LetterAttachment, FileSelector, RecipientLookup  }
})
export default class FastSendSelectedRecipient extends Vue{
    isTelegramActive = false;
    isMailActive = false;
    isSmsActive = false;
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
    autoCompleteData = [] as AutoCompleteData[];
    @Prop() autoCompleteDataType?: string;
    @Prop() recipient?: LetterOwnerForSendingFaxAndEmailAndSms;
    recipientRecipients = [] as LetterOwnerWithFaxAndEmails[]
    //selectedMainRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];
    //selectedDraftRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];
    //selectedCopyRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];
    async mounted(){
        if(this.autoCompleteDataType === 'all')
            this.autoCompleteData =  await autoCompleteDataService.getForwardingAutoCompleteData();
        else if(this.autoCompleteDataType === 'copy')
            this.autoCompleteData = await autoCompleteDataService.getSendCopyAutoCompleteData();
        else if(this.autoCompleteDataType === 'draft')
            this.autoCompleteData = await autoCompleteDataService.getSendDraftAutoCompleteData();
        if(this.recipient)
            this.recipientRecipients = await letterOwnerService.getOwnerRecipients(this.recipient.id)
        
    }
    remove(){
        if(this.recipient)
            this.$emit('recipient-removed',this.recipient.id);
    }
    toggleTelegram(){
        if(!this.recipient)return;
        this.recipient.shallSendViaMessagingApp = !this.recipient.shallSendViaMessagingApp;
    }
    toggleSms(){
        if(!this.recipient)return;
        this.recipient.shallSendSms = !this.recipient.shallSendSms
        
    }
    toggleMail(){
        this.isMailActive = !this.isMailActive;
        if(this.recipient){
            if(this.recipient.emails){
                if(this.recipient.emails.length > 0 && this.isMailActive )
                    this.recipient.emails[0].canBeUsedForSending = true;
                else{
                    this.recipient.emails.forEach(mail=>{mail.canBeUsedForSending = false;});
                }
            }
        }
    }
    selectRecipient(recipient: LetterOwnerWithFaxAndEmails, listName: string){
        if(!this.recipient) return;
        let addedItem = null;
        if(this.recipient.childMainReceivers)
        addedItem =   this.recipient.childMainReceivers.find(item=>item.id === recipient.id);
        if(!addedItem && this.recipient.childCopyReceivers) 
            addedItem = this.recipient.childCopyReceivers.find(item=>item.id === recipient.id);
        if(!addedItem && this.recipient.childDraftReceivers)
            addedItem = this.recipient.childDraftReceivers.find(item=>item.id === recipient.id);  //this.selectedDraftRecipients.find(item=>item.id === recipient.id);
        if(!addedItem){
            if(listName === 'main' && this.recipient.childMainReceivers){
                this.recipient.childMainReceivers.push(letterOwnerService.getLetterOwnerForSendingFaxAndEmailAndSms(recipient));
            }
            else if(listName === 'copy' &&  this.recipient.childCopyReceivers){
                this.recipient.childCopyReceivers.push(letterOwnerService.getLetterOwnerForSendingFaxAndEmailAndSms(recipient));
            }
            else if(listName === 'draft' && this.recipient.childDraftReceivers){
                this.recipient.childDraftReceivers.push(letterOwnerService.getLetterOwnerForSendingFaxAndEmailAndSms(recipient));
            }
            
        }
            
    }
    onRecipientRemoved(id: string, listName: string){
        if(!this.recipient)return;
        let list = [] as LetterOwnerForSendingFaxAndEmailAndSms[] | undefined;
        if(listName == 'main'){
            list = this.recipient.childMainReceivers;
        }
        else if(listName == 'draft'){
            list = this.recipient.childDraftReceivers;
        }
        else if(listName == 'copy'){
            list = this.recipient.childCopyReceivers;
        }
        if(!list)return;
        const removedItem =  list.find(item=>item.id === id);
        if(!removedItem)return;
        const index =  list.indexOf(removedItem);
        list.splice(index,1);        
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
        min-width: 350px;
        border-radius: 3px;
        margin: 2px 2px;
        padding: 2px 5px;
        background-color: #5f5f5f;
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



