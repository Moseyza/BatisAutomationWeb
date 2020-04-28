<template >
    <div id="folders-container" class="container2">
        <div  id="menu" class="primary">
            <router-link tag="div" to= "ReceivedLetters" >نامه های دریافتی</router-link>
            <br>
            <router-link tag="div" to="SentLetters" >نامه های ارسالی</router-link>
            <br>
            <router-link tag="div" to="DraftLetters" >پیش نویس های ثبت شده</router-link>
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

    #folders-container{
        height: 100%;
    }
    
</style>

