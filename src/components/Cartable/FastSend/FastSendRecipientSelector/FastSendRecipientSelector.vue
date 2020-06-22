<template>
    <div id="selection-area">
        <FastSendSelectedRecipient
        v-for="recipient in recipients"
        :key="recipient.id"
        :recipient="recipient"
        @recipient-removed="onRecipientRemoved($event)"
        :autoCompleteDataType="autoCompleteDataType"
        />
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { AutoCompleteData } from '@/store/models/Letter/AutoCompleteData';
import FastSendSelectedRecipient from './FastSendSelectedRecipient/FastSendSelectedRecipient.vue';
import { LetterOwnerForSendingFaxAndEmailAndSms } from '../../../../store/models/LetterOwner/LetterOwnerForSendingFaxAndEmailAndSms';

@Component({
    name:"FastSendRecipientSelector",
    components: {FastSendSelectedRecipient}
})
export default class FastSendRecipientSelector extends Vue{
    @Prop() recipients?: LetterOwnerForSendingFaxAndEmailAndSms;
    @Prop() autoCompleteDataType?: string;
    autoCompleteData: AutoCompleteData[] = [];
    onRecipientRemoved(id: string){
        this.$emit("recipient-removed",id);
    }
    
  

}
</script>

<style lang="less" scoped>
    #selection-area{
        display: flex;
        flex-wrap: wrap;
    }
</style>


