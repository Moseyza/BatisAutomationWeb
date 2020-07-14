<template>
    <ul>
        <li>
                <div style="display:flex;justify-content:flex-start; align-items:center">
                    <div v-if="nodeData.recievers.length > 0 && isHide" @click="toggleNode" style="flex:0.1"><i  class="icon icon-nodeIcon nodeIcon"></i></div>
                    <div v-else @click="toggleNode" style="flex:0.05"><i  class="icon icon-nodeIconOpen nodeIcon"></i></div>
                    <i v-if="nodeData.isOwnerCompanyAndIsAPeer" class="icon-InterCompanyTrace xlarg-text" style="flex:0.1"></i>
                    <i v-if="!nodeData.isOwnerCompanyAndIsAPeer && isOpened" class="icon-openLetter xlarg-text" style="flex:0.1"></i>
                    <i v-if="!nodeData.isOwnerCompanyAndIsAPeer && !isOpened" class="icon-notOpenLetter xlarg-text" style="flex:0.1"></i>
                    <div style="flex:1" > 
                        <span>{{nodeData.sender.nameOnly}}</span> 
                        <span v-if="nodeData.sender.post !=''" class="dark-text small-text">[{{nodeData.sender.post}}]</span> 
                        <span v-else-if="nodeData.sender.letterOwnerCompanyNameOnly !=''" class="dark-text small-text">[{{nodeData.sender.letterOwnerCompanyNameOnly}}]</span>   
                    </div>
                    <div style="flex:1;text-align:end;padding-left:5px">
                        {{timeStr}}
                    </div>
                    <div>
                            
                    </div>

                    <!-- <div style="font-size:8pt; color:#939393;flex:1">{{nodeData.sender.letterOwnerCompanyNameOnly}}</div> -->
                </div>
            <div>
            <LetterTrailTreeNode :class="{'hide':isHide}"
            v-for="(item,index) in nodeData.recievers"
            :key="item.sendTime + index"
            :nodeData="item"
            :serverTime="serverTime"
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
@Component({
    name:'LetterTrailTreeNode'
})
export default class LetterTrailTreeNode extends Vue {
    
    @Prop() nodeData?: LetterTrailWithAttachments;
    isHide = true;
    @Prop() serverTime?: string;
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

    get timeStr(){
        if(!this.nodeData) return '';
        if(!this.serverTime)return '';
        const dateConverter = new  DateBaseOnCurrentTimeConverter();
        return   dateConverter.getDateString(new Date(this.nodeData.sendTime.substring(0,this.nodeData.sendTime.length -1)),this.serverTime)
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
</style>



