<template>
    <div class="three-part-flexbox">
        <div class="container2 flex-part-top" style="flex: 0.5 0 0;">
            <LetterSearch @search-text-changed="onSearch($event)" style="margin:5px 0;"></LetterSearch>
            <!-- <LetterFilter></LetterFilter> -->
        </div>
        <div class="flex-part-middle">
            <div v-if="loading" class="ui active inline centered loader"></div>
            <div v-else>
                <div  id="letter-list">
                    <SingleLetter 
                    v-for="(letter,index) in filteredLetters"
                    :key="letter.letterNo"
                    :index="index"
                    :item="letter"
                    :letterData ="letter" @letterselected="onLetterSelected($event)"
                    ></SingleLetter>
                </div>
            </div>
        </div>
        <div style="display:flex; flex-direction:column; flex: 0.5 0 0;"  class="flex-part-bottom">
            <LetterTypeSelector  v-if="mode !== '' && mode !== undefined" :mode="mode" @letter-type-changed="onLetterTypeChanged($event)" style="align-items: stretch;"></LetterTypeSelector>
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
import LetterTypeSelector from './LetterTypeSelector/LetterTypeSelector.vue';

@Component({
    components:{SingleLetter, LetterFilter, LetterSearch,LetterTypeSelector}
})
export default class LetterList extends Vue{
    @Prop() lettersProp?: Letter[];
    @Prop() loading?: boolean;
    @Prop() mode?: string;

    currentLetterType = 'all';
    currentSearchText = '';
    letters: Letter[] = [];
    filter = (x: Letter) => {return true;};

    @Watch('lettersProp')
    onLettersPropChanged(newVal: Letter[],oldVal: Letter[]){
        this.letters.length = 0;
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

    onSearch(searchText: string){
        this.currentSearchText = searchText;
        this.onLetterTypeChanged(this.currentLetterType);
        const currentFilter = this.filter;
        this.filter = (letter) => currentFilter(letter) && this.FilterForSearch(letter);
    }

    FilterForSearch(letter: Letter): boolean{

        // this.currentSearchText.replace(/ي/g, "ی");
        // this.currentSearchText.replace(/ۍ/g, "ی");
        // this.currentSearchText.replace(/ێ/g, "ی");
        // this.currentSearchText.replace(/ۑ/g, "ی");
        // this.currentSearchText.replace(/ې/g, "ی");
        // this.currentSearchText.replace(/ك/g, "ک");
        // this.currentSearchText.replace(/ګ/g, "ک");
        // this.currentSearchText.replace(/ڬ/g, "ک");
        // this.currentSearchText.replace(/ڇ/g, "چ");

        return letter.letterNo.includes(this.currentSearchText) 
        || letter.title.includes(this.currentSearchText) 
        || letter.abstract.includes(this.currentSearchText) 
        || (letter.sender !== undefined && letter.sender !== null && letter.sender.name.includes(this.currentSearchText) )
        || (letter.recievers !== null && letter.recievers !== undefined && letter.recievers.filter(item=>item.name.includes(this.currentSearchText)).length>0)
        
    }

    get filteredLetters(){
        return this.letters.filter(this.filter)
    }

    onLetterTypeChanged(mode: string){
        this.currentLetterType = mode;
        if(mode === 'notRead'){
            this.filter = (letter) => !letter.isOpenned && this.FilterForSearch(letter);
            
        }
        else if(mode === 'notForwarded'){
            this.filter = (letter) => !letter.isForwarded && this.FilterForSearch(letter);
        }
        else if(mode === 'sent'){
            this.filter = (letter) => letter.isForwarded && this.FilterForSearch(letter);

        }
        else if(mode === 'notSent'){
            this.filter = (letter) => !letter.isForwarded && this.FilterForSearch(letter);
        }
        else if(mode === 'all'){
            this.filter = (letter) => true && this.FilterForSearch(letter);
        }
        

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



