<template>
    <div id="search-container" class="symmetric-grid" >
        <input type="text" v-model="searchText">
        <div style="padding:3px 3px">
            <i id="search-icon"  class="icon-search"></i>
        </div>
        <!-- <div style="padding:3px 3px">
            <i id="search-icon"  class="icon-filter"></i>
        </div> -->
         <div style="padding:3px 3px" id="filter-dropdown" class="ui icon top left dropdown simple" >
              <i id="search-icon"  class="icon-filter action-icon icon-filter helper-icon-medium"></i>
  		        <div class="menu" >
    		        <div class="item menu-item"><div style="padding-left:5px">نامه های دریافتی</div> <ToggleSwitch /> </div>
    		        <div class="item menu-item"><div style="padding-left:5px">فرم های دریافتی</div> <ToggleSwitch /> </div>
    		        <div class="item menu-item"><div style="padding-left:5px">مرتب سازی بر اساس ماه</div> <ToggleSwitch /> </div>
                    <div class="item menu-item"><div style="padding-left:5px">نامه های حذف شده</div> <ToggleSwitch /> </div>
                    <div class="item menu-item"><div style="padding-left:5px">نامه های مختومه</div> 
                        <ToggleSwitch /> 
                        <i class="dropdown icon right"></i>
                        Publish To Web
                        <div class="left menu"  style="z-index: 300 !important">
                        <div class="item">Google Docs</div>
                        <div class="item">Google Drive</div>
                        <div class="item">Dropbox</div>
                        <div class="item">Adobe Creative Cloud</div>
                        <div class="item">Private FTP</div>
                        <div class="item">Another Service...</div>
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
@Component({
    components: {ToggleSwitch}
})
export default class LetterSearch extends Vue {
    searchText = '';
    @Watch('searchText')
    onSearchTextChanged(){
        this.$emit('search-text-changed',this.searchText);
    }

     mounted(){
          $('#filter-dropdown').dropdown({action: 'nothing'});
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
