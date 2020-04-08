<template>
    <div style="display:flex;flex-direction:column;height:-webkit-fill-available;">
        <SingleCartableOwner style="flex:0"></SingleCartableOwner>
        <FoldersTree style="flex:0"></FoldersTree>
        <router-view style="flex:1;max-height:-webkit-fill-available;overflow:auto;height:100%;"/>
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

