<template>
    <div>
        <LetterList :letters="letters"></LetterList>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator'
import LetterList from '@/components/Cartable/LetterList/LetterList.vue';
import Letter from '@/store/models/Letter/Letter'
import * as api from '@/store/api'
@Component({
    components:{LetterList}
})
export default class ReceivedLetters extends Vue {
    letters?: Letter[] = [];
    async created(){
         const serverResult = await api.getReceivedLetters();
        if(!serverResult.letterList) return;
        this.letters =  serverResult.letterList;
    }
}
</script>

<style scoped>

</style>


