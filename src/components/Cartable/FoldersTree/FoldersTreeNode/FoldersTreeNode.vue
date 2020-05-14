<template>
    <!-- <ul> -->
        <div class="node">
            <div id="node-title">
                <i class="node-icon" @click="toggle()" :class="{'icon-nodeClose':!isOpen , 'icon-nodeOpen':isOpen}" ></i>
                <i style="flex:1" :class="data.iconClass"></i>
                <h5 style="flex:5" v-if="data.isRoot">{{data.name}}</h5>
                <router-link style="flex:5;cursor:pointer" v-else tag="div" :to="data.url" >{{data.name}}</router-link>
            </div>
            <div :class="{hide:!isOpen}">
                <FoldersTreeNode
                v-for="child in data.children" 
                :data="child"
                :key="child.url"
                >
                </FoldersTreeNode>
            </div>
        </div>
    <!-- </ul> -->
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';


@Component({
    name:'FoldersTreeNode'
})
export default class FoldersTreeNode extends Vue {
    @Prop() data?: FoldersTreeNodeData;
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
    #node-title{
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
    h5{
        margin: 0;
    }
    .node-icon{
        color: #939393;
        // color:#96171A;
        font-size: x-small;
        flex: 1;
        cursor: pointer;
    }
    .hide{
        display: none;
    }

</style>

