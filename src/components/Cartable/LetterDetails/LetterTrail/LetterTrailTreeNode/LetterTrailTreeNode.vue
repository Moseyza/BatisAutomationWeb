<template>
    <ul>
        <li>
            <div>
                {{nodeData.senderName}}
            </div>
            <div>
                <LetterTrailTreeNode
            v-for="item in nodeData.recievers"
            :key="item.senderId"
            :nodeData="item"
            ></LetterTrailTreeNode>
            </div>
        </li>
    </ul>
</template>

<script lang="ts">

import {Vue, Prop, Component, Watch} from 'vue-property-decorator';
import { LetterTrail } from '@/store/models/Letter/LetterTrail';
@Component
export default class LetterTrailTreeNode extends Vue {
    
    @Prop() nodeData?: LetterTrail;

}

</script>

<style lang="less" scoped>

</style>



