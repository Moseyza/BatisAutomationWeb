<template>
    <div>
        <div v-if="loading" class="ui active inline centered loader"></div>
        <LetterTrailTreeNode v-else :nodeData="data" :serverTime="serverTime" :isRoot="true"></LetterTrailTreeNode>
    </div>
    
</template>

<script lang="ts">
import {Vue, Prop, Component, Watch} from 'vue-property-decorator';
import LetterTrailTreeNode from './LetterTrailTreeNode/LetterTrailTreeNode.vue';
import { LetterTrail } from '@/store/models/Letter/LetterTrail';
import * as letterService  from '@/store/Services/letterServices.ts';
import store from '@/store';
import { LetterTrailWithAttachments } from '../../../../store/models/Letter/LetterTrailWithAttachment';
import { LetterOwner } from '../../../../store/models/LetterOwner/LetterOwner';
@Component({
    name:"LetterTrailTree",
    components: {LetterTrailTreeNode}
})
export default class LetterTrailTree extends Vue {
    data?: LetterTrailWithAttachments;
    loading = false;
    serverTime = '';
    @Prop() letterId?: string;
    @Prop() letterNo?: string;
    
    @Watch('letterId')
    async onLetterIdChanged(){
        await this.getLetterTrail();
    }

    async created(){
        await this.getLetterTrail();
        this.serverTime = await letterService.getServerTime();
    }

    async getLetterTrail(){
        if(this.letterId === undefined)return;
        this.loading = true;
        const ownerId =  store.state.ownerId;
        const  trailData =  await  letterService.GetLetterTrialWithAttachment(this.letterId,ownerId);
        trailData.isSender = true;
        const root = {} as LetterTrailWithAttachments;
        root.sender = {} as LetterOwner;
        root.sender.nameOnly = `پیگیری نامه ${this.letterNo}`;
        root.recievers = [];
        root.sendTime = '';
        root.recievers[0] = trailData;
        this.data = root;

        this.loading = false;
    }
}
</script>

<style lang="less" scoped>

</style>

