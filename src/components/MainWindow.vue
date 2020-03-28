<template>
    <div>
        <SingleCartableOwner></SingleCartableOwner>
        <FoldersTree></FoldersTree>
        <router-view/>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop} from 'vue-property-decorator'
import * as api from '@/store/api'
import SingleCartableOwner from '@/components/Cartable/CartableOwner/SingleCartableOwner.vue'
import FoldersTree from '@/components/Cartable/FoldersTree/FoldersTree.vue'
@Component({
    components: {SingleCartableOwner, FoldersTree}
})
export default class MainWindow extends Vue {
    
}
</script>

