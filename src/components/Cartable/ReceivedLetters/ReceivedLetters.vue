<template>
    <div style="height:100%">
        <LetterList 
        :lettersProp="letters" 
        :years="years" 
        :mode="'received'" 
        :loading="loading" 
        @selected-letter-changed="onSelectedLetterChanged($event)" 
        :defaultDate="defaultDate" 
        @date-filter-changed="onDateFilterChanged($event)" 
        ref="letterList"
        ></LetterList>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator'
import LetterList from '@/components/Cartable/LetterList/LetterList.vue';
import {Letter} from '@/store/models/Letter/Letter'
import * as api from '@/store/api'
import * as persianDate from 'persian-date';
@Component({
    components:{LetterList}
})
export default class ReceivedLetters extends Vue {
    letters?: Letter[] = [];
    years?: number[] = [];
    defaultDate: any = {};
    loading = false;
     async created(){
         await this.refresh();
      
    }
    async refresh(){
        this.loading = true;
        const serverResult = await api.getReceivedLetters();
        this.loading = false;
        if(!serverResult.letterList) return;
        this.letters =  serverResult.letterList;
        this.years  =   api.getCartableYears(serverResult.from,serverResult.to);
        this.defaultDate = api.getDefaultDate(serverResult.to);
    }
    onSelectedLetterChanged(letter: Letter){
        this.$emit('selected-letter-changed',letter);
    }

    async onDateFilterChanged(date: any){
        const startDate = new persianDate([date.year,date.month,1]);
        const endDate = startDate.add('month',1);
        this.loading = true
        const serverResult  = await api.getReceivedLetters(startDate.toDate(),endDate.toDate());
        if(!serverResult.letterList) return;
        this.letters = serverResult.letterList;
        this.loading = false;
    }

    closeLetter(possessionId: string)
    {
        (this.$refs.letterList as any).closeLetter(possessionId);
    }
    rejectCloseLetter(possessionId: string)
    {
        (this.$refs.letterList as any).rejectCloseLetter(possessionId);
    }

    forwardLetter(possessionId: string){
         (this.$refs.letterList as any).forwardLetter(possessionId);
    }
    
}
</script>

<style scoped>

</style>


