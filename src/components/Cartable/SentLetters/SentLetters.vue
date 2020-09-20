<template>
    <div style="height:100%">
        <LetterList 
        :lettersProp="letters" 
        :loading="loading" 
        @selected-letter-changed="onSelectedLetterChanged($event)" 
        ref="letterList"
        :serverTime="serverTime"
        ></LetterList>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator'
import LetterList from '@/components/Cartable/LetterList/LetterList.vue';
import {Letter} from '@/store/models/Letter/Letter'
import * as api from '@/store/api'
import * as letterService from '@/store/Services/letterServices';
@Component({
    components:{LetterList}
})
export default class ReceivedLetters extends Vue {
    letters?: Letter[] = [];
    loading = false;
    serverTime = '';
    async created(){
        await this.refresh();
    }
    async refresh(){
        this.loading = true;
        const serverResult = await api.getSentLetters(undefined,undefined);
        this.serverTime = await letterService.getServerTime();
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
    
}
</script>

<style scoped>

</style>
