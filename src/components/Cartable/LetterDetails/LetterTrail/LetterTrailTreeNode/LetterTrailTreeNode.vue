<template>
    <ul>
        <li>
                <div style="display:flex;align-items:center">
                    <i v-if="nodeData.isOwnerCompanyAndIsAPeer" class="icon-InterCompanyTrace xlarg-text" style="flex:0.1"></i>
                    <i v-if="!nodeData.isOwnerCompanyAndIsAPeer && isOpened" class="icon-openLetter xlarg-text" style="flex:0.1"></i>
                    <i v-if="!nodeData.isOwnerCompanyAndIsAPeer && !isOpened" class="icon-notOpenLetter xlarg-text" style="flex:0.1"></i>
                    <span style="flex:1" > {{nodeData.sender.nameOnly}} </span>  
                    <span style="font-size:8pt; color:#939393;flex:1">{{nodeData.sender.letterOwnerCompanyNameOnly}}</span>
                </div>
            <div>
            <LetterTrailTreeNode
            v-for="(item,index) in nodeData.recievers"
            :key="item.sendTime + index"
            :nodeData="item"
            ></LetterTrailTreeNode>
            </div>
        </li>
    </ul>
</template>

<script lang="ts">

import {Vue, Prop, Component, Watch} from 'vue-property-decorator';
import { getPersianDate } from '@/util/utils';
import { LetterTrailWithAttachments } from '../../../../../store/models/Letter/LetterTrailWithAttachment';
@Component
export default class LetterTrailTreeNode extends Vue {
    
    @Prop() nodeData?: LetterTrailWithAttachments;

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
</style>



