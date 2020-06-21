<template>
    <div>
        <div class="symmetric-grid" style="margin-bottom: 5px">
            <div style="flex:1; margin-left:5px;">
                گیرنده پیش نویس:  
            </div>
            <div style="flex:5">
                <RecipientLookup  :recipients="recipients" @recipient-selected="selectRecipient($event, 'draft')"   />    
            </div>
        </div>
        <RecipientSelector  :recipients="selectedDraftRecipients" @recipient-removed="onRecipientRemoved($event,'draft')"/>
        <div class="symmetric-grid" style="margin-bottom: 5px">
            <div style="flex:1;margin-left:5px">
                گیرنده اصلی:  
            </div>
            <div style="flex:5">
                <RecipientLookup  :recipients="recipients" @recipient-selected="selectRecipient($event,'main')"   />    
            </div>
        </div>
        <RecipientSelector  :recipients="selectedMainRecipients" @recipient-removed="onRecipientRemoved($event,'main')"/>
        <div class="symmetric-grid" style="margin-bottom: 5px">
            <div style="flex:1;margin-left:5px">
                گیرنده رونوشت:  
            </div>
            <div style="flex:5">
                <RecipientLookup  :recipients="recipients" @recipient-selected="selectRecipient($event,'copy')"   />    
            </div>
        </div>
        <RecipientSelector  :recipients="selectedCopyRecipients" @recipient-removed="onRecipientRemoved($event,'copy')"/>
        <div class="symmetric-grid" style="margin-bottom: 5px">
            <div style="flex:1;margin-left:5px">
                عنوان:
            </div>
            <div style="flex:5; width:100%; padding: 5px; margin-right:2px;border-radius:5px" class="bg1" >
                <input type="text"  class="fc1" style="width:100%;background-color:transparent;border:none">
            </div>
        </div>
        <div class="container1" style="margin-left:0;border-radius:5px">

        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import RecipientLookup from '@/components/Cartable/ForwardLetter/RecipientLookup/RecipientLookup.vue';
import RecipientSelector from '@/components/Cartable/ForwardLetter/RecipientSelector/RecipientSelector.vue';
import { LetterOwnerWithFaxAndEmails } from '@/store/models/LetterOwner/LetterOwnerWithFaxAndEmails';
import { LetterOwnerWithSendingInformationAndAttachments } from '@/store/models/LetterOwner/LetterOwnerWithSendingInformationAndAttachments';
import * as letterOwnerService from '@/store/Services/letterOwnerService';
import store from '@/store';
@Component({
    components:{RecipientLookup, RecipientSelector}
})
export default class FastSent extends Vue{
    recipients: LetterOwnerWithFaxAndEmails[] = [];
    selectedMainRecipients:  LetterOwnerWithSendingInformationAndAttachments [] = [];
    selectedDraftRecipients:  LetterOwnerWithSendingInformationAndAttachments [] = [];
    selectedCopyRecipients:  LetterOwnerWithSendingInformationAndAttachments [] = [];

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
                this.selectedMainRecipients.push(letterOwnerService.getLetterOwnerWithSendingInfo(recipient));
            }
            else if(listName === 'copy'){
                this.selectedCopyRecipients.push(letterOwnerService.getLetterOwnerWithSendingInfo(recipient));
            }
            else if(listName === 'draft'){
                this.selectedDraftRecipients.push(letterOwnerService.getLetterOwnerWithSendingInfo(recipient));
            }
            
        }
            
    }
    onRecipientRemoved(id: string, listName: string){

        let list = [] as LetterOwnerWithSendingInformationAndAttachments[];
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
    }

</script>