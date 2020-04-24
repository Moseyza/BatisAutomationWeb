<template >
    <div class="container3">
    <div  id="menu" class="primary">
        <router-link tag="div" to= "ReceivedLetters" >نامه های دریافتی</router-link>
        <br>
        <router-link tag="div" to="SentLetters" >نامه های ارسالی</router-link>
        <br>
        <router-link tag="div" to="DraftLetters" >پیش نویس های ثبت شده</router-link>
    </div>
    <div style="margin: 100px" class="ui selection dropdown">
  	    <input type="hidden" name="gender">
  	    <i class="dropdown icon"></i>
  	    <div class="default text">Gender</div>
  	    <div class="menu">
            <div class="item" data-value="1">Male</div>
            <div class="item" data-value="0">Female</div>
  	    </div>
	</div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop} from 'vue-property-decorator';
import * as api from '@/store/api';
import * as $ from 'jquery';
@Component
export default class FoldersTree extends Vue {
    
    mounted(){
        $(".dropdown").dropdown();
    }
}
</script>

<style lang="less" scoped>

    .primary(@fontSize: 10pt){
        font-size: @fontSize;
    }
    

    .classaval{
        border: 5px green solid;
        margin: 50px;
    }
@var: #004590;
    .classdovom{
        .classaval;
        background-color: sandybrown;
        .primary(20pt);
        
  &:hover{
    background-color: fadeout(red, 50%)
  }
       
    }
</style>

