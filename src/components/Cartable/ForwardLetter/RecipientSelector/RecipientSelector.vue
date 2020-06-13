<template>
    <div id="selection-area">
        <SingleSelectedRecipient
        v-for="recipient in recipients"
        :key="recipient.id"
        :recipient="recipient"
        @recipient-removed="onRecipientRemoved($event)"
        @paraph="onParaph($event)"
        :autoCompleteData="autoCompleteData"
        />
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import SingleSelectedRecipient from './SingleSelectedRecipient/SingleSelectedRecipient.vue';
import { LetterOwnerWithSendingInformationAndAttachments } from '@/store/models/LetterOwner/LetterOwnerWithSendingInformationAndAttachments';
import { AutoCompleteData } from '@/store/models/Letter/AutoCompleteData';
import * as autoCompleteDataService from '@/store/Services/autoCompleteDataService.ts';
@Component({components: {SingleSelectedRecipient}})
export default class RecipientSelector extends Vue{
    @Prop() recipients?: LetterOwnerWithSendingInformationAndAttachments;
    autoCompleteData: AutoCompleteData[] = [];
    onRecipientRemoved(id: string){
        this.$emit("recipient-removed",id);
    }
    onParaph(recipientId: string){
        this.$emit('paraph',recipientId);
    }
    async mounted(){
         this.autoCompleteData =  await autoCompleteDataService.getForwardingAutoCompleteData();
    }
}
</script>

<style lang="less" scoped>
    #selection-area{
        display: flex;
        flex-wrap: wrap;
    }
</style>


