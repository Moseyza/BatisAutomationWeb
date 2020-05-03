<template>
    <div style="height:100%">
        <LetterList :lettersProp="letters" :loading="loading" @selected-letter-changed="onSelectedLetterChanged($event)"></LetterList>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator'
import LetterList from '@/components/Cartable/LetterList/LetterList.vue';
import {Letter} from '@/store/models/Letter/Letter'
import * as api from '@/store/api'
@Component({
    components:{LetterList}
})
export default class ReceivedLetters extends Vue {
    letters?: Letter[] = [];
    loading = false;
    async created(){
        this.loading = true;
        const serverResult = await api.getReceivedLetters();
        this.loading = false;
        if(!serverResult.letterList) return;
        this.letters =  serverResult.letterList;
    }
    onSelectedLetterChanged(letter: Letter){
        this.$emit('selected-letter-changed',letter);
    }
}
</script>

<style scoped>

</style>


