<template>
    <div class="ui page active dimmer">
        <div style="width: 80%; height: 80%;background-color:white;overflow: hidden;">

            <div style="background-color:gray;display: flex; justify-content: flex-end;"> 
                بزرگ نمایی:<input type="range" min="1" max="100" v-model="zoom">
                <!-- <button style="" @click="refreshTree" class="action-button"><i class="icon-refresh"></i> </button>  -->
                <button style="" @click="close" class="action-button"><i class="icon-removeFile"></i> </button> 
                 
            </div>

            <div ref="page" @mousedown="onPageClick($event)" :class="{'moving':isMovingNode}" :style="{zoom: zoom+'%'}" style="padding:5px;border:1px solid black;height:100%;overflow:auto;position: relative;direction:ltr">
                
                <DependencyGraphNode v-for="letter in dependencyTrail.letters" :key="letter.letterNo" :nodeData="letter" @clicked="onGraphNodeClicked($event)" @expose-width="onExposeWidth" />
                <!-- <svg width="500" height="500"><line x1="50" y1="50" x2="350" y2="350" stroke="black" stroke-width=2 /></svg> -->
                
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import * as letterService from '@/store/Services/letterServices';
import store from '@/store';
import { DependencyTrail, DependencyTreeNode } from '@/store/models/Letter/DependencyTrail';
import DependencyGraphNode from './DependencyGraphNode/DependencyGraphNode.vue';
import * as $ from 'jquery';

@Component({
    components:{DependencyGraphNode}
})
export default class DependencyGraphContainer extends Vue{
    @Prop() letterPossessionId?: string;
    dependencyTrail: DependencyTrail = {} as DependencyTrail;
    zoom = 100;
    @Watch("letterPossessionId")
    onPossessionIdChanged()
    {
        this.refreshTree();
    }
    async created(){
        this.refreshTree();
    }

    async refreshTree(){
        this.maxTreeLevel = 0;
        this.levelList = [] as string[][];
        this.levelSumWidth = [] as number[];
        if(!this.letterPossessionId)return;
        const ownerId =  store.state.ownerId;
        this.dependencyTrail = await letterService.getDependencyTrail(ownerId,this.letterPossessionId);
        //console.log(this.dependencyTrail);
        (this.$refs.page as any).addEventListener('contextmenu',this.cancel);
        this.createDependencyTree();
        
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

    createDependencyTree(){
        if(!this.dependencyTrail)return;
        if(!this.dependencyTrail.dependencyGraph)return;
        if(!this.dependencyTrail.letters)return;
        const sqrt = Math.sqrt(this.dependencyTrail.dependencyGraph.length) - 1;
        let rootIndex = -1;
        for(let i =0 ;i <= sqrt; i++)
        {
            for(let j = 0; j<=sqrt; j++)
            {
                if(this.dependencyTrail.dependencyGraph[((i*sqrt) + (i+j))] != null)
                    break;
                if(j === sqrt)
                    rootIndex = i;
            }
            if(rootIndex !== -1)break;
        }
        const root = {} as DependencyTreeNode;
        root.letterId = this.dependencyTrail.letters[rootIndex].letterId;
        root.level = 0;
        root.childs = [];
        root.childType = [];
        this.addNodToTreeRecursive(root,rootIndex,sqrt);
        //console.log("ROOT====>");
        //console.log(root);
        for(let i = 0;i <=this.maxTreeLevel;i++)
        {
            this.levelList[i] = [];
            this.levelSumWidth[i] = 0;
        }
        this.flatTreeRecursive(root);
        //console.log(this.levelList);
        
        
    }
    maxTreeLevel = 0;
    levelList = [] as string[][];
    levelSumWidth = [] as number[];
    addNodToTreeRecursive(parent: DependencyTreeNode, index: number,sqrt: number){
        if(!this.dependencyTrail)return;
        if(!this.dependencyTrail.letters)return;
        if(!this.dependencyTrail.dependencyGraph)return;
        let currentIndex = index; 
        for(let rowIndex = 0;rowIndex <= sqrt;rowIndex++)
        {
            if(this.dependencyTrail.dependencyGraph[currentIndex] != null){
                const child = {} as DependencyTreeNode;
                child.letterId = this.dependencyTrail.letters[rowIndex].letterId;
                child.level = parent.level+ 1;
                if(child.level > this.maxTreeLevel) this.maxTreeLevel = child.level;
                child.childs = [];
                child.childType = [];
                parent.childs.push(child);
                parent.childType.push(this.dependencyTrail.dependencyGraph[currentIndex]);
                this.addNodToTreeRecursive(child,rowIndex,sqrt);
            }
            currentIndex += sqrt +1;
        }
    }

    flatTreeRecursive(node: DependencyTreeNode){
        this.levelList[node.level].push(node.letterId);
        node.childs.forEach(c=>this.flatTreeRecursive(c));
    }

    onExposeWidth(width: number, level: number){
        this.levelSumWidth[level] += width + 40; // 40 px between each node
    }
    isFirstUpdate = false;
    maxLevelWidth = 0;
    updated(){
       // if(this.isFirstUpdate)return;
        //this.isFirstUpdate = true;
        for(let i = 0;i <=this.maxTreeLevel;i++)
        {
            this.levelSumWidth[i] = 0;
        }
        for(let i = 0;i <=this.maxTreeLevel;i++)
        {
            this.levelList[i].forEach(letterId=>store.state.eventHub.$emit("get-width",letterId,i));
        }
       // console.log(this.levelSumWidth);
        this.maxLevelWidth = 0;
        this.levelSumWidth.forEach(w=> {
            if(w > this.maxLevelWidth)this.maxLevelWidth = w;
        });
        this.setNodesPosition();
    }

    setNodesPosition(){
        for(let i = 0;i <=this.maxTreeLevel;i++)
        {
            let x = 0;
            const y = (i * 150) + 10;
            const leftMargin = (this.maxLevelWidth - this.levelSumWidth[i])/2 + 50;
            x = leftMargin;
            this.levelList[i].forEach(letterId=>{
                store.state.eventHub.$emit("set-position",letterId,x,y);
                x += this.levelSumWidth[i]/this.levelList[i].length
            });
        }
    }
    
    
}
</script>

<style lang="less" scoped>
    .moving{
        cursor: crosshair;
    }
</style>
