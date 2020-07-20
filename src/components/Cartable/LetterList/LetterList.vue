<template>
    <div class="three-part-flexbox">
        <div class="container2 flex-part-top" style="flex: 0.5 0 0;">
            <LetterSearch 
            @mode-changed="onFilterModeChanged($event)" 
            @form-selection="onFormSelection($event)" 
            @search-text-changed="onSearch($event)"  
            @sort-mode-changed="onSortModeChanged($event)"
            @date-filter-changed="onDateFilterChanged($event)"
            :workflows="usedWorkFlows" 
            :counts="counts" :years="years" 
            :defaultDate="defaultDate" 
            style="margin:5px 0;" 
             >
            </LetterSearch>
            <!-- <LetterFilter></LetterFilter> -->
        </div>
        <div class="flex-part-middle">
            <div v-if="loading" class="ui active inline centered loader"></div>
            <div v-else>
                <div v-if="lettersProp && lettersProp.length >0"  id="letter-list">
                    <SingleLetter 
                    v-for="(letter,index) in filteredLetters"
                    :key="letter.letterPossessionId"
                    :index="index"
                    :letterData ="letter" @letterselected="onLetterSelected($event)"
                    :serverTime="serverTime"
                    :isDraft="mode==='drafts'"
                    ></SingleLetter>
                </div>
                <div v-if="searchResultsProp && searchResultsProp.length >0"  id="letter-list">
                    <SearchResultItem 
                    v-for="(letter,index) in filteredSearchResults"
                    :key="letter.possessionId"
                    :index="index"
                    :letterData ="letter" @letterselected="onLetterSelected($event)"
                    :serverTime="serverTime"
                    ></SearchResultItem>
                </div>
            </div>
        </div>
        <div style="display:flex; flex-direction:column; flex: 0 1 auto;"  class="flex-part-bottom">
            <LetterTypeSelector  v-if="mode !== '' && mode !== undefined" :mode="mode" @letter-type-changed="onLetterTypeChanged($event)" style="align-items: stretch;" :counts="counts" ref="typeSelector" ></LetterTypeSelector>
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
import * as workflowService from '@/store/Services/workflowService';
import { Workflow } from '../../../store/models/workflow/workflow';
import store from '@/store'
import { LetterSearchResult } from '../../../store/models/Letter/LetterSearchResult';
import SearchResultItem  from '@/components/Cartable/SearchResultList/SearchResultItem/SearchResultItem.vue';
import * as letterService from '@/store/Services/letterServices';

@Component({
    components:{SingleLetter,SearchResultItem, LetterFilter, LetterSearch,LetterTypeSelector}
})
export default class LetterList extends Vue{
    @Prop() lettersProp?: Letter[];
    @Prop() searchResultsProp?: LetterSearchResult[];
    @Prop() loading?: boolean;
    @Prop() mode?: string;
    @Prop() years?: number[];
    @Prop() defaultDate?: any;
    serverTime = '';
    currentLetterType = 'all';
    currentSearchText = '';
    letters: Letter[] = [];
    searchResults: LetterSearchResult[] = [];
    usedWorkFlows: Workflow[] = [];
    filteredFormIds: string[] = [];
    curretnFilterMode = 'all';
    counts = {all: 0,notRead: 0 , notForwarded: 0 , forms: 0 , notForms: 0 };
    filter = (x: Letter) => {return true;};
    searchResultsFilter = (x: LetterSearchResult) => {return true;};

    @Watch('letters')
    onLettersChanged(){
        this.setUsedEnterpriseForms();
        this.calcCounts();
        (this.$refs.typeSelector as any).selectAllMode();
    }

    @Watch('searchResults')
    onSearchResultsChanged(){
        this.setUsedEnterpriseForms();
        this.calcCounts();
    }

    calcCounts(){
        if(this.letters.length >0){
            const all =  this.letters.length;
            const notRead = this.letters.filter(l=>!l.isOpenned).length;
            const notForwarded = this.letters.filter(l=>!l.isForwarded).length;
            const forms = this.letters.filter(l=>l.isEnterpriseForm).length;
            const notForms = all - forms;
            const obj = {all: all,notRead: notRead , notForwarded: notForwarded , forms: forms , notForms: notForms };
            this.$emit('count-calcuted', obj)
            this.counts = obj;
        }
        else if(this.searchResults.length >0){
            const all =  this.searchResults.length;
            const notRead = this.searchResults.filter(l=>!l.isOpenned).length;
            const notForwarded = this.searchResults.filter(l=>!l.isForwarded).length;
            const forms = this.searchResults.filter(l=>l.isEnterpriseForm).length;
            const notForms = all - forms;
            const obj = {all: all,notRead: notRead , notForwarded: notForwarded , forms: forms , notForms: notForms };
            this.$emit('count-calcuted', obj)
            this.counts = obj;
        }
    }

    @Watch('lettersProp')
    onLettersPropChanged(newVal: Letter[],oldVal: Letter[]){
        this.letters.length = 0;
        this.letters.push(...newVal);
    }
    @Watch('searchResultsProp')
    onSearchResultsPropChanged(newVal: LetterSearchResult[],oldVal: LetterSearchResult[]){
        this.searchResults.length = 0;
        this.searchResults.push(...newVal);
    }

    onLetterSelected(id: string){
        let index = 0;
        const tempLetter: any = {};
        let selectedLetter: any = {};
        if(this.letters && this.letters.length > 0){
            this.letters.forEach((item,i)=>{
                item.isSelected = false;
                if(item.letterPossessionId === id){
                    index = i;
                    Object.assign(tempLetter,item);

                }
            });

            tempLetter.isSelected = true;
            this.$set(this.letters,index,tempLetter);
            selectedLetter =  this.letters.find(item=>item.letterPossessionId === id);
        }
        if(this.searchResultsProp && this.searchResultsProp.length >0){
            this.searchResultsProp.forEach((item,i)=>{
                item.isSelected = false;
                if(item.possessionId === id){
                    index = i;
                    Object.assign(tempLetter,item);
                    
                }
            });
    
            tempLetter.isSelected = true;
            this.$set(this.searchResultsProp,index,tempLetter);
            selectedLetter =  this.searchResultsProp.find(item=>item.possessionId === id);
        }
        this.$emit("selected-letter-changed",selectedLetter);
        
        
    }

    onSearch(searchText: string){
        this.currentSearchText = searchText;
        this.updateFilter();
    }

    onFormSelection(selection: any){
        if(selection.isSelected){
            this.filteredFormIds.push(selection.formId);
        }else{
            const index =  this.filteredFormIds.indexOf(selection.formId);
            if(index > -1){
                this.filteredFormIds.splice(index,1);
            }
        }
        this.onFilterModeChanged(this.curretnFilterMode);
    }

    FilterForSearch(letter: Letter): boolean{
        return letter.letterNo.includes(this.currentSearchText) 
        || this.replaceChars(letter.title).includes(this.currentSearchText) 
        || this.replaceChars(letter.abstract).includes(this.currentSearchText) 
        || (letter.sender !== undefined && letter.sender !== null && this.replaceChars(letter.sender.name).includes(this.currentSearchText) )
        || (letter.recievers !== null && letter.recievers !== undefined && letter.recievers.filter(item=>this.replaceChars(item.name).includes(this.currentSearchText)).length>0)
        
    }

    SearchResultsFilterForSearch(searchResult: LetterSearchResult): boolean{
        return searchResult.letterNo.includes(this.currentSearchText) 
        || this.replaceChars(searchResult.title).includes(this.currentSearchText) 
        || this.replaceChars(searchResult.abstract).includes(this.currentSearchText) 
        || (searchResult.from !== undefined && searchResult.from !== null && this.replaceChars(searchResult.from.name).includes(this.currentSearchText) )
        || (searchResult.to !== null && searchResult.to !== undefined && searchResult.to.filter(item=>this.replaceChars(item.name).includes(this.currentSearchText)).length>0)
    }

    filterForLetterState(letter: Letter): boolean {
        if(this.currentLetterType === 'notRead'){
            return  !letter.isOpenned;
            
        }
        else if(this.currentLetterType === 'notForwarded'){
            return  !letter.isForwarded;
        }
        else if(this.currentLetterType === 'sent'){
            return  letter.isForwarded;

        }
        else if(this.currentLetterType === 'notSent'){
            return   !letter.isForwarded;
        }
        else if(this.currentLetterType === 'all'){
            return  true;
        }
        
        return true;
        
    }

    filterForLetterType(letter: any): boolean {
          if(this.curretnFilterMode === 'forms'){
            if(this.filteredFormIds.length > 0){
                return letter.isEnterpriseForm && (this.filteredFormIds.indexOf(letter.enterpriseFormId) > -1) ;
            }
            else{
                return letter.isEnterpriseForm;
            }
            

        }else if(this.curretnFilterMode === 'notForms'){
            return !letter.isEnterpriseForm;
        }
        return true;
    }

    

    replaceChars(inputStr: string): string{
        
       inputStr = inputStr.replace(/ي/g, "ی");
       inputStr = inputStr.replace(/ۍ/g, "ی");
       inputStr = inputStr.replace(/ێ/g, "ی");
       inputStr = inputStr.replace(/ۑ/g, "ی");
       inputStr = inputStr.replace(/ې/g, "ی");
       inputStr = inputStr.replace(/ك/g, "ک");
       inputStr = inputStr.replace(/ګ/g, "ک");
       inputStr = inputStr.replace(/ڬ/g, "ک");
       inputStr = inputStr.replace(/ڇ/g, "چ");
        return inputStr;
    }

    refresh(){
       
        this.$forceUpdate();
    }

    get filteredLetters(){
        return  this.letters.filter(this.filter)
        
    }

    get filteredSearchResults(){
        return this.searchResults.filter(this.searchResultsFilter);
    }

    updateFilter(){
        this.filter = (letter) =>  this.FilterForSearch(letter) && this.filterForLetterState(letter) && this.filterForLetterType(letter);
        this.searchResultsFilter = (searchResult) => this.SearchResultsFilterForSearch(searchResult) && this.filterForLetterType(searchResult);
     }

   

    onLetterTypeChanged(mode: string){
        this.currentLetterType = mode;
        this.updateFilter();
        

    }

    onFilterModeChanged(mode: string){
        this.curretnFilterMode = mode;
        this.updateFilter();
    }

    async created(){
        if(store.state.workflows.length === 0)
        {
            const workflows =  await workflowService.getAllWorkflowsWithEnterpriseForms();
            store.commit("setWorkflows",workflows);
        }
        this.serverTime = await letterService.getServerTime();
        
    }

    setUsedEnterpriseForms(){
        const enterpriseForms =  this.letters.filter(letter=>letter.isEnterpriseForm);
        const distinctForms: Letter[] = [];
        enterpriseForms.forEach(form => {
            const item =  distinctForms.find(x=>x.enterpriseFormId === form.enterpriseFormId);
            if(item === undefined){
                distinctForms.push(form);
            }
        });
        this.usedWorkFlows.length = 0;
        const allWorkflows = store.state.workflows as Workflow[];
        distinctForms.forEach(letter=>{
            allWorkflows.forEach(wf=>{
                if(wf.enterpriseForms != null && wf.enterpriseForms != undefined){
                    const form = wf.enterpriseForms.find(ef=>ef.id === letter.enterpriseFormId);
                    if(form != undefined){
                        let usedWorkflow = this.usedWorkFlows.find(uwf=>uwf.id === wf.id);
                        if(usedWorkflow === undefined){
                            usedWorkflow = {id: wf.id , name: wf.name , enterpriseForms: []} as Workflow;
                            this.usedWorkFlows.push({id: wf.id , name: wf.name , enterpriseForms: []});
                        }
                        usedWorkflow = this.usedWorkFlows.find(uwf=>uwf.id === wf.id);
                            if(usedWorkflow != undefined){
                            if(usedWorkflow.enterpriseForms !== undefined && usedWorkflow.enterpriseForms !== null){
                                usedWorkflow.enterpriseForms.push(form);
                            }
                        }

                    }
                }
            });
        });
    }

    onDateFilterChanged(date: any){
        this.$emit('date-filter-changed',date);
    }

    onSortModeChanged(mode: string){
        if(mode === 'title') this.letters = this.letters.sort((l1,l2)=>l1.title.localeCompare(l2.title));
        if(mode === 'date') this.letters = this.letters.sort((l1,l2)=> (new Date(l2.sendTime).getTime() - (new Date(l1.sendTime)).getTime()));
        if(mode === 'sender') this.letters = this.letters.sort((l1,l2)=>{
            if(l1.sender === null || l1.sender === undefined) return 0;
            if(l2.sender === null || l2.sender === undefined) return 0;
            return l1.sender.name.localeCompare(l2.sender.name);
        });
    }

    closeLetter(possessionId: string){

        const letter =  this.letters.find(item=>item.letterPossessionId === possessionId);
        if(letter)
            this.letters[this.letters.indexOf(letter)].isClosed = true;
        else{
            const searchResult = this.searchResults.find(item=>item.possessionId === possessionId);
            if(searchResult)
                this.searchResults[this.searchResults.indexOf(searchResult)].isClosed = true;
                
        }
        
    }

     rejectCloseLetter(possessionId: string){

        const letter =  this.letters.find(item=>item.letterPossessionId === possessionId);
        if(letter)
            this.letters[this.letters.indexOf(letter)].isClosed = false;
        else{
            const searchResult = this.searchResults.find(item=>item.possessionId === possessionId);
            if(searchResult)
                this.searchResults[this.searchResults.indexOf(searchResult)].isClosed = false;
        }
        

    }

    forwardLetter(possessionId: string){
         const letter =  this.letters.find(item=>item.letterPossessionId === possessionId);
        if(letter)
            this.letters[this.letters.indexOf(letter)].isForwarded = true;
        else{
            const searchResult = this.searchResults.find(item=>item.possessionId === possessionId);
            if(searchResult)
                this.searchResults[this.searchResults.indexOf(searchResult)].isForwarded = true;
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



