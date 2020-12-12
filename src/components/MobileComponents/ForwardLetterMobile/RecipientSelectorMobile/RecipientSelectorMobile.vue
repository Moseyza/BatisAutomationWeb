<template>
    <div class="selection-area">
        <SingleSelectedRecipientMobile
        v-for="recipient in recipients"
        :key="recipient.id"
        :recipient="recipient"
        @recipient-removed="onRecipientRemoved($event)"
        @paraph="onParaph($event)"
        :autoCompleteDataType="autoCompleteDataType"
        />
        <button class="button" @click="requestAddItem()">+</button>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import SingleSelectedRecipientMobile from './SingleSelectedRecipientMobile/SingleSelectedRecipientMobile.vue';
import { LetterOwnerWithSendingInformationAndAttachments } from '@/store/models/LetterOwner/LetterOwnerWithSendingInformationAndAttachments';
import { AutoCompleteData } from '@/store/models/Letter/AutoCompleteData';

@Component({components: {SingleSelectedRecipientMobile}})
export default class RecipientSelectorMobile extends Vue{
    @Prop() recipients?: LetterOwnerWithSendingInformationAndAttachments;
    @Prop() autoCompleteDataType?: string;
    autoCompleteData: AutoCompleteData[] = [];
    onRecipientRemoved(id: string){
        this.$emit("recipient-removed",id);
    }
    onParaph(recipientId: string){
        this.$emit('paraph',recipientId);
    }
     requestAddItem(){
        this.$emit("additem-requested");
    }
  

}
</script>

<style lang="less" scoped>
    .selection-area{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
</style>


