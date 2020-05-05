<template>
    <!-- <ul> -->
        <div class="node">
            <div id="node-title">
                <i style="flex:1" :class="data.iconClass"></i>
                <h5 style="flex:4" v-if="data.isRoot">{{data.name}}</h5>
                <router-link style="flex:4;cursor:pointer" v-else tag="div" :to="data.url" >{{data.name}}</router-link>
            </div>
            <FoldersTreeNode
            v-for="child in data.children" 
            :data="child"
            :key="child.url"
            >
            </FoldersTreeNode>
        </div>
    <!-- </ul> -->
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';


@Component
export default class FoldersTreeNode extends Vue {
    @Prop() data?: FoldersTreeNodeData;


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
    }

</style>

