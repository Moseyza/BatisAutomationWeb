<template>
    <div>
    <div  id="menu" class="primary">
        <router-link tag="div" to= "ReceivedLetters" >نامه های دریافتی</router-link>
        <br>
        <router-link tag="div" to="SentLetters" >نامه های ارسالی</router-link>
        <br>
        <router-link tag="div" to="DraftLetters" >پیش نویس های ثبت شده</router-link>
        <div class="test">This is test</div>
    </div>
    <div class="classdovom">This is another test</div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop} from 'vue-property-decorator'
import * as api from '@/store/api'

@Component
export default class FoldersTree extends Vue {
    
}
</script>

<style lang="less" scoped>

    .primary(@fontSize: 10pt){
        font-size: @fontSize;
    }
    #menu{
        color:red;
        .test{
            color:yellow;
        }
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

