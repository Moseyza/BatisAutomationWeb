<template>
    <div id="search-container" class="symmetric-grid" >
        <input type="text" v-model="searchText">
        <div style="padding:3px 3px">
            <i id="search-icon"  class="icon-search"></i>
        </div>
         <div style="padding:3px 3px" id="filter-dropdown" class="ui icon top left dropdown simple" >
              <i id="search-icon"  class="icon-filter action-icon icon-filter helper-icon-medium"></i>
  		        <div class="menu" >
    		        <div class="item menu-item"><div style="padding-left:5px">همه</div> <ToggleSwitch :checkedProp="showAll" @click="onToggleSwitchClick('all')" :isReadOnly="true" /> </div>
    		        <div class="item menu-item"><div style="padding-left:5px">غیر فرم سازمانی</div> <ToggleSwitch :checkedProp="showNotForms" @click="onToggleSwitchClick('notForms')" :isReadOnly="true" /> </div>
    		        <div class="item menu-item"><div style="padding-left:5px">فرمهای سازمانی</div> <ToggleSwitch :checkedProp="showForms" @click="onToggleSwitchClick('forms')" :isReadOnly="true" /> 
                        <div class="left menu" >
                                <div v-for="wf in workflows" :key="wf.id" class="item menu-item" :class="{'disabled': !showForms}">
                                    <div style="padding-left:5px">{{wf.name}}</div> 
                                    <div class="left menu" >
                                        <div class="item menu-item" >test</div>
                                    </div>
                                </div>
  		                </div>
                    </div>
  		        </div>
	    </div>
        
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import ToggleSwitch from '@/components/UiComponents/ToggleSwitch.vue';
import * as $ from 'jquery';
import { Workflow } from '../../../../store/models/workflow/workflow';

@Component({
    components: {ToggleSwitch}
})
export default class LetterSearch extends Vue {
    searchText = '';
    showAll = true;
    showForms = false;
    showNotForms = false;
    @Watch('searchText')
    onSearchTextChanged(){
        this.$emit('search-text-changed',this.searchText);
    }

    mounted(){
        $('#filter-dropdown').dropdown({action: 'nothing'});
    }

    @Prop() workflows?: Workflow[];

    // @Watch('workflows')
    // onWorkflowsChanged(){
    //     console.log("**************************");
    //     console.log(this.workflows);
    //     console.log("**************************");
    // }
    onToggleSwitchClick(mode: string){
            if(mode === 'all'){
                this.showAll = true;
                this.showForms = false;
                this.showNotForms = false;

            }
            else if(mode === 'forms'){
                this.showAll = false;
                this.showForms = true;
                this.showNotForms = false;

            }else if(mode === 'notForms'){
                this.showAll = false;
                this.showForms = false;
                this.showNotForms = true;
            }
    }
}
</script>

<style lang="less" scoped>
input{
    background-color: #575757;
    color: #e7e7e7;
    width: 100%;
    border: none;
    font-size: small;
    padding: 3px 3px;
}
input:focus{
    outline: none;
}
#search-icon{
    font-size:medium;
    color: #e7e7e7;

}

#search-container{
    background-color:#575757
}




</style>
