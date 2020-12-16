<template>
    <div id='FastSendRecipientSelectorMobile' style="display:flex;align-items: center;flex-wrap:wrap">
        <!-- <div style="flex:1" id="selection-area"> -->
            <FastSendSelectedRecipientMobile
            v-for="recipient in recipients"
            :key="recipient.id"
            :recipient="recipient"
            @recipient-removed="onRecipientRemoved($event)"
            :autoCompleteDataType="autoCompleteDataType"
            :hideComment="hideComment"
            />
        <!-- </div> -->
        <!-- <div style="flex:0 1 auto"> -->
            <button class="button" @click="requestAddItem()">+</button>
        <!-- </div> -->
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { AutoCompleteData } from '@/store/models/Letter/AutoCompleteData';
import FastSendSelectedRecipientMobile from './FastSendSelectedRecipientMobile/FastSendSelectedRecipientMobile.vue';
import { LetterOwnerForSendingFaxAndEmailAndSms } from '../../../../store/models/LetterOwner/LetterOwnerForSendingFaxAndEmailAndSms';

@Component({
    name:"FastSendRecipientSelectorMobile",
    components: {FastSendSelectedRecipientMobile}
})
export default class FastSendRecipientSelectorMobile extends Vue{
    @Prop() recipients?: LetterOwnerForSendingFaxAndEmailAndSms;
    @Prop() autoCompleteDataType?: string;
    @Prop() hideComment?: boolean;
    autoCompleteData: AutoCompleteData[] = [];
    onRecipientRemoved(id: string){
        this.$emit("recipient-removed",id);
    }
    requestAddItem(){
        this.$emit("additem-requested");
    }
  

}
</script>

<style lang="less" scoped>
    #selection-area{
        display: flex;
        flex-wrap: wrap;
    }
</style>


