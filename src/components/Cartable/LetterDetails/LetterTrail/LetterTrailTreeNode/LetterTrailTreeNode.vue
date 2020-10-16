<template>
    <ul>
        <li style="margin-top:5px">
            <div style="display:flex;flex-direction:column">
                <div class="trail-node-title" :class="{'flex-start': isRoot}">
                    <div v-if="nodeData.recievers.length > 0 && isHide" @click="toggleNode" style="padding-top: 5px;" ><i  class="icon icon-nodeIcon nodeIcon"></i></div>
                    <div v-else @click="toggleNode" style="padding-top: 5px;" ><i  class="icon icon-nodeIconOpen nodeIcon"></i></div>
                    <div >
                        <i class="xlarg-text" :class="{ 'icon-letterTrail':isRoot , 'icon-InterCompanyTrace':isInterCompany , 'icon-openLetter':isOpen , 'icon-notOpenLetter':isNotOpen , 'icon-allClosed':isClosed , 'icon-allDraft':isDraft}"></i>
                    </div>
                    <!-- <div v-if="isRoot"><i class="icon-letterTrail xlarg-text"></i></div>
                    <div v-if=""> <i  class="icon-InterCompanyTrace xlarg-text" ></i></div>
                    <div v-if=""> <i  class="icon-openLetter xlarg-text" ></i></div>
                    <div v-if=""> <i  class="icon-notOpenLetter xlarg-text" ></i></div>
                    <div v-if=""> <i  class="icon-allClosed xlarg-text" ></i></div> -->
                    <div> 
                        <span :class="{red: currentPossession === nodeData.possessionId}">{{nodeData.sender.nameOnly}} </span> 
                        <span v-if="nodeData.sender.post" class="dark-text small-text">[{{nodeData.sender.post}}]</span> 
                        <span v-else-if="nodeData.sender.letterOwnerCompanyNameOnly" class="dark-text small-text">[{{nodeData.sender.letterOwnerCompanyNameOnly}}]</span>   
                    </div>
                    <div v-if="!isRoot" style="text-align:end;padding-left:5px;flex:1 0 auto">
                        {{timeStr}}
                    </div>
                    <div v-if="!isRoot" @click="toggleComment">
                        <i class="action-icon small-text" :class="{'icon-comboboxArrow':!shallShowComment, 'icon-arrowUp': shallShowComment}"></i>
                    </div>
                </div>
                <div v-if="shallShowComment">
                           <LetterTrailNodeComment 
                           :mode="nodeData.isSender?'send':'forward'" 
                           :sendTime="nodeData.sendTime"
                           :comment="nodeData.comment"
                           :attachments ="nodeData.attachments"
                           /> 
                </div>
                <div v-if="shallShowComment && nodeData.closeTime">
                           <LetterTrailNodeComment 
                           :mode="'close'" 
                           :sendTime="nodeData.closeTime"
                           :comment="nodeData.closingComment"
                           :attachments ="nodeData.attachments"
                           /> 
                           
                </div>
                <div v-if="shallShowComment" >
                     <button v-if="nodeData.isSendedViaMessagingApp" @click="getTelegramStatus()"  style="float:left;margin-top:5px;margin-left:5px" >وضعیت تلگرام <i v-if="isTelegramOk" class="icon icon-check" style="color:#69b578;font-size:8pt" ></i>  <div v-if="isLoadingTelegramStatus" class="ui active inline mini centered loader"></div> </button>
                    <button v-if="nodeData.isEmailed" @click="getEmailStatus()"  style="float:left;margin-top:5px;margin-left:5px" >وضعیت ایمیل <i v-if="isEmailOk" class="icon icon-check" style="color:#69b578;font-size:8pt" ></i>  <div v-if="isLoadingEmailStatus" class="ui active inline mini centered loader"></div> </button>
                    <button v-if="isInterCompany" @click="getRemotLetterTrail()"  class="action-button" style="float:left;margin-top:5px;margin-left:5px" >استعلام نامه</button>
                </div>
                <div v-if="shallShowComment" class="bottom-line">

                </div>
                
            </div>
            <div>
            <LetterTrailTreeNode 
            :class="{'hide':isHide}"
            v-for="(item,index) in nodeData.recievers"
            :key="item.sendTime + index"
            :nodeData="item"
            :serverTime="serverTime"
            :currentPossession="currentPossession"
            :isHideProp="isHide"
            ></LetterTrailTreeNode>
            </div>
        </li>
    </ul>
</template>

<script lang="ts">

import {Vue, Prop, Component, Watch} from 'vue-property-decorator';
import { getPersianDate } from '@/util/utils';
import { LetterTrailWithAttachments } from '../../../../../store/models/Letter/LetterTrailWithAttachment';
import * as dateConverter from '@/util/dateConverter';
import { DateBaseOnCurrentTimeConverter } from '@/util/dateConverter';
import * as letterService from '@/store/Services/letterServices';
import LetterTrailNodeComment from './LetterTrailNodeComment/LetterTrailNodeComment.vue';
import store from '@/store';

@Component({
    name:'LetterTrailTreeNode',
    components: {LetterTrailNodeComment}
})
export default class LetterTrailTreeNode extends Vue {
   
    @Prop() nodeData?: LetterTrailWithAttachments;
    @Prop() currentPossession?: string;
    isHide = true;
    @Prop() isHideProp?: boolean;
    @Watch('isHideProp')
    onIsHidePropChanged(newVal: boolean , oldVal: boolean){
        
        this.isHide = newVal;
    }
    shallShowComment = false;
    @Prop() serverTime?: string;
    @Prop() isRoot?: boolean;
    get isOpened(){
        //console.log("test");
        //console.log(this.nodeData);
        
        if(this.nodeData === undefined) return false;
        //console.log(getPersianDate(this.nodeData.sendTime,"dddd dd MMMM"));
        if(this.nodeData.openTime === null)
            return false;
        else
            return true;
    }

    toggleNode(){
        
        this.isHide = !this.isHide;

    }
    
    

    toggleComment(){
        this.shallShowComment = !this.shallShowComment;

    }

    get timeStr(){
        if(!this.nodeData) return '';
        if(!this.serverTime)return '';
        const dateConverter = new  DateBaseOnCurrentTimeConverter();
        return   dateConverter.getDateString(new Date(this.nodeData.sendTime.substring(0,this.nodeData.sendTime.length -1)),this.serverTime)
    }

    get isInterCompany(){
        if(!this.nodeData) return false;
        return !this.isRoot && this.nodeData.isOwnerCompanyAndIsAPeer
    }

    get isOpen(){
        if(!this.nodeData) return false;
        return !this.isRoot && !this.nodeData.isOwnerCompanyAndIsAPeer && this.nodeData.openTime && !this.nodeData.isClosed && !this.isDraft

    }

    get isNotOpen(){
        if(!this.nodeData) return false;
        return !this.isRoot && !this.nodeData.isOwnerCompanyAndIsAPeer && !this.nodeData.openTime && !this.nodeData.isClosed && !this.isDraft

    }

    get isClosed(){
        if(!this.nodeData) return false;
        return !this.isRoot && !this.nodeData.isOwnerCompanyAndIsAPeer && this.nodeData.isClosed && !this.isDraft
    }

    get isDraft(){
        if(!this.nodeData) return false;
        return this.nodeData.isDraft;
    }

    async getRemotLetterTrail(){
        if(!this.nodeData)return;
        const ownerId = store.state.ownerId;
        const result =  await letterService.GetRemoteLetterTrail(this.nodeData.possessionId,ownerId);
        //this.nodeData = result;
        store.state.eventHub.$emit("remote-inquiry",result,this.nodeData.possessionId);
    }

    isEmailOk = false;
    isLoadingEmailStatus = false;
    async getEmailStatus(){
        this.isLoadingEmailStatus = true;
        if(!this.nodeData)return;
        const mailState =  await letterService.getEmailStatus(this.nodeData.emailReference);
        this.isLoadingEmailStatus = false;
        if(mailState === 3)
            this.isEmailOk = true;
    }
    isTelegramOk = false;
    isLoadingTelegramStatus = false;
    async getTelegramStatus(){
        this.isLoadingTelegramStatus = true;
        if(!this.nodeData)return;
        const telegramState =  await letterService.getTelegramStatus(this.nodeData.messagingAppReference);
        this.isLoadingTelegramStatus = false;
        if(telegramState === 3)
            this.isTelegramOk = true;
    }

    
    

}

</script>

<style lang="less" scoped>
    ul{
        list-style-type: none;
    }
    #node-row{
        display: flex;

    }
    #node-row>div{
        flex: 1;
    }
    .hide{
        display: none;
    }
    .nodeIcon{
          font-size: 8pt !important;
    }
    .nodeIcon:hover{
        color:#ff6b6b;
        font-size: 10pt !important;
    }
    .trail-node-title{
        display: flex;
        justify-content: space-between;
    }
    .trail-node-title>div{
        margin-left: 5px;
    }
    .flex-start{
        justify-content: flex-start;
    }
    .red{
        color:#ff6b6b;
    }
</style>



