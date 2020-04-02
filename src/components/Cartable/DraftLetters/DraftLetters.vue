<template>
     <div>
        <LetterList :letters="letters"></LetterList>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop } from 'vue-property-decorator';
import LetterList from '@/components/Cartable/LetterList/LetterList.vue';
import Letter from '@/store/models/Letter/Letter'
import * as api from '@/store/api'
@Component({
    components:{LetterList}
})
export default class DraftLetters extends Vue {
    letters?: Letter[] = [];
    async created(){
         const draftLetters = await api.getDraftLetters(undefined,undefined);
        if(!draftLetters) return;
        this.letters =  draftLetters;
    }
}

</script>





