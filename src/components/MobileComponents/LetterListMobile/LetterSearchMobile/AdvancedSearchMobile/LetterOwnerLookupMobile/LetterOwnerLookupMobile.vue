<template>
    <div style="height:20px;">
        <div   style="display:flex">
            <input @focus="lostFocus"  type="text" placeholder="بدون تاثیر" v-model="searchText"/>
            <button  :id="'lo-ddBtn'+ index" @click="showDropDown"  style="width:20px;height:20px">
                <i style="font-size:6px" class="icon-comboboxArrow"></i>
            </button>
        </div>
    
        <div  :id="dynamicId"  style="flex:1" class="ui  dropdown">
  		    <div class="menu" style="max-height:300px;overflow:auto;">
    		    <div class="item menu-item"  v-for="letterOwner in filteredLetterOwners" :key="letterOwner.id" @click="selectLetterOwner(letterOwner)" >
                    <div style="padding-left:5px">{{letterOwner.nameOnly}}</div>
                    <div style="padding-left:5px">{{letterOwner.post}}</div>
                </div> 
  		    </div>
	    </div>
    </div>
</template>


<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import * as $ from 'jquery';
import * as utils from '@/util/utils';
import { LetterOwner } from '@/store/models/LetterOwner/LetterOwner';
import * as letterOwnerService from '@/store/Services/letterOwnerService';  
@Component
export default class LetterOwnerLookup extends Vue{
    @Prop() selectedValueProp?: string;
    @Watch('selectedValueProp') 
    onPreSelectedValueChanged(nval: string, oval: string){
            this.setPreselectedItem(nval);
    }
    @Prop() letterOwnersProp?: LetterOwner[];
    @Prop() index?: number;
    @Watch('letterOwnersProp')
    onLetterOwnesPropChanged(){
        if(this.letterOwnersProp){
            this.letterOwners = this.letterOwnersProp;
            if(this.selectedValueProp)
                this.setPreselectedItem(this.selectedValueProp);
        }
    }
    selectedLetterOwnerId = '';
    letterOwners = [] as LetterOwner[];
    searchText = '';
    canSeeAllLetters = false;

    @Watch('searchText')
    onSearchTextChanged(nVal: string, oVal: string){
        if(nVal === ''){
            this.selectedLetterOwnerId = '';
             this.$emit('letterowner-selected','');
        }
    }
    get filteredLetterOwners(){
        if(!this.letterOwners) return [];
        return this.letterOwners.filter(item=>utils.replaceChars(item.nameOnly).includes(this.searchText) || item.personnelCode.includes(this.searchText));
    }

    mounted(){
        $('#'+this.dynamicId).dropdown({action: 'hide'});
     
    }

    selectLetterOwner(letterOwner: LetterOwner){
        this.searchText = letterOwner.nameOnly;
        this.selectedLetterOwnerId = letterOwner.id;
        this.$emit('letterowner-selected',letterOwner.id);
    }
    async created(){
        if(this.letterOwnersProp){
            this.letterOwners = this.letterOwnersProp;
        }
        else{
            this.letterOwners = await letterOwnerService.getAllLetterOwners();
            this.letterOwners = this.letterOwners.sort((x,y)=> parseInt(x.personnelCode) - parseInt(y.personnelCode));
        }
    }
    showDropDown(){
        $("#"+this.dynamicId).click();
    }
    get dynamicId(){
        return 'letterowner-dropdown' + this.index;
    }
    lostFocus(){
        const selectedItem =  this.letterOwners.find(x=>x.id === this.selectedLetterOwnerId);
        if(selectedItem){
            this.searchText = selectedItem.nameOnly;
        }
        else
            this.searchText = '';
        this.$emit('letterowner-selected',this.selectedLetterOwnerId);
    }
    setPreselectedItem(itemId: string){
        
            const preselectedItem =  this.letterOwners.find(x=>x.id === itemId);
            if(preselectedItem){
                this.selectedLetterOwnerId = preselectedItem.id;
                this.searchText = preselectedItem.nameOnly;
            }
            else{
                this.selectedLetterOwnerId = "";
                this.searchText = '';
            }

        
    }
}
</script>

<style lang="less" scoped>
input[type=text]{
    border: none;
    //background-color: transparent;
    width: 100%;
    outline: none;
    color: black;
    padding:0 5px;
}
input[type=text]:focus{
    border: none;
}
#letterowner-dropdown{
    width: 100%;
}
.menu{
    width: 100%;
}
</style>





