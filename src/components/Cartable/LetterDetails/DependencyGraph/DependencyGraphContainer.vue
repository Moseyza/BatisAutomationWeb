<template>
    <div class="ui page active dimmer">
        <div style="width: 80%;
            height: 80%;background-color:white;">
            <div style="flex: 0 1 auto"> <button @click="close" class="action-button"><i class="icon-removeFile"></i> </button> </div>
            <div style="flex:1;">
                <DependencyGraphNode v-for="letter in dependencyTrail.letters" :key="letter.letterNo" :nodeData="letter" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import * as letterService from '@/store/Services/letterServices';
import store from '@/store';
import { DependencyTrail } from '@/store/models/Letter/DependencyTrail';
import DependencyGraphNode from './DependencyGraphNode/DependencyGraphNode.vue';

@Component({
    components:{DependencyGraphNode}
})
export default class DependencyGraphContainer extends Vue{
    @Prop() letterPossessionId?: string;
    dependencyTrail: DependencyTrail = {} as DependencyTrail;
    async created(){
        if(!this.letterPossessionId)return;
        const ownerId =  store.state.ownerId;
        this.dependencyTrail = await letterService.getDependencyTrail(ownerId,this.letterPossessionId);
       
    }


    close(){
        this.$emit("close");
    }
    
}
</script>
