<template>
    <div style="height:100%">
        <LetterList :searchResultsProp="searchResults"   :loading="loading" @selected-letter-changed="onSelectedLetterChanged($event)" :defaultDate="defaultDate" @date-filter-changed="onDateFilterChanged($event)" ></LetterList>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator'
import LetterList from '@/components/Cartable/LetterList/LetterList.vue';
import * as persianDate from 'persian-date';
import { LetterSearchResult } from '../../../store/models/Letter/LetterSearchResult';
import { Letter } from '@/store/models/Letter/Letter';
import * as letterService from '@/store/Services/letterServices';
import store from '@/store';
@Component({
    components:{LetterList}
})
export default class ReceivedLetters extends Vue {
    searchResults?: LetterSearchResult[] = [];
    years?: number[] = [];
    defaultDate: any = {};
    loading = false;
     async created(){
         await this.refresh();
    }
    async refresh(){
        this.loading = true;
        const searchDto =  store.state.advancedSearchSettings;
        const serverResult = await letterService.SearchAll(searchDto);
        this.loading = false;
        if(!serverResult) return;
        this.searchResults =  serverResult;
    }
    onSelectedLetterChanged(letter: Letter){
        this.$emit('selected-letter-changed',letter);
    }

    // async onDateFilterChanged(date: any){
    //     const startDate = new persianDate([date.year,date.month,1]);
    //     const endDate = startDate.add('month',1);
    //     this.loading = true
    //     const serverResult  = await api.getReceivedLetters(startDate.toDate(),endDate.toDate());
    //     if(!serverResult.letterList) return;
    //     // this.letters = serverResult.letterList;
    //     // this.loading = false;
    // }
}
</script>

<style scoped>

</style>


