<template>
    <div>
        <router-link to= "ReceivedLetters" >نامه های دریافتی</router-link>
        <br>
        <router-link to="SentLetters" >نامه های ارسالی</router-link>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop} from 'vue-property-decorator'
import * as api from '@/store/api'

@Component
export default class FoldersTree extends Vue {
    
}
</script>

