<template>
    <div class="three-part-flexbox">
  
        <div class="flex-part-top" style="flex:0.01"></div>
        <div class="flex-part-middle" style="flex:7">
            <div>
            <div class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1;margin-left:5px">
                    عنوان
                </div>
                <div style="flex:10; width:100%; padding: 5px; margin-right:2px;border-radius:5px" class="bg1" >
                    <input v-model="title" type="text"  class="fc1" style="width:100%;background-color:transparent;border:none">
                </div>
            </div>
            <div v-if="mode=='draft'" class="symmetric-grid" style="margin-bottom: 5px">
                <div  style="flex:1; margin-left:5px;">
                 پیش نویس 
                </div>
                <div style="flex:10">
                    <RecipientLookup  v-if="shallShowDraftLookup"  :recipients="recipients" @recipient-selected="selectRecipient($event, 'draft')"   />    
                    <FastSendRecipientSelector style="flex:10;flex-wrap: wrap;"  :autoCompleteDataType="'draft'" :recipients="selectedDraftRecipients" @recipient-removed="onRecipientRemoved($event,'draft')"   @additem-requested="onAddRecipientRequest('draft')"  />
                </div>
            </div>
            <div v-if="mode=='send'" class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1;margin-left:5px">
                 اصلی
                </div>
                <div style="flex:10">
                    <RecipientLookup v-if="shallShowMainLookup"  :recipients="recipients" @recipient-selected="selectRecipient($event,'main')"   />    
                    <FastSendRecipientSelector  style="flex:10;flex-wrap: wrap;" :autoCompleteDataType="'all'" :recipients="selectedMainRecipients" @recipient-removed="onRecipientRemoved($event,'main')"   @additem-requested="onAddRecipientRequest('main')" />
                </div>
            </div>
            <div v-if="mode=='send'" class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1;margin-left:5px">
                 رونوشت 
                </div>
                <div style="flex:10">
                    <RecipientLookup   v-if="shallShowCopyLookup" :recipients="recipients" @recipient-selected="selectRecipient($event,'copy')"   />    
                    <FastSendRecipientSelector style="flex:10;flex-wrap: wrap;" :autoCompleteDataType="'copy'"  :recipients="selectedCopyRecipients" @recipient-removed="onRecipientRemoved($event,'copy')"   @additem-requested="onAddRecipientRequest('copy')" />
                </div>
            </div>
            
            
            <div class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1;margin-left:5px">
                    فوریت
                </div>
                <div style="flex:10; width:100%;min-height: 26px;padding-top:3px; border-radius:5px" class="bg1" >
                    <PrioritySelector @priority-changed="onPriorityChanged($event)"/>
                </div>
            </div>

            <div class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1;margin-left:5px">
                    وابستگی
                </div>
                <div style="flex:10; display:flex; width:100%;border-radius:5px;background-color:transparent;"  >
                    <div style="display:flex;flex-direction:column; width:100%" >
                       <DependentItem  
                        :letter="item"
                        v-for="(item,index) in dependentLetters" 
                        :key="index"
                       />
                    </div>
                </div>
            </div>

            <div class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1;margin-left:5px">
                    پیوست
                </div>
                <div style="flex:10; display:flex; width:100%;border-radius:5px;background-color:transparent;"  >
                    
                    <div style="flex:5;justify-content:flex-start;flex-wrap:wrap" class="symmetric-grid" >
                        <LetterAttachment v-for="(file,index) in attachments" 
                        :key="index"
                        :canRemove=true
                        :file ="file"
                        :index ="index"
                        @remove="onAttachmentRemoved($event)"
                        style="margin:2px"
                        />
                    </div>
                    
                    <div style="flex:1; display:flex; justify-content:flex-end" class="large-text action-icon">
                        <FileSelector  @file-changed="onFileSelectorChanged($event)"/>
                        <progress v-if="loadingFile" :value="loadedPercent" max="100"></progress>
                    </div>

                </div>
                
            </div>
            
            <div class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1;margin-left:5px">
                    متن
                </div>
                <div style="flex:10;" class="bg1" >
                    
                </div>
            </div>
            </div>
            <div class="flex-part-bottom container chamfer fc1" style="min-height: 150px;margin-left:0;display:flex;flex-direction:column">
                
                    <textarea v-model="content" cols="30" rows="10"  class="fc1 bg1"   style="resize:vertical;width:100%;flex:1;padding:5px;" ></textarea>
                
            </div>
        </div>
        <div class="flex-part-bottom container1" style="flex:0 1 auto; margin-left:0">
            <InPlaceMessageBox v-if="shallShowMessageBox"
            :buttons="msgBoxBtns" 
            :message="message"
            :messageType="messageType"
            @button-clicked="onMessageBoxBtnClicked($event)"
            />
            <InPlaceSendingOptions   v-else-if="shallShowSendingOptions" @close="onSendingOptionsClosed()" @toggle-options="toggleSendOption($event)" :setCopyProp="shallSetCopyReceivers" :signProp="shallSign"/>
            <div v-else style="display:flex;justify-content: center;align-items: center;">
                    <div @click="cancel" class="action-icon bg1" style="flex:1;text-align:center"><i style="color:inherit;font-size:xx-large" class=" icon-close"></i></div>
                    <div v-if="mode === 'send'" @click="send(true)" class="action-icon bg1" style="flex:1;text-align:center"><i style="color:inherit;" class=" icon-saveDraft xlarg-text"></i></div>
                    <div class="action-icon" @click="showSendingOptions()" style="flex:1;text-align:center"><i  style="color:inherit;" class="action-icon icon-settings xlarg-text"></i></div>
                    <div class="action-icon" @click="send(false)" style="flex:1;text-align:center" ><i  style="color:inherit;" class="action-icon icon-sendForwardLetter xlarg-text"></i></div>
                    <!-- <SendButtonWithOptions @send="send(false)" :setCopyProp="shallSetCopyReceivers" :signProp="shallSign" @options-changed="toggleSendOption($event)"/> -->
                    <!-- <div  class="bg1" style="flex:1;text-align:center;display:flex;flex-direction:column;align-items:center">
                        <div class="action-icon"><i @click="send(false)" style="color:inherit;" class="action-icon icon-sendForwardLetter xlarg-text"></i></div>
                        <div id="sendingOptions-dropdown"  class="ui icon top left dropdown">
  		                
                              <div class="action-btn;" style="font-size: 5pt;border: 1px solid gray;padding-left: 5px;margin-left: 5px;width: 20px;height: 10px;box-sizing: border-box;    background-color: lightgray;">
                                <i style="margin-top:-10px" class="icon action-icon icon-triangle"></i> 
                              </div>
                        
  		                <div class="menu">
    		                    <div class="item menu-item">
                                    <div style="text-align:right;display:flex;flex-direction:column">
                                        <div @click="toggleSendOption('sign')"> <input type="checkbox"  v-model="shallSign"> امضا</div>
                                        <div @click="toggleSendOption('setCopy')"> <input type="checkbox" v-model="shallSetCopyReceivers"> تنظیم گیرندگان رونوشت</div>
                                    </div>
                                </div>
  		                </div>
	                    </div>
                    </div> -->
            </div>
        </div>
       <FullPageLoader :isActive="loading"/>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import RecipientLookup from '@/components/Cartable/ForwardLetter/RecipientLookup/RecipientLookup.vue';
import FastSendRecipientSelector from '@/components/Cartable/FastSend/FastSendRecipientSelector/FastSendRecipientSelector.vue';
import { LetterOwnerWithFaxAndEmails } from '@/store/models/LetterOwner/LetterOwnerWithFaxAndEmails';
import * as letterOwnerService from '@/store/Services/letterOwnerService';
import store from '@/store';
import { LetterOwnerForSendingFaxAndEmailAndSms } from '../../../store/models/LetterOwner/LetterOwnerForSendingFaxAndEmailAndSms';
import MessageBox from '@/components/UiComponents/MessageBox.vue';
import FileSelector from '@/components/UiComponents/FileSelector.vue';
import InPlaceMessageBox from '@/components/UiComponents/InPlaceMessageBox.vue';
import File from '../../../store/models/Letter/File';
import LetterAttachment from '@/components/Cartable/LetterDetails/LetterAttachment/LetterAttachment.vue';
import Parts from '../../../store/models/Letter/Parts';
import { LetterOwner } from '../../../store/models/LetterOwner/LetterOwner';
import * as letterService from '@/store/Services/letterServices';
import { isMoment } from 'moment';
import * as util from '@/util/utils';
import FullPageLoader from '@/components/UiComponents/FullPageLoader.vue';
import PrioritySelector from './PrioritySelector/PrioritySelector.vue';
import { LetterOwnerEmail } from '@/store/models/LetterOwner/LetterOwnerEmail';
import { Letter } from '../../../store/models/Letter/Letter';
import DependentItem from './DependentItem/DependentItem.vue';
import {DependentLetter} from '@/store/models/Letter/DependentLetter';
import LetterReferencesToOtherLetters from '../../../store/models/Letter/LetterReferencesToOtherLetters';
import * as $ from 'jquery';
import SendButtonWithOptions from '@/components/Cartable/FastSend/SendButtonWithOptions.vue';
import InPlaceSendingOptions from '@/components/Cartable/FastSend/InPlaceSendingOptions.vue';

@Component({
    components:{RecipientLookup, FastSendRecipientSelector, MessageBox, FileSelector, LetterAttachment, FullPageLoader, InPlaceMessageBox,PrioritySelector , DependentItem, InPlaceSendingOptions}
})
export default class FastSent extends Vue{
    recipients: LetterOwnerWithFaxAndEmails[] = [];
    selectedMainRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];
    selectedDraftRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];
    selectedCopyRecipients:  LetterOwnerForSendingFaxAndEmailAndSms [] = [];
    @Prop() dependentLetters?: DependentLetter[];
    @Watch('dependentLetters')
    onDependentLettersChanged(){
        this.addDependentLettersAttachments();
    }
    addDependentLettersAttachments(){
        if(!this.dependentLetters)return;
        this.dependentLetters.forEach(dependent => {
            if(dependent.dependencyType === 'attaching'){
                
                if(dependent.parts){
                    dependent.parts.forEach(part => {
                        this.attachments.push(part.file);
                    });
                }
            }
        });
    }
    shallShowMessageBox = false;
    // @Watch('shallShowMessageBox')
    // onShallShowMessageBoxChanged(n: boolean, o: boolean)
    // {
    //     if(!n && o){
    //          $("#sendingOptions-dropdown").dropdown({action:'nothing'});
    //          alert("test");
    //     }
    // }

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
    loading = false;
    priority = 1;
    shallSign = true;
    shallSetCopyReceivers = true;
    @Prop() mode?: string;
    
    @Watch('mode') 
    onModeChanged(n: string, o: string){
        this.selectedMainRecipients.length = 0;
        this.selectedCopyRecipients.length = 0;
        this.selectedDraftRecipients.length = 0;
        this.title = '';
        this.content = '';
    }
    async created(){
        const ownerId = store.state.ownerId;
        this.recipients =   await letterOwnerService.getOwnerRecipients(ownerId);
        this.addDependentLettersAttachments();
    }
    selectRecipient(recipient: LetterOwnerWithFaxAndEmails, listName: string){
        switch(listName){
            case 'main':
                this.shallShowMainLookup = false;
                break;
            case 'copy':
                this.shallShowCopyLookup = false;
                break;
            case 'draft':
                this.shallShowDraftLookup = false;
                break;
        }
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
    removeNotSelectedEmails(list: LetterOwnerForSendingFaxAndEmailAndSms[]){
        list.forEach(recipient=>{
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
    }
    async send(shallSaveforSender: boolean){
        
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
        if(!shallSaveforSender && this.selectedMainRecipients.length === 0  && this.selectedDraftRecipients.length === 0)
        {
            this.message = 'هیچ گیرنده اصلی یا پیش نویس انتخاب نشده است';
            this.shallShowMessageBox = true;
            return;
        }
        //this.shallShowMessageBox = true;
        this.loading = true;
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
        this.removeNotSelectedEmails(this.selectedMainRecipients);
        this.removeNotSelectedEmails(this.selectedCopyRecipients);
        this.removeNotSelectedEmails(this.selectedDraftRecipients);
        dto.recievers = this.selectedMainRecipients;
        dto.copyRecievers = this.selectedCopyRecipients;
        dto.draftRecievers = this.selectedDraftRecipients;
        dto.priority = this.priority;
        dto.shallSign = this.shallSign;
        dto.shallShowCopyReceiversInLetter = this.shallSetCopyReceivers;

        if(this.dependentLetters){
        
            const tempArray = [] as LetterReferencesToOtherLetters[];
            this.dependentLetters.forEach(x=>{
                const dependencyItem = {} as LetterReferencesToOtherLetters;
                dependencyItem.letterId = x.id;
                dependencyItem.letterTitle = x.title;
                dependencyItem.letterNo = x.letterNo;
                if(x.dependencyType === 'bending')//refrence
                    dependencyItem.dependencyType = 2
                else if(x.dependencyType === 'following')//follow
                    dependencyItem.dependencyType = 1
                else if(x.dependencyType === 'returning')//answer
                    dependencyItem.dependencyType = 0
                else if(x.dependencyType === 'attaching')//attach
                    dependencyItem.dependencyType = 3
                tempArray.push(dependencyItem);
                
            });
            dto.letterRefrences = tempArray;
        }
        if(this.mode == 'send' && !shallSaveforSender){
            const info = await letterService.SendLetterFast(dto);
            if(info.letterNumber){
                this.message = `نامه با شماره ${info.letterNumber} ارسال شد.`
                //this.msgBoxBtns = 'ok';
                //this.messageType = 'success';
                //this.shallShowMessageBox = true;
                this.isLetterSent = true;
                this.$emit('fastsend-canceled');
                store.state.eventHub.$emit("show-message",this.message);
                if(this.dependentLetters){
                    if(this.dependentLetters.length >0)
                        store.state.eventHub.$emit('dependent-letter-sent',this.dependentLetters[0].letterPossessionId);
                }
            }
        }
        else{
            const request = {} as any;
            if(shallSaveforSender){
                dto.sener = null;
                request.isForSender = true;
            }
            
            request.dto = dto;
            const info = await letterService.SaveDraft(request);
            if(info && info.isAnyDraftSaved){
                //this.messageType = 'success';
                this.message = 'پیش نویس ارسال شد';
                //this.msgBoxBtns = 'ok';
                //this.shallShowMessageBox = true;
                this.isLetterSent = true;
                this.$emit('fastsend-canceled');
                store.state.eventHub.$emit("show-message",this.message);
            }
        }
        this.loading = false;

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
    onPriorityChanged(priority: string){
        if(priority === 'low')
            this.priority = 1;
        else if(priority === 'med')
            this.priority = 5;
        else if(priority === 'high')
            this.priority = 10;
    }
    shallShowMainLookup = false;
    shallShowCopyLookup = false;
    shallShowDraftLookup = false;
    onAddRecipientRequest(mode: string){
        switch(mode){
            case 'main':
                this.shallShowMainLookup = true;
                break;
            case 'copy':
                this.shallShowCopyLookup = true;
                break;
            case 'draft':
                this.shallShowDraftLookup = true;
                break;
        }
    }
    
    toggleSendOption(options: any){       
            this.shallSign = options.sign;
            this.shallSetCopyReceivers = options.setCopy;
    }
    shallShowSendingOptions = false;
    onSendingOptionsClosed(){
        this.shallShowSendingOptions = false;
    }
    showSendingOptions(){
        this.shallShowSendingOptions = true;
    }
}


</script>