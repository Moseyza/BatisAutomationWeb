<template>
    <div>
        <div v-if="loading" class="ui active inline centered loader"></div>
        <LetterTrailTreeNode v-else :nodeData="data" :serverTime="serverTime"></LetterTrailTreeNode>
    </div>
    
</template>

<script lang="ts">
import {Vue, Prop, Component, Watch} from 'vue-property-decorator';
import LetterTrailTreeNode from './LetterTrailTreeNode/LetterTrailTreeNode.vue';
import { LetterTrail } from '@/store/models/Letter/LetterTrail';
import * as letterService  from '@/store/Services/letterServices.ts';
import store from '@/store';
import { LetterTrailWithAttachments } from '../../../../store/models/Letter/LetterTrailWithAttachment';
@Component({
    name:"LetterTrailTree",
    components: {LetterTrailTreeNode}
})
export default class LetterTrailTree extends Vue {
    data?: LetterTrailWithAttachments;
    loading = false;
    serverTime = '';
    @Prop() letterId?: string;
    
    @Watch('letterId')
    async onLetterIdChanged(){
        await this.getLetterTrail();
    }

    async created(){
        this.serverTime = await letterService.getServerTime();
        await this.getLetterTrail();
    }

    async getLetterTrail(){
        if(this.letterId === undefined)return;
        this.loading = true;
        const ownerId =  store.state.ownerId;
        this.data =  await  letterService.GetLetterTrialWithAttachment(this.letterId,ownerId);
        alert("######");
        console.log(this.data);
        this.loading = false;

    }
}
</script>

<style lang="less" scoped>

</style>

