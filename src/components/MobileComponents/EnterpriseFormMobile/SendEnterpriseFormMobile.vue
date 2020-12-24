<template>
    <div class="three-part-flexbox">
        <FullPageLoader :isActive="sending" />
        <div class="flex-part-top">
            <div v-if="mainReceivers.length>0" class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1;margin-left:5px">
                 اصلی
                </div>
                <div style="flex:10">
                    <RecipientLookupMobile  v-if="shallShowMainLookup" :recipients="mainReceivers" @recipient-selected="selectRecipient($event,'main')"   />    
                    <FastSendRecipientSelectorMobile @additem-requested="onAddRecipientRequest('main')" :hideComment="true"  style="flex:10" :autoCompleteDataType="'all'" :recipients="selectedMainRecipients" @recipient-removed="onRecipientRemoved($event,'main')"/>
                </div>
            </div>
            <div v-if="copyReceivers.length>0"  class="symmetric-grid" style="margin-bottom: 5px">
                <div style="flex:1;margin-left:5px">
                 رونوشت 
                </div>
                <div style="flex:10">
                    <RecipientLookupMobile  v-if="shallShowCopyLookup"  :recipients="copyReceivers" @recipient-selected="selectRecipient($event,'copy')"   />    
                    <FastSendRecipientSelectorMobile  
                    @additem-requested="onAddRecipientRequest('copy')" 
                    style="flex:10" 
                    :autoCompleteDataType="'copy'"  
                    :recipients="selectedCopyRecipients" 
                    @recipient-removed="onRecipientRemoved($event,'copy')"
                    />
                </div>
            </div>
            <div v-if="draftReceivers.length>0" class="symmetric-grid" style="margin-bottom: 5px">
                <div  style="flex:1; margin-left:5px;">
                 پیش نویس 
                </div>
                <div style="flex:10">
                    <RecipientLookupMobile  v-if="shallShowDraftLookup" :recipients="draftReceivers" @recipient-selected="selectRecipient($event, 'draft')"   />    
                    <FastSendRecipientSelectorMobile  @additem-requested="onAddRecipientRequest('draft')" style="flex:10"  :autoCompleteDataType="'draft'" :recipients="selectedDraftRecipients" @recipient-removed="onRecipientRemoved($event,'draft')"/>
                </div>
            </div>
        </div>
        <div class="flex-part-middle">
            <EnterpriseFormContainerMobile 
            :formLblWidth="formLblWidth" 
            :tableLblWidth="tableLblWidth"  
            :form="form" 
            :nextFormInfo="nextFormInfo" 
            :draftFormInfo="draftFormInfo"
            @errors-exposed="onErrorsExposed($event)" 
            @no-errors="onNoErrors()"/>
        </div>
        <div class="flex-part-bottom container1" style="flex:0 1 auto">
            <InPlaceMessageBox v-if="shallShowMsgBox" :message="msgBoxMessage" :messageType="msgBoxMessageType" :buttons="msgBoxButtons" @button-clicked="onMsgBoxButtonClicked($event)"/>
            <InPlaceMessageBox v-if="shallShowMsgBoxForRouteToReceiveForm" :message="msgBoxMessage" :messageType="msgBoxMessageType" :buttons="msgBoxButtons" @button-clicked="onRouteToReceiveForm($event)"/>
            <div v-else style="display:flex">
                    <div class="action-icon bg1" style="flex:1;text-align:center">
                        <div   @click="cancel()" class="action-icon bg1" style="flex:1;text-align:center">
                            <i style="color:inherit;font-size:xx-large" class=" icon-close"></i>
                        </div>
                    </div>
                    
                    <div   class="action-icon bg1" style="flex:1;text-align:center;margin-top: 3px;"><i style="color:inherit;font-size:x-large" class=" icon-letterPreview"></i></div>
                    <div  @click="send('save')" class="action-icon bg1" style="flex:1;text-align:center;margin-top: 3px;"><i style="color:inherit;font-size:x-large" class=" icon-saveDraft"></i></div>
                    <div  @click="send('send')" class="action-icon bg1 popup" :data-content="errors" style="flex:1;text-align:center"><i style="color:inherit;position:absolute" class=" icon-sendForwardLetter xlarg-text"></i> <span v-if="shallShowError()" style="color:red;position: absolute;margin: 8px;font-size: larger;">!</span> </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import StringBookmarkMobile from './BookmarkComponentsMobile/StringBookmarkMobile.vue';
import {EnterpriseForm} from '@/store/models/EnterpriseForm/EnterpriseForm';
import { LetterOwnerWithFaxAndEmails } from '@/store/models/LetterOwner/LetterOwnerWithFaxAndEmails';
import * as enterpriseFormService from '@/store/Services/enterpriseFormService';
import * as letterOwnerService from '@/store/Services/letterOwnerService';
import store from '@/store';
import * as $ from 'jquery';
import ComponentMixinBase from '@/components/Cartable/ComponentMixins/ComponentMixinBase';
import { LetterOwnerForSendingFaxAndEmailAndSms } from '@/store/models/LetterOwner/LetterOwnerForSendingFaxAndEmailAndSms';
import FullPageLoader from '@/components/UiComponents/FullPageLoader.vue';
import { NextFormInfo } from '@/store/models/EnterpriseForm/NextFormInfo';
import { DraftEnterpriseFormInfo } from '@/store/models/EnterpriseForm/LoadEnterpriseFormDraftResponse';
import EnterpriseFormContainerMobile from './EnterpriseFormContainerMobile/EnterpriseFormContainerMobile.vue';
import FastSendRecipientSelectorMobile from '@/components/MobileComponents/FastSendMobile/FastSendRecipientSelectorMobile/FastSendRecipientSelectorMobile.vue';

import  RecipientLookupMobile from '@/components/MobileComponents/ForwardLetterMobile/RecipientLookupMobile/RecipientLookupMobile.vue';
import InPlaceMessageBox  from '@/components/UiComponents/InPlaceMessageBox.vue';


@Component({
    components: {EnterpriseFormContainerMobile,RecipientLookupMobile , FastSendRecipientSelectorMobile ,InPlaceMessageBox, FullPageLoader }
})
export default class SendEnterpriseFormMobile extends Mixins(ComponentMixinBase){
    @Prop() form?: EnterpriseForm;
    @Prop() formLblWidth?: number;
    @Prop() tableLblWidth?: number;
    @Prop() nextFormInfo?: NextFormInfo;
    isNextForm = false;
    @Prop() draftFormInfo?: DraftEnterpriseFormInfo;
    @Prop() shallRouteToReciveLettersForm?: boolean;
    @Watch('shallRouteToReciveLettersForm')
    msgBoxMessage = '';
    msgBoxMessageType = '';
    shallShowMsgBoxForRouteToReceiveForm=false;
    shallRouteToReciveLetter=false;
    msgBoxButtons = 'okCancel';
    shallShowMsgBox = false;
    formReceivers = [] as LetterOwnerWithFaxAndEmails[];
    mainReceivers = [] as LetterOwnerWithFaxAndEmails[];
    copyReceivers = [] as LetterOwnerWithFaxAndEmails[];
    draftReceivers = [] as LetterOwnerWithFaxAndEmails[];
    selectedMainRecipients = [] as LetterOwnerForSendingFaxAndEmailAndSms[];
    selectedCopyRecipients = [] as LetterOwnerForSendingFaxAndEmailAndSms[];
    selectedDraftRecipients = [] as LetterOwnerForSendingFaxAndEmailAndSms[];
    mandatoryValuesErrorMessage = "عدم تامین پارامترهای اجباری";
    sending = false;
    shallRenderOnMobile=false;
    errors = '';
    isFormSent = false;
    @Watch("form",{ immediate: true, deep: true })
    onFormChanged(){
        this.loadReceivers();
        store.state.eventHub.$emit('remove-all');
    }
    @Watch("nextFormInfo",{ immediate: true, deep: true })
    onNextFormInfoChanged(){
        store.state.eventHub.$emit('remove-all');
    }

    onCloseToRouteReceiveLetter(){
        this.shallRouteToReciveLetter=true;
    }
    mounted(){
        if(this.isMobile()){
            this.shallRenderOnMobile=true
        }
    }

    created(){
        this.loadReceivers();
        store.state.eventHub.$on('routeToReciveLettersFormEvent',this.onCloseToRouteReceiveLetter);
    }
    
    async loadReceivers(){
        
        if(!this.form)return;
        const senderId =  store.state.ownerId;
        let dependentLetterId = '';
        if(this.nextFormInfo)
            dependentLetterId = this.nextFormInfo.dependentLetterId;
        this.formReceivers =  await enterpriseFormService.getFormReceivers(this.form.id,senderId,dependentLetterId);
        this.mainReceivers = this.formReceivers.filter(x=>x.canUserSend);
        this.copyReceivers = this.formReceivers.filter(x=>x.canUserSendCopy);
        this.draftReceivers = this.formReceivers.filter(x=>x.canUserSendDraft);
        //setting defaults 
        const mainDefault =  this.mainReceivers.filter(x=>x.isSendDefault);
        mainDefault.forEach(d=>this.selectRecipient(d,'main'));
        const copyDefault =  this.copyReceivers.filter(x=>x.isSendDefault);
        mainDefault.forEach(d=>this.selectRecipient(d,'copy'));
        const draftDefault =  this.draftReceivers.filter(x=>x.isSendDefault);
        mainDefault.forEach(d=>this.selectRecipient(d,'draft'));

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
    onErrorsExposed(errors: string){
        this.errors = errors;
        $('.popup').popup({onShow: this.shallShowError});
    }
    shallShowError(){
        $('.popup').css('max-height', $(window).height());
        return this.errors != '';
    }
    onNoErrors(){
        this.errors = '';
    }
    
    async send(mode: string){

        if(this.errors != '')return;
        if(this.selectedMainRecipients.length === 0 && this.selectedDraftRecipients.length === 0){
            this.msgBoxMessage = "هیچ گیرنده اصلی یا پیش نویس انتخاب نشده است";
            this.msgBoxMessageType = 'fail';
            this.msgBoxButtons = 'ok';
            this.shallShowMsgBox = true;
            return;
        }
        this.sending = true;
        const sendFormDto = {} as any;
        const mandatoryValidation = {allValuesSupplied: true,errors:[]} as any;
        store.state.eventHub.$emit("mandatory-values-validation",mandatoryValidation);
        if(!mandatoryValidation.allValuesSupplied)
        {
            this.errors = this.mandatoryValuesErrorMessage;
            console.log(mandatoryValidation.errors);
            $('.popup').popup({onShow: this.shallShowError});
            this.sending = false;
            return;
        }
        else{
            this.errors = '';
        }
        store.state.eventHub.$emit('send-enterpriseform',sendFormDto);
      
        //Adding attached files to dto
        const attachedFiles = [] as any[];
        store.state.eventHub.$emit('add-file-requested',attachedFiles);
        sendFormDto.attachedFiles = attachedFiles;
        
        sendFormDto.draftReceivers = this.selectedDraftRecipients;
        sendFormDto.copyReceivers  = this.selectedCopyRecipients;
        sendFormDto.Receivers = this.selectedMainRecipients;
        if(this.nextFormInfo){
            sendFormDto.dependentLetterId = this.nextFormInfo.dependentLetterId;
            this.isNextForm = true;
        }
        else{
            this.isNextForm = false;
        }
        if(this.draftFormInfo)
            sendFormDto.parentDraftId = this.draftFormInfo.draftLetterId;
        
        const sendingResults =  await enterpriseFormService.sendEnterpriseForm(sendFormDto,mode);
        this.sending = false;
        
        if(!sendingResults.hasError){
            this.msgBoxMessageType = 'success';
            this.msgBoxButtons = 'ok';
            if(mode === 'send'){
                
                if(sendingResults.sentLetterInformation.letterNumber != ''){
                    this.msgBoxMessage = `نامه با شماره ${sendingResults.sentLetterInformation.letterNumber} ارسال گردید.`
                    //this.shallShowMsgBox = true;
                    this.isFormSent = true;
                    store.state.eventHub.$emit("show-message",this.msgBoxMessage);
                    this.$emit('sendform-close',this.isNextForm);

                }
            }
            else{
                 this.msgBoxMessage = "پیشنویس ذخیره شد";
                 //this.shallShowMsgBox = true;
                 this.isFormSent = true;
                 store.state.eventHub.$emit("show-message",this.msgBoxMessage);
                 this.$emit('sendform-close',this.isNextForm);
            }
        }
        else{
            this.msgBoxMessageType = 'fail';
            this.msgBoxButtons = 'ok';
            this.msgBoxMessage = sendingResults.errorMessage;
            this.shallShowMsgBox = true;
            this.isFormSent = true;
            this.isNextForm = false;
        }
    }
    cancel(){
        this.isNextForm = false;
        this.msgBoxMessage = 'آیا مطمئن هستید؟';
        this.msgBoxMessageType = '';
        this.msgBoxButtons = 'yesNo';
        if(this.shallRouteToReciveLettersForm==true){
            this.shallShowMsgBoxForRouteToReceiveForm=true;
        }else{
        this.shallShowMsgBox = true;
        }
    }
  
    onMsgBoxButtonClicked(btn: string){
        this.shallShowMsgBox = false;
        if((btn ==='ok' && this.isFormSent) || btn === 'yes'){
            // this.$emit('sendform-close',this.isNextForm);
            this.$emit('shallShowenterpriseFormListsEvent')

        }
    }
    onRouteToReceiveForm(btn: string){
        this.shallShowMsgBoxForRouteToReceiveForm = false;
        if((btn ==='ok' && this.isFormSent) || btn === 'yes'){
            // this.$emit('sendform-close',this.isNextForm);
            this.$emit('shallRouteToReceiveFormEvent')
        }
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
}
</script>

<style lang="less" scoped>
    .popup{
        overflow:auto;
    }
</style>