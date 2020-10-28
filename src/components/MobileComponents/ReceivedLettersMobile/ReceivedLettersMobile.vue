<template>
    <div style="height:100%">
        <!-- <LetterList 
        :lettersProp="letters" 
        :years="years" 
        :mode="'received'" 
        :loading="loading" 
        @selected-letter-changed="onSelectedLetterChanged($event)" 
        :defaultDate="defaultDate" 
        @date-filter-changed="onDateFilterChanged($event)" 
        ref="letterList"
        :serverTime="serverTime"
        ></LetterList> -->
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator'
import LetterList from '@/components/Cartable/LetterList/LetterList.vue';
import {Letter} from '@/store/models/Letter/Letter'
import * as api from '@/store/api'
import * as persianDate from 'persian-date';
import * as letterService from '@/store/Services/letterServices';

@Component({
    components:{LetterList}
})
export default class ReceivedLettersMobile extends Vue {
    // letters?: Letter[] = [];
    // years?: number[] = [];
    // defaultDate: any = {};
    // loading = false;
    // serverTime = '';
    //  async created(){
    //      await this.refresh();
      
    // }
    // async refresh(){
    //     this.loading = true;
    //     const serverResult = await api.getReceivedLetters("","");
    //     this.serverTime = await letterService.getServerTime();
    //     this.loading = false;
    //     if(!serverResult.letterList) return;
    //     this.letters =  serverResult.letterList;
    //     this.years  =   api.getCartableYears(serverResult.from,serverResult.to);
    //     this.defaultDate = api.getDefaultDate(serverResult.to);
    //     const list =  this.$refs.letterList as any;
    //     if(list)
    //         list.resetTypeSelector();
    // }
    // onSelectedLetterChanged(letter: Letter){
    //     this.$emit('selected-letter-changed',letter);
    // }

    // async onDateFilterChanged(date: any){
    //     const startDate = new persianDate([date.year,date.month,1]);
    //     const endDate = startDate.add('month',1);
    //     this.loading = true
    //     const serverResult  = await api.getReceivedLetters(startDate.toDate().toString(),endDate.toDate().toString());
    //     if(!serverResult.letterList) return;
    //     this.letters = serverResult.letterList;
    //     this.loading = false;
    // }

    // closeLetter(possessionId: string)
    // {
    //     (this.$refs.letterList as any).closeLetter(possessionId);
    // }
    // rejectCloseLetter(possessionId: string)
    // {
    //     (this.$refs.letterList as any).rejectCloseLetter(possessionId);
    // }

    // forwardLetter(possessionId: string){
    //      (this.$refs.letterList as any).forwardLetter(possessionId);
    // }
    
}
</script>

<style scoped>

</style>


