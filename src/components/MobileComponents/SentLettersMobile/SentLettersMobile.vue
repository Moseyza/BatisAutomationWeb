<template>
    <div style="height:100%">
        <LetterListMobile 
        :lettersProp="letters" 
        :loading="loading" 
        @selected-letter-changed="onSelectedLetterChanged($event)" 
        :defaultDate="defaultDate" 
        @date-filter-changed="onDateFilterChanged($event)" 
        :years="years"
        ref="letterList"
        :serverTime="serverTime"
        :mode="''"
        
        ></LetterListMobile>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator'
import LetterListMobile from '@/components/MobileComponents/LetterListMobile/LetterListMobile.vue';
import {Letter} from '@/store/models/Letter/Letter'
import * as api from '@/store/api'
import * as letterService from '@/store/Services/letterServices';
import * as persianDate from 'persian-date';
@Component({
    components:{LetterListMobile}
})
export default class ReceivedLettersMobile extends Vue {
    letters?: Letter[] = [];
    loading = false;
    serverTime = '';
    years?: number[] = [];
    defaultDate: any = {};
    async created(){
        await this.refresh();
    }
    async refresh(){
        this.loading = true;
        const serverResult = await api.getSentLetters(undefined,undefined);
        this.serverTime = await letterService.getServerTime();
        this.years  =   api.getCartableYears(serverResult.from,serverResult.to);
        this.defaultDate = api.getDefaultDate(serverResult.to);
        this.loading = false;
        if(!serverResult.letterList) return;
        this.letters =  serverResult.letterList;
    }
    onSelectedLetterChanged(letter: Letter){
        this.$emit('selected-letter-changed',letter);
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
    async onDateFilterChanged(date: any){
        const startDate = new persianDate([date.year,date.month,1]);
        const endDate = startDate.add('month',1);
        this.loading = true
        const serverResult  = await api.getSentLetters(startDate.toDate(),endDate.toDate());
        if(!serverResult.letterList) return;
        this.letters = serverResult.letterList;
        this.loading = false;
    }
    
}
</script>

<style scoped>

</style>
