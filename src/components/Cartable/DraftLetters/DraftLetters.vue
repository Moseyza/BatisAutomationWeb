<template>
     <div style="height:100%">
        <LetterList :lettersProp="letters" 
        :mode="'drafts'" 
        :loading="loading" 
        @selected-letter-changed="onSelectedLetterChanged($event)" 
        ref="letterList" 
        :serverTime="serverTime">
        </LetterList>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop } from 'vue-property-decorator';
import LetterList from '@/components/Cartable/LetterList/LetterList.vue';
import * as api from '@/store/api'
import { DraftLetter } from '../../../store/models/Letter/DraftLetter';
import * as letterService from '@/store/Services/letterServices';
@Component({
    components:{LetterList}
})
export default class DraftLetters extends Vue {
    letters?: DraftLetter[] = [];
    loading = false;
    serverTime = '';
    async created(){
        await this.refresh();
    }
    async refresh(){
        this.loading = true;
        const draftLetters = await api.getDraftLetters(undefined,undefined);
        this.serverTime = await letterService.getServerTime();
        this.loading = false;
        if(!draftLetters) return;
        this.letters =  draftLetters;
        (this.$refs.letterList as any).resetTypeSelector();
    }
     onSelectedLetterChanged(letter: DraftLetter){
        this.$emit('selected-draft-changed',letter);
    }
}

</script>





