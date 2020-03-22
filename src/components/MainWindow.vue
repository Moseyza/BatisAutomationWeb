<template>
    <SingleCartableOwner></SingleCartableOwner>
</template>

<script lang="ts">
import { Vue, Component, Prop} from 'vue-property-decorator'
import * as api from '@/store/api'
import SingleCartableOwner from '@/components/Cartable/CartableOwner/SingleCartableOwner.vue'

@Component({
    components: {SingleCartableOwner}
})
export default class MainWindow extends Vue {
    
}
</script>

