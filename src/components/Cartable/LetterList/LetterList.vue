<template>
    <div>
        <SingleLetter 
        v-for="letter in letters"
        :key="letter.id"
        :letterData ="letter"
        ></SingleLetter>
    </div>
</template>

<script lang="ts">

import {Vue, Component, Prop} from 'vue-property-decorator'
import SingleLetter from './SingleLetter/SingleLetter.vue'
import * as api from '@/store/api'
import Letter from '@/store/models/Letter/Letter'

@Component({
    components:{SingleLetter}
})
export default class LetterList extends Vue{
    @Prop() letters?: Letter[];
    // get mutableLetters() {
    //     const temp: Letter[] = [];
    //     if(this.letters !== undefined){
    //         temp.push(...this.letters);
    //     }
    //     return temp;
    // }
}

</script>

<style scoped>

</style>


