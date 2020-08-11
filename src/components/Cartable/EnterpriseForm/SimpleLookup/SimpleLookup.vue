<template>
    <div  class="ui icon top left dropdown tc-dropdown" style="width:100%">
        <div style="display:flex;background-color:white">
            <input v-if="isDropdownShown" @focus="onFocus()" @blur="onFocusOut()"  type="text" v-model="searchTxt" style="width:100%;border:none;" />
            <input v-else @focus="onFocus()"   type="text" v-model="selectedValue.item2" style="width:100%;border:none;" :style="{'background-color': color}" readonly />
            <div v-if="isDropdownShown"><i class="action-icon icon-comboboxArrow" style="font-size:small;margin-left:5px"></i></div>
            <!-- <div v-else :style="{'background-color': color}"><i class="action-icon icon-comboboxArrow" style="font-size:small;margin-left:5px"></i></div> -->
        </div>
        <div class="left menu" style="width:100%;background-color:#939393 !important" >
            <div style="max-height:200px !important;overflow:auto;width:100%">
                <div @click="selectValue(value)" v-for="(value) in filteredValues" 
                :key="value.item1" class="item menu-item" 
                :style="{'color':'black' ,'border':'1px solid black' , 'max-height':'30px','cursor':'pointer' }">
                    <div style="padding-left:5px;">{{value.item2}}</div>
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
    @Watch('valueProp')
    onValuePropChanged(){
        this.setValueFromProp();
    }

    selectedValue = {} as ValidValues;
    @Prop() validValues?: ValidValues[];

    @Watch("validValues")
    onValidValuesChanged(){
        this.selectedValue = {} as ValidValues;
    }

    get filteredValues(){
        if(!this.validValues)return [];
        return this.validValues.filter(v=>v.item2.includes(this.searchTxt));
    }
    searchTxt = '';
    created(){
        this.setValueFromProp();
    }
    onFocus(){
        this.searchTxt = '';
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
        //this.searchTxt = '';
    }

    setValueFromProp(){
        if(!this.validValues || !this.valueProp)return;
        const val =  this.validValues.find(item=>item.item2.trim() === (this.valueProp as string).trim() );
        if(val)
            this.selectedValue = val;
    }
}
</script>