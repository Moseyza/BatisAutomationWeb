<template>
    <div>
    <div  id="menu">
        <router-link to= "ReceivedLetters" >نامه های دریافتی</router-link>
        <br>
        <router-link to="SentLetters" >نامه های ارسالی</router-link>
        <br>
        <router-link to="DraftLetters" >پیش نویس های ثبت شده</router-link>
        <div class="test">This is test</div>
    </div>
    <div class="test"></div>
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
    #menu{
        color:red;
        .test{
            color:blue;
        }
    }
</style>

