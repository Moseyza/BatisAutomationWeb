<template>
    <ul>
        <li>
            <div>
                <i :class="data.iconClass"></i>
                <router-link tag="div" :to="data.url" >{{data.name}}</router-link>
            </div>
            <FoldersTreeNoode
            v-for="child in data.children" 
            :data="child"
            :key="child.url"
            >
            <FoldersTreeNode/>
        </li>
    </ul>
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

</style>

