<template>
        <div id="recipient-dropdown"  class="ui icon top left dropdown recipients-dropdown">
            <div style="border-radius:5px" class="bg1 fc1 symmetric-grid">
                <div  style="flex:1">
                    <input   type="text"  v-model="searchText">
                </div>
                <div style="padding:5px">
                    <i class="icon-comboboxArrow"></i>
                </div>
                
                
            </div>
             
  		    <div class="left menu" style="max-height:300px;overflow:auto;">
    		    <div class="item menu-item"  v-for="recipient in filteredRecipients" :key="recipient.id" @click="selectRecipient(recipient)" ><div style="padding-left:5px">{{recipient.nameOnly}}</div>  <div v-if="recipient.post" style="padding-left:5px">{{recipient.post}}</div>  <div v-else style="padding-left:5px">{{recipient.letterOwnerCompanyNameOnly}}</div> </div> 
  		    </div>
	    </div>
</template>


<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { LetterOwnerWithFaxAndEmails } from '@/store/models/LetterOwner/LetterOwnerWithFaxAndEmails';
import * as $ from 'jquery';
import * as utils from '@/util/utils';
@Component
export default class RecipientLookupMobile extends Vue{
    @Prop() recipients?: LetterOwnerWithFaxAndEmails[];
    searchText = '';
    get filteredRecipients(){
        if(!this.recipients) return [];
        return this.recipients.filter(item=>utils.replaceChars(item.nameOnly).includes(this.searchText) || item.personnelCode.includes(this.searchText));
    }

    mounted(){
        $('.recipients-dropdown').dropdown({action: 'hide'});
    }

    selectRecipient(id: LetterOwnerWithFaxAndEmails){
        this.$emit('recipient-selected',id);
    }
}
</script>

<style lang="less" scoped>
input[type=text]{
    border: none;
    background-color: transparent;
    width: 100%;
    outline: none;
    color: inherit;
    padding:0 5px;
}
input[type=text]:focus{
    border: none;
}
#recipient-dropdown{
    width: 100%;
}
.menu{
    width: 100%;
}
</style>





