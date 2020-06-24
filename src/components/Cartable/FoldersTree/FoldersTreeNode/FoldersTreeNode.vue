<template>
    <!-- <ul> -->
        <div class="node">
            <div class="node-title">
                <div class="leaf-node" v-if="data.children.length == 0" ></div>
                <i v-if="data.children.length >0" class="icon-nodeIconOpen node-icon" @click="toggle()" :class="{'icon-nodeIcon':!isOpen , 'icon-nodeIconOpen':isOpen}" ></i>
                <i style="flex:1;padding-top:5px;" :class="data.iconClass"></i>
                <h5 style="flex:5;text-align:right;padding-top:10px" v-if="data.isRoot">{{data.name}}</h5>
                <router-link style="flex:5;cursor:pointer;padding-top:10px" v-else tag="div" :to="data.url" >{{data.name}}</router-link>
                <input type="checkbox" v-if="isSelectable" v-model="isSelected"/>
            </div>
            <div class="node-child" :class="{hide:!isOpen}">
                <FoldersTreeNode
                v-for="child in data.children" 
                :data="child"
                :key="child.url"
                :isSelectable= "isSelectable"
                @selected-changed="onChildSelectionChanged($event)"
                >
                </FoldersTreeNode>
            </div>
        </div>
    <!-- </ul> -->
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';


@Component({
    name:'FoldersTreeNode'
})
export default class FoldersTreeNode extends Vue {
    @Prop() data?: FoldersTreeNodeData;
    @Prop() isSelectable?: boolean;
    
    isSelected = false;
    @Watch('isSelected')
    onSelectionChanged(nVal: boolean, oVal: boolean){
        if(this.data)
            this.$emit("selected-changed",{isSelected: nVal , id: this.data.url});
    }
    onChildSelectionChanged(selection: any){
        this.$emit("selected-changed",selection);
    }
    isOpen = false;
    toggle(){
        if(this.data === undefined) return;
        if(this.data.children.length === 0) return;
        this.isOpen = !this.isOpen;
    }

    created(){
        if(this.data === undefined) return;
        if(this.data.children.length === 0 || this.data.children === undefined) this.isOpen = true;
    }
}


export interface FoldersTreeNodeData {
    isRoot: boolean;
    name: string;
    id: string;
    iconClass: any;
    url: string;
    children: FoldersTreeNodeData[];
}


</script>

<style lang="less" scoped>
    ul{
        list-style-type: none;
        // margin: 0;
        // padding: 0;
    }
    .node-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        white-space: nowrap;
    }
    router-link{
        cursor: pointer;
    }

    .node{
        margin-right: 10px;
        // margin-top: 5px;
    }
    // .node-child::before{
    //     content: '';
    //     padding:10px 5px;
    //     border-right: 1px dotted whitesmoke;
    //     border-bottom: 1px dotted whitesmoke;
    //     position: relative;
    //     right: 3px;
    //     top: 0;
    //     width: 5px;
    // }
    .node::after{
         content: '';
        padding:5px 5px;
        border-right: 1px solid gray;
        //border-bottom: 1px dotted whitesmoke;
        position: relative;
        right: 5px;
        top: 0;
        width: 5px;
    }
    .node:last-child::after{
         padding:10px 5px;
        border-right: none;
        //border-bottom: 1px dotted whitesmoke;
        position: relative;
        right: 5px;
        top: 0;
        width: 5px;
    }
    .node-child{
        border-right: 1px solid gray;
        margin-right: 5px;
        margin-top: 0px;
    }
    
    #folders-container > .node:last-child > .node-child{
        border-right: none;
    }
    .node-child .node:last-child > .node-child{
        border-right: none;
    }
    .leaf-node::before{
        content: '';
        display: inline;
        padding-top: 3px;
        padding-right: 10px;
        position: relative;
        // width: 3px;
        // height: 5px;
        border-right: 1px solid gray;
        border-bottom: 1px solid gray;
        right: 5px;
        top: 0;
        margin-left: 10px;
    }
    h5{
        margin: 0;
    }
    .node-icon{
        color: #939393;
        // color:#96171A;
        font-size: small;
        flex: 1;
        cursor: pointer;
    }
    // .node-icon::before{
    //     content: "";
    //     padding:5px;
    //     height: 50%;
    //     border-bottom: 1px solid gray;
    //     position: relative;
    // }
    .node-icon:hover{
        color: #ff6b6b;
    }
    .hide{
        display: none;
    }
    .node-child .node{
        margin-right: 30px;
    }
    .node-icon{
       
        font-size: smaller;
    }
    .node-icon:hover{
        font-size: medium;
         color: #ff6b6b;
         left: 5px;
    }


</style>

