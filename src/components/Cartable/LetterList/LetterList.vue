<template>
    <div class="three-part-flexbox">
        <div class="flex-part-top">
            <LetterSearch style="margin:5px 0;"></LetterSearch>
            <LetterFilter></LetterFilter>
        </div>
        <!-- <div class="container2" style="margin:5px 0;">
            <LetterSearch style="margin:5px 0;"></LetterSearch>
            <LetterFilter></LetterFilter>
        </div> -->
        <div class="flex-part-middle">
            <div v-if="loading" class="ui active inline centered loader"></div>
            <div v-else>
                <div  id="letter-list">
                    <SingleLetter 
                    v-for="(letter,index) in letters"
                    :key="letter.id"
                    :index="index"
                    :item="letter"
                    :letterData ="letter" @letterselected="onLetterSelected($event)"
                    ></SingleLetter>
                </div>
            </div>
        </div>
        <div  class="flex-part-bottom">

        </div>
        
    </div>
</template>

<script lang="ts">

import {Vue, Component, Prop, Watch} from 'vue-property-decorator'
import SingleLetter from './SingleLetter/SingleLetter.vue'
import * as api from '@/store/api'
import {Letter} from '@/store/models/Letter/Letter'
import { getNewGuid } from '@/util/utils';
import LetterFilter from './LetterFilter/LetterFilter.vue';
import LetterSearch from './LetterSearch/LetterSearch.vue';
@Component({
    components:{SingleLetter, LetterFilter, LetterSearch}
})
export default class LetterList extends Vue{
    @Prop() lettersProp?: Letter[];
    @Prop() loading?: boolean;

    letters: Letter[] = [];
    @Watch('lettersProp')
    onLettersPropChanged(newVal: Letter[],oldVal: Letter[]){
        this.letters.push(...newVal);
    }
    onLetterSelected(id: string){
        let index = 0;
        const tempLetter: any = {};
        this.letters.forEach((item,i)=>{
            item.isSelected = false;
            if(item.id === id){
                index = i;
                Object.assign(tempLetter,item);
                
            }
        });
        tempLetter.isSelected = true;
        this.$set(this.letters,index,tempLetter);
        const selectedLetter =  this.letters.find(item=>item.id === id);
        this.$emit("selected-letter-changed",selectedLetter);
    }

   
}

</script>

<style lang="less" scoped>
@import './../../../assets/styles/colors.less';
    #letter-list{
        //overflow: auto;
        width:100%;
        background-color: @back-color2;
        height: 100%;
        
    }
</style>



