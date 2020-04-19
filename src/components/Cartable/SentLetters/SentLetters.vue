<template>
    <div>
        <LetterList :lettersProp="letters" @selected-letter-changed="onSelectedLetterChanged($event)" ></LetterList>
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
    async created(){
        const serverResult = await api.getSentLetters(undefined,undefined);
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
