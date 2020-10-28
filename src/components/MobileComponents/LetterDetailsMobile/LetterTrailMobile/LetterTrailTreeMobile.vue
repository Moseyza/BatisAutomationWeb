<template>
    <div style="color:var(--TxtColor) !important">
        <div v-if="loading" class="ui active inline centered loader"></div>
        <LetterTrailTreeNodeMobile v-else :nodeData="data" :serverTime="serverTime" :isRoot="true" :currentPossession="letterId" :isHideProp="rootIsHide" ></LetterTrailTreeNodeMobile>
    </div>
    
</template>

<script lang="ts">
import {Vue, Prop, Component, Watch} from 'vue-property-decorator';
import LetterTrailTreeNodeMobile from './LetterTrailTreeNodeMobile/LetterTrailTreeNodeMobile.vue';
import { LetterTrail } from '@/store/models/Letter/LetterTrail';
import * as letterService  from '@/store/Services/letterServices.ts';
import store from '@/store';
import { LetterTrailWithAttachments } from '../../../../store/models/Letter/LetterTrailWithAttachment';
import { LetterOwner } from '../../../../store/models/LetterOwner/LetterOwner';

@Component({
    name:"LetterTrailTreeMobile",
    components: {LetterTrailTreeNodeMobile}
})
export default class LetterTrailTreeMobile extends Vue {
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
        store.state.eventHub.$on("remote-inquiry",this.onRemoteInquiry);
    }
    root = {} as LetterTrailWithAttachments;
    async getLetterTrail(){
        if(this.letterId === undefined)return;
        this.loading = true;
        const ownerId =  store.state.ownerId;
        const  trailData =  await  letterService.GetLetterTrialWithAttachment(this.letterId,ownerId);
        trailData.isSender = true;
        this.root = {} as LetterTrailWithAttachments;
        this.root.sender = {} as LetterOwner;
        this.root.sender.nameOnly = `پیگیری نامه ${this.letterNo}`;
        this.root.recievers = [];
        this.root.sendTime = '';
        this.root.recievers[0] = trailData;
        this.data = this.root;
        this.loading = false;
    }
    
    onRemoteInquiry(inquriyResult: LetterTrailWithAttachments, possessionId: string ){
        //console.log(this.root);
        this.getParentRecursive(this.root,possessionId);
        const remotItem =  this.tempParent.recievers.find(x=>x.possessionId === possessionId);
        if(!remotItem)return;
        const index =  this.tempParent.recievers.indexOf(remotItem);
        if(!this.tempParent)return;
        this.tempParent.recievers = [];//this.tempParent.recievers.splice(index,1);
        inquriyResult.recievers.push(remotItem);
        this.tempParent.recievers.splice(0,0,inquriyResult);
        this.data = this.tempParent;
        this.rootIsHide = true;
    }
    tempParent = {} as LetterTrailWithAttachments;
    rootIsHide = false;
    getParentRecursive(parent: LetterTrailWithAttachments, possessionId: string  ){
        parent.recievers.forEach(reciever => {
            if(reciever.possessionId === possessionId){
                this.tempParent = parent;
            }
            else{
                this.getParentRecursive(reciever,possessionId);
            }
        });
    }
}
</script>

<style lang="less" scoped>

</style>

