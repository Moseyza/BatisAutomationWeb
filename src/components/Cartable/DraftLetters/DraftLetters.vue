<template>
     <div style="height:100%">
        <LetterList :lettersProp="letters" :mode="'drafts'" :loading="loading" @selected-letter-changed="onSelectedLetterChanged($event)" ></LetterList>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop } from 'vue-property-decorator';
import LetterList from '@/components/Cartable/LetterList/LetterList.vue';
import {Letter} from '@/store/models/Letter/Letter'
import * as api from '@/store/api'
@Component({
    components:{LetterList}
})
export default class DraftLetters extends Vue {
    letters?: Letter[] = [];
    loading = false;
    async created(){
        this.loading = true;
        const draftLetters = await api.getDraftLetters(undefined,undefined);
        this.loading = false;
        if(!draftLetters) return;
        this.letters =  draftLetters;
    }
     onSelectedLetterChanged(letter: Letter){
        this.$emit('selected-letter-changed',letter);
    }
}

</script>





