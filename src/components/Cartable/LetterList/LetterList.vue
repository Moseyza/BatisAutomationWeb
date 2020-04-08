<template>
    <div id="letter-list">
        <SingleLetter 
        v-for="(letter,index) in letters"
        :key="letter.id"
        :index="index"
        :item="letter"
        :letterData ="letter" @letterselected="onLetterSelected($event)"
        ></SingleLetter>
    </div>
</template>

<script lang="ts">

import {Vue, Component, Prop, Watch} from 'vue-property-decorator'
import SingleLetter from './SingleLetter/SingleLetter.vue'
import * as api from '@/store/api'
import {Letter} from '@/store/models/Letter/Letter'
import { getNewGuid } from '@/util/utils';
@Component({
    components:{SingleLetter}
})
export default class LetterList extends Vue{
    @Prop() lettersProp?: Letter[];
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
    }

    // created(){
    //     if(this.lettersProp !== undefined){
    //         this.letters.push(...this.lettersProp);
    //     }
            
    // }
   
}

</script>

<style lang="less" scoped>
@import './../../../assets/styles/colors.less';
    #letter-list{
        overflow: auto;
        width:25%;
        background-color: @back-color2;
        height: 100%;
        
    }
</style>



