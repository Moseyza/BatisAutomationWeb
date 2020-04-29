<template>
    <div id="main-container">
        <CartableTitle/>
        <div class="container3 height-fill-container" id="child-container"  style="">
            <div style="flex:1.5;">
                    <FoldersTree></FoldersTree>
            </div>
            <div class="conatiner2" style="flex:2.5;overflow:auto;">
                <router-view @selected-letter-changed="onSelectdLetterChanged($event)"></router-view>
            </div>
            <div class="container2" style="flex:6">
                <LetterDetails v-if="noLetterSelected == false" :letter="selectedLetter"></LetterDetails>
            </div>
            
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
    noLetterSelected = true;
    onSelectdLetterChanged(letter: Letter){
        this.noLetterSelected = false;
        const temp: any = {};
        Object.assign(temp,letter)
        this.selectedLetter = temp;
    }
}
</script>

<style lang="less" scoped>
#main-container{
    //display:flex;
    //flex-direction:column;
    //height:-webkit-fill-available;
}

#child-container{
    display: flex;
    flex-direction: row;
    max-height:-webkit-fill-available;
    //overflow:auto;
    //height:100%;
}

</style>


