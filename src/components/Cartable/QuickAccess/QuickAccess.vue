<template>
    <div class=" container2 symmetric-grid" style="justify-content:space-around">
        <i class="action-icon icon-letterFast" @click="fastSend()" style="font-size:32pt"></i>
        <div id="options-dropdown"  class="ui icon top left dropdown">
  		<i class="action-icon icon-form" style="font-size:17pt"></i>
  		<div class="menu">
    	<div class="item menu-item" @click="finalizeLetter()" ><div style="padding-left:5px">اختتام</div> <i class="fixed-icon icon-stamp"></i> </div>
    	<div class="item menu-item"><div style="padding-left:5px">چاپ</div> <i class="fixed-icon icon-print"></i></div>
    	<div class="item menu-item"><div style="padding-left:5px">جریان وابستگی</div> <i class="fixed-icon icon-tree"></i></div>
        <div class="item menu-item"><div style="padding-left:5px">مشاهده گزارش</div> <i class="fixed-icon icon-form1"></i></div>
  		</div>
	    </div>
    </div>
</template>

<script lang="ts">
import {Vue, Prop , Component} from 'vue-property-decorator';

@Component
export default class QuickAccess extends Vue{
    fastSend(){
        this.$emit('fast-send-clicked');
    }
}
</script>

<style lang="less" scoped>

</style>