<template>
    <div class="ui page active dimmer">
        <div style="width: 80%; height: 80%;background-color:white;overflow: hidden;">

            <div style="background-color:gray;display: flex;
    justify-content: flex-end;"> 
                <button style="" @click="close" class="action-button"><i class="icon-removeFile"></i> </button> 
            </div>

            <div ref="page" @mousedown="onPageClick($event)" :class="{'moving':isMovingNode}" style="padding:5px;border:1px solid black;height:100%;overflow:auto;position: relative;direction:ltr">
                
                <DependencyGraphNode v-for="letter in dependencyTrail.letters" :key="letter.letterNo" :nodeData="letter" @clicked="onGraphNodeClicked($event)" />
                <!-- <svg width="500" height="500"><line x1="50" y1="50" x2="350" y2="350" stroke="black" stroke-width=2 /></svg> -->
                
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import * as letterService from '@/store/Services/letterServices';
import store from '@/store';
import { DependencyTrail } from '@/store/models/Letter/DependencyTrail';
import DependencyGraphNode from './DependencyGraphNode/DependencyGraphNode.vue';
import * as $ from 'jquery';

@Component({
    components:{DependencyGraphNode}
})
export default class DependencyGraphContainer extends Vue{
    @Prop() letterPossessionId?: string;
    dependencyTrail: DependencyTrail = {} as DependencyTrail;
    async created(){
        if(!this.letterPossessionId)return;
        const ownerId =  store.state.ownerId;
        this.dependencyTrail = await letterService.getDependencyTrail(ownerId,this.letterPossessionId);
        console.log(this.dependencyTrail);
        (this.$refs.page as any).addEventListener('contextmenu',this.cancel);
    }
    cancel(e: Event){
        e.preventDefault();
    }

    close(){
        this.$emit("close");
    }

    onPageClick(e: MouseEvent){
        e.stopPropagation();
        if( e.button ==0){
        //alert(( $(this.$refs.page).css('left')) + "|" + (e.clientY - $(this.$refs.page).css('top') ));
        //alert( e.clientX - (this.$refs.page as any).offsetLeft  + "|" + (e.clientY - (this.$refs.page as any).offsetTop ));
        //alert(( this.$refs.nodcontainer as any).clientWidth);
            const x = e.clientX - (this.$refs.page as any).offsetLeft;
            const y = e.clientY - (this.$refs.page as any).offsetTop;
            store.state.eventHub.$emit("page-clicked",this.lastClickedLetterId,x,y);
        }
        this.lastClickedLetterId = '';
        this.isMovingNode = false;
        store.state.eventHub.$emit("unselect-all");
        
    }

    lastClickedLetterId = '';
    isMovingNode = false;
    onGraphNodeClicked(letterId: string){
        this.lastClickedLetterId = letterId;
        this.isMovingNode = true;
    }
    
}
</script>

<style lang="less" scoped>
    .moving{
        cursor: crosshair;
    }
</style>
