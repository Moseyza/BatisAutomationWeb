<template>
    <div>
        <SingleCartableOwner></SingleCartableOwner>
        <router-view/>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop} from 'vue-property-decorator'
import * as api from '@/store/api'
import SingleCartableOwner from '@/components/Cartable/CartableOwner/SingleCartableOwner.vue'
import LetterList from '@/components/Cartable/LetterList/LetterList.vue'
@Component({
    components: {SingleCartableOwner, LetterList}
})
export default class MainWindow extends Vue {
    
}
</script>

