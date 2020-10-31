<template>
    <div id="filter-box">
       
         <div id="filter-dropdown" class="ui icon top left dropdown simple">
              <i class="action-icon icon-filter helper-icon-medium"></i>
  		        <div class="menu">
    		        <div class="item menu-item"><div style="padding-left:5px">نامه های دریافتی</div> <ToggleSwitch /> </div>
    		        <div class="item menu-item"><div style="padding-left:5px">فرم های دریافتی</div> <ToggleSwitch /> </div>
    		        <div class="item menu-item"><div style="padding-left:5px">مرتب سازی بر اساس ماه</div> <ToggleSwitch /> </div>
                    <div class="item menu-item"><div style="padding-left:5px">نامه های حذف شده</div> <ToggleSwitch /> </div>
                    <div class="item menu-item"><div style="padding-left:5px">نامه های مختومه</div> <ToggleSwitch /> </div>
  		        </div>
	    </div>
    </div>
</template>

<script lang="ts">
import {Vue, Prop, Component} from 'vue-property-decorator';
import * as $ from 'jquery';
import ToggleSwitch from '@/components/UiComponents/ToggleSwitch.vue';
@Component({
    components: {ToggleSwitch}
})
export default class LetterFilter extends Vue {

    mounted(){
        $('#filter-dropdown').dropdown({action: 'nothing'});
    }
}
</script>

<style lang="less" scoped>
#filter-box{
    text-align: center;
}
</style>


