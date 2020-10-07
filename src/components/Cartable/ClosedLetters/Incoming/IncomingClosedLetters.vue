<template>
     <div style="height:100%">
        <LetterList 
        :lettersProp="letters" 
        :loading="loading" 
        @selected-letter-changed="onSelectedLetterChanged($event)" 
        :serverTime="serverTime"
        :mode="'incomingClosed'" 
        @date-filter-changed="onDateFilterChanged($event)" 
        ref="letterList"
        :years="years" 
        :defaultDate="defaultDate" 
        ></LetterList>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop } from 'vue-property-decorator';
import LetterList from '@/components/Cartable/LetterList/LetterList.vue';
import {Letter} from '@/store/models/Letter/Letter'
import * as api from '@/store/api'
import * as letterService from '@/store/Services/letterServices';
import * as persianDate from 'persian-date';
@Component({
    components:{LetterList}
})
export default class IncomingClosedLetters extends Vue {
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
        const serverResult = await letterService.GetIncomingClosedLetters();
        this.serverTime = await letterService.getServerTime();
        this.loading = false;
        if(!serverResult.letterList) return;
        this.letters =  serverResult.letterList;
        this.years  =   api.getCartableYears(serverResult.from,serverResult.to);
        this.defaultDate = api.getDefaultDate(serverResult.to);
        const list =  this.$refs.letterList as any;
        if(list)
            list.resetTypeSelector();
    }
     onSelectedLetterChanged(letter: Letter){
        this.$emit('selected-letter-changed',letter);
    }
    async onDateFilterChanged(date: any){
        const startDate = new persianDate([date.year,date.month,1]);
        const endDate = startDate.add('month',1);
        this.loading = true
        const serverResult  = await letterService.GetIncomingClosedLetters(startDate.toDate(),endDate.toDate());
        if(!serverResult.letterList) return;
        this.letters = serverResult.letterList;
        this.loading = false;
    }
}

</script>


