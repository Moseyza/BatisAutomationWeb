<template>
    <div style="height:20px;">
        <div  style="display:flex">
            <input   type="text"  v-model="searchText"/>
            <button @click="showDropDown"  style="width:18px;height:18px">
                <i style="font-size:6px" class="icon-comboboxArrow"></i>
            </button>
        </div>
    
        <div  id="letterowner-dropdown"  style="flex:1" class="ui  dropdown">
  		    <div class="left menu" style="max-height:300px;overflow:auto;">
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
    @Prop() letterOwnersProp?: LetterOwner[];
    @Watch('letterOwnersProp')
    onLetterOwnesPropChanged(){
        if(this.letterOwnersProp)
            this.letterOwners = this.letterOwnersProp;
    }
    letterOwners = [] as LetterOwner[];
    searchText = '';
    get filteredLetterOwners(){
        if(!this.letterOwners) return [];
        return this.letterOwners.filter(item=>utils.replaceChars(item.nameOnly).includes(this.searchText) || item.personnelCode.includes(this.searchText));
    }

    mounted(){
        $('#letterowner-dropdown').dropdown({action: 'hide'});
    }

    selectLetterOwner(letterOwner: LetterOwner){
        this.searchText = letterOwner.nameOnly;
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
        $("#letterowner-dropdown").click();
    }
}
</script>

<style lang="less" scoped>
input[type=text]{
    //border: none;
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





