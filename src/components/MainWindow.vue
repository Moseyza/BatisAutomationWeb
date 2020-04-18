<template>
    <div style="display:flex;flex-direction:column;height:-webkit-fill-available;">
        <!-- <SingleCartableOwner style="flex:0"></SingleCartableOwner> -->
        <CartableTitle/>
        <FoldersTree style="flex:0"></FoldersTree>
        <div style="flex:1;max-height:-webkit-fill-available;overflow:auto;height:100%;">
            <router-view @selected-letter-changed="onSelectdLetterChanged($event)"></router-view>
            <LetterDetails :letter="selectedLetter"></LetterDetails>
            
        </div>
        
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop} from 'vue-property-decorator';
import * as api from '@/store/api';
import SingleCartableOwner from '@/components/Cartable/CartableOwner/SingleCartableOwner.vue';
import CartableTitle from '@/components/Cartable/CartableTitle/CartableTitle.vue';
import FoldersTree from '@/components/Cartable/FoldersTree/FoldersTree.vue';
import LetterDetails from '@/components/Cartable/LetterDetails/LetterDetails.vue';
import { Letter } from '@/store/models/Letter/Letter';
@Component({
    components: { FoldersTree, LetterDetails, CartableTitle}
})
export default class MainWindow extends Vue {
    selectedLetter?: Letter = {} as Letter;
    letterTitle1 = '';
    onSelectdLetterChanged(letter: Letter){
        const temp: any = {};
        Object.assign(temp,letter)
        this.selectedLetter = temp;
    }
}
</script>

