<template>
    <div class="three-part-flexbox">
        <div class="container2 flex-part-top" style="flex: 0.5 0 0;">
            <LetterSearch @mode-changed="onFilterModeChanged($event)" @form-selection="onFormSelection($event)" @search-text-changed="onSearch($event)" style="margin:5px 0;" :workflows="usedWorkFlows" :counts="counts" ></LetterSearch>
            <!-- <LetterFilter></LetterFilter> -->
        </div>
        <div class="flex-part-middle">
            <div v-if="loading" class="ui active inline centered loader"></div>
            <div v-else>
                <div  id="letter-list">
                    <SingleLetter 
                    v-for="(letter,index) in filteredLetters"
                    :key="letter.id"
                    :index="index"
                    :letterData ="letter" @letterselected="onLetterSelected($event)"
                    ></SingleLetter>
                </div>
            </div>
        </div>
        <div style="display:flex; flex-direction:column; flex: 0.5 0 0;"  class="flex-part-bottom">
            <LetterTypeSelector  v-if="mode !== '' && mode !== undefined" :mode="mode" @letter-type-changed="onLetterTypeChanged($event)" style="align-items: stretch;" :counts="counts" ></LetterTypeSelector>
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
import { Workflow, EnterpriseForm } from '../../../store/models/workflow/workflow';
import store from '@/store'

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
    usedWorkFlows: Workflow[] = [];
    filteredFormIds: string[] = [];
    curretnFilterMode = 'all';
    counts = {all: 0,notRead: 0 , notForwarded: 0 , forms: 0 , notForms: 0 };
    filter = (x: Letter) => {return true;};

    @Watch('letters')
    onLettersChanged(){
        this.setUsedEnterpriseForms();
        this.calcCounts();
    }

    calcCounts(){
        const all =  this.letters.length;
        const notRead = this.letters.filter(l=>!l.isOpenned).length;
        const notForwarded = this.letters.filter(l=>!l.isForwarded).length;
        const forms = this.letters.filter(l=>l.isEnterpriseForm).length;
        const notForms = all - forms;
        const obj = {all: all,notRead: notRead , notForwarded: notForwarded , forms: forms , notForms: notForms };
        this.$emit('count-calcuted', obj)
        this.counts = obj;
    }

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

    filterForLetterType(letter: Letter): boolean {
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

    updateFilter(){
        this.filter = (letter) =>  this.FilterForSearch(letter) && this.filterForLetterState(letter) && this.filterForLetterType(letter);
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



