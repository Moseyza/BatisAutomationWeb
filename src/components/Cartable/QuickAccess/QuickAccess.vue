<template>
    <div class=" container2 symmetric-grid" style="justify-content:space-around">
        <div class="popup"  data-content="ارسال پیشنویس" > <i class="action-icon icon-allDraft" @click="fastSend('draft')" style="font-size:22pt"></i></div>
        <div class="popup"  data-content="ارسال سریع"><i  class="action-icon icon-SendLetterFast" @click="fastSend('send')" style="font-size:30pt"></i></div>
        <div id="forms-dropdown"  class="ui icon top left dropdown" data-content="فرم های اداری">
  		<i class="action-icon icon-enterpriseForm " style="font-size:17pt"></i>
  		<div class="menu">
    	<div class="item menu-item" @click="finalizeLetter()" ><div style="padding-left:5px">اختتام</div> <i class="fixed-icon icon-stamp"></i> </div>
    	<div class="item menu-item"><div style="padding-left:5px">چاپ</div> <i class="fixed-icon icon-print"></i></div>
    	<div class="item menu-item"><div style="padding-left:5px">جریان وابستگی</div> <i class="fixed-icon icon-tree" ></i></div>
        <div class="item menu-item"><div style="padding-left:5px">مشاهده گزارش</div> <i class="fixed-icon icon-form1"></i></div>
  		</div>
	    </div>
    </div>
</template>

<script lang="ts">
import {Vue, Prop , Component} from 'vue-property-decorator';
import * as $ from 'jquery';
@Component
export default class QuickAccess extends Vue{
    fastSend(mode: string){
        this.$emit('fast-send-clicked',mode);
    }
    
    mounted(){
        $('.popup').popup();
        $('#forms-dropdown').dropdown().popup();
    }
}
</script>

<style lang="less" scoped>

</style>