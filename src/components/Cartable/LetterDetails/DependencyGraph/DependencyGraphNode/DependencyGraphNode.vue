<template>
    <div  ref="nodcontainer" @dblclick="onNodeClick($event)" class="d-Graph-node" :class="{'selected-node':isSelected}">
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
import * as $ from 'jquery';
import store from '@/store';

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
        store.state.eventHub.$on("page-clicked",this.moveNode);
        store.state.eventHub.$on("unselect-all",this.unSelect);
        

    }

    unSelect(){
        this.isSelected = false;
    }

    moveNode(letterId: string, x: number , y: number){
        if(!this.nodeData)return;
        if(this.nodeData.letterId != letterId)return;
        //const width =  $(this.$refs.nodcontainer).css('width');
        //const height =  $(this.$refs.nodcontainer).css('height');
        $(this.$refs.nodcontainer).css('top',y);
        $(this.$refs.nodcontainer).css('left',x);
        this.isSelected = false;
        //$(this.$refs.nodcontainer).css('width',width);
        //$(this.$refs.nodcontainer).css('height',height);
    }

    get persDate(){
        if(this.nodeData)
             return util.getPersianDate(this.nodeData.letterDate,"YYYY/mm/DD");
        return '';
        
    }
    isSelected = false;
    onNodeClick(e: Event){
        e.stopPropagation();
        if(!this.nodeData)return;
        store.state.eventHub.$emit("unselect-all");
        this.$emit("clicked",this.nodeData.letterId);
        this.isSelected = true;
        //alert(( this.$refs.nodcontainer as any).clientWidth);
    }
}
</script>

<style lang="less" scoped>
    .graphNodeHeader{
        text-align: right;
        color:white;
        border-bottom: 1px solid black;
        padding: 5px;
        overflow: auto;
        white-space: nowrap;
        font-size: inherit;
        border-radius: 3px 3px 0 0;
    }

    .graphNodeBody{
        padding: 5px;
        display: flex;
        flex-direction: column;
        overflow: auto;
        font-size: inherit;
        background-color: white;
    }
    .graphNodeBody>div{
        text-align: right;
        margin: 5px;
        color:black;
        background-color: white;
        font-size: inherit;

    }
    .d-Graph-node{
        display:flex;
        flex-direction:column;
        border:1px solid black;
        position: absolute;
        overflow: hidden;
        font-size: .8em;
        border-radius: 3px;
    }

    .selected-node{
        border: 2px solid red;
    }

</style>


