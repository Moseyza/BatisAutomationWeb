<template>
     <div style="height:100%">
        <LetterList :lettersProp="letters" 
        :mode="'drafts'" 
        :loading="loading" 
        @selected-letter-changed="onSelectedLetterChanged($event)" 
        ref="letterList" 
        :serverTime="serverTime"
        :years="years" 
        :defaultDate="defaultDate" 
        @date-filter-changed="onDateFilterChanged($event)" 

        >
        </LetterList>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop } from 'vue-property-decorator';
import LetterList from '@/components/Cartable/LetterList/LetterList.vue';
import * as api from '@/store/api'
import { DraftLetter } from '../../../store/models/Letter/DraftLetter';
import * as letterService from '@/store/Services/letterServices';
import * as persianDate from 'persian-date';
import { Letter } from '@/store/models/Letter/Letter';
@Component({
    components:{LetterList}
})
export default class DraftLetters extends Vue {
    letters?: Letter[] = [];//DraftLetter[] = [];
    loading = false;
    serverTime = '';
    years?: number[] = [];
    defaultDate: any = {};
    async created(){
        await this.refresh();
    }
    async refresh(){
        this.loading = true;
        const draftLetters = await api.getDraftLetters(undefined,undefined);
        this.serverTime = await letterService.getServerTime();
        this.loading = false;
        if(!draftLetters) return;
        if(!draftLetters.letterList) return;
        this.letters =  draftLetters.letterList ;
        this.years  =   api.getCartableYears(draftLetters.from,draftLetters.to);
        this.defaultDate = api.getDefaultDate(draftLetters.to);
        (this.$refs.letterList as any).resetTypeSelector();
    }
     onSelectedLetterChanged(letter: DraftLetter){
        this.$emit('selected-draft-changed',letter);
    }

    async onDateFilterChanged(date: any){
        const startDate = new persianDate([date.year,date.month,1]);
        const endDate = startDate.add('month',1);
        this.loading = true
        const serverResult  = await api.getDraftLetters(startDate.toDate(),endDate.toDate());
        if(!serverResult.letterList) return;
        this.letters = serverResult.letterList;
        this.loading = false;
    }
}

</script>





