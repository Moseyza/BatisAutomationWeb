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
                    <input type="text"  class="fc1" style="width:100%;background-color:transparent;border:none">
                </div>
            </div>
            </div>
            <div class="flex-part-bottom container chamfer fc1" style="min-height: 150px;margin-left:0;display:flex;flex-direction:column">
                <div>
                    متن نامه:
                </div>
                <div>
                    <textarea cols="30" rows="10"  class="fc1 bg1"   style="resize:vertical;width:100%;flex:1;padding:5px;" ></textarea>
                </div>
            </div>
        </div>
        <div class="flex-part-bottom container1" style="flex:0.5; margin-left:0">
        </div>
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
@Component({
    components:{RecipientLookup, FastSendRecipientSelector}
})
export default class FastSent extends Vue{
    recipients: LetterOwnerWithFaxAndEmails[] = [];
    selectedMainRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];
    selectedDraftRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];
    selectedCopyRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];

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
    }

</script>