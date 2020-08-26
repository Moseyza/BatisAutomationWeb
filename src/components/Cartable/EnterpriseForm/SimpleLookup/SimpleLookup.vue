<template>
    <div  class="ui icon top left dropdown tc-dropdown" style="width:100%">
        <div style="display:flex">
            <input v-if="isDropdownShown" @focus="onFocus()" @blur="onFocusOut()" @keydown="onSearch()" type="text" v-model="searchTxt" style="width:100%;border:none;" />
            <input v-else @focus="onFocus()"   type="text" v-model="selectedValue.item2" style="width:100%;border:none;display:absolute;font-size: inherit;font-size: inherit;" :style="{'background-color': color}" readonly />
            <div  v-if="isDropdownShown" style="position:absolute;left:0" ><i class="action-icon icon-comboboxArrow" style="font-size:small;margin-left:5px"></i></div>
            <!-- <div v-else :style="{'background-color': color}"><i class="action-icon icon-comboboxArrow" style="font-size:small;margin-left:5px"></i></div> -->
        </div>
        <div class="left menu" style="width:100%;background-color:#939393 !important" >
            <div style="max-height:200px !important;overflow:auto;width:100%">
                <div @click="selectValue(value)" v-for="(value) in filteredValues" 
                :key="value.item1" class="item menu-item" 
                :style="{'color':'black' ,'border':'1px solid black' , 'max-height':'30px','cursor':'pointer' }">
                    <div style="padding-left:5px;">{{value.item2.trim()}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator'
import { ValidValues, ValidValuesForSingleTable } from '@/store/models/EnterpriseForm/EnterpriseFormValidValues';
import * as $ from 'jquery';
@Component
export default class SimpleLookup extends Vue {
    isDropdownShown = false;
    @Prop() valueProp?: string;
    @Prop() color?: string;
    @Prop() allowUserEntry?: boolean;
    @Watch('valueProp')
    onValuePropChanged(){
        this.setValueFromProp();
    }
    selectedValue = {} as ValidValues;
    @Prop() validValues?: ValidValues[];
    filteredValues = [] as ValidValues[];
    searchTxt = '';
    @Watch("validValues")
    onValidValuesChanged(newVal: ValidValues[], oldVal: ValidValues[]){
        this.selectedValue = {} as ValidValues;
        if(this.validValues)
            this.filteredValues = this.validValues;
        if(this.valueProp)
            this.setValueFromProp();
    }
    onSearch(){
        if(!this.validValues)return;
        this.filteredValues = this.validValues.filter(v=>v.item2.includes(this.searchTxt));
        if(this.searchTxt === ''){
            this.selectedValue = {} as ValidValues;
            this.$emit('value-cleared');
        }
    }
    created(){
        this.setValueFromProp();
        if(this.validValues)
        this.filteredValues = this.validValues;   
    }
    onFocus(){
        this.searchTxt = '';
        if(this.validValues)
            this.filteredValues = this.validValues;
        $(".tc-dropdown").dropdown({action:'hide',onShow:this.onDropdownShow,onHide: this.onDropdownHide});
    }
    onDropdownShow(){
        this.isDropdownShown = true;
        if(this.selectedValue.item2)
            this.searchTxt = this.selectedValue.item2;
        return true;
    }
    onDropdownHide(){
        this.isDropdownShown = false;
        this.searchTxt = '';
        return true;
    }
    selectValue(value: ValidValues){
        this.selectedValue = value;
        this.$emit('value-selected',value);
    }
    onFocusOut(){
        if(this.allowUserEntry){
            const val  = {} as ValidValues;
            val.item2 = this.searchTxt;
            val.item1 = this.searchTxt;
            this.$emit('value-selected',val)
            this.selectedValue = val;
            return;
        }
        this.searchTxt = '';
        this.isDropdownShown = false;
    }
    setValueFromProp(){
        if(!this.validValues || !this.valueProp)return;
        const val =  this.validValues.find(item=>item.item2.trim() === (this.valueProp as string).trim() );
        if(val)
            this.selectedValue = val;
    }
}
</script>