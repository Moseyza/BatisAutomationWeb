<template>
    <div style="display:flex;flex-direction:column;margin:20px;border:1px solid black;">
        <div class="graphNodeHeader" :style="{'background-color':headerColor}">
            {{nodeData.title}}
        </div>
        <div class="graphNodeBody">
            <div>شماره:{{nodeData.letterNo}}</div>
            <div>تاریخ:{{persDate}}</div>
            <div>خلاصه:{{nodeData.abstract}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Prop, Component } from 'vue-property-decorator'
import {LettersInDependencyGraph} from '@/store/models/Letter/DependencyTrail';
import * as persianDate from 'persian-date';
import * as util from '@/util/utils';
@Component
export default class DependencyGraphNode extends Vue{
    @Prop() nodeData?: LettersInDependencyGraph;

    get headerColor(){
        if(!this.nodeData)return 'gray';
        if(this.nodeData.enterpriseFormColor)
            return "#"+ this.nodeData.enterpriseFormColor.toString(16).substring(2).padStart(6,'0');
        return 'gray';
    }

    created(){
        //alert(this.headerColor);
        

    }

    get persDate(){
        if(this.nodeData)
             return util.getPersianDate(this.nodeData.letterDate,"YYYY/mm/DD");
        return '';
        
    }
}
</script>

<style lang="less" scoped>
    .graphNodeHeader{
        text-align: center;
        color:white;
        border-bottom: 1px solid black;
        padding: 5px;
    }

    .graphNodeBody{
        padding: 5px;
        display: flex;
        flex-direction: column;
    }
    .graphNodeBody>div{
        text-align: right;
        margin: 5px;
        color:black;
        background-color: white;

    }

</style>


