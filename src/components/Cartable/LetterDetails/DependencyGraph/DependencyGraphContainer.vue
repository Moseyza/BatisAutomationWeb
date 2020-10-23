<template>
    <div class="ui page active dimmer">
        <div style="width: 80%;
    height: 80%;
    align-items: center;
    justify-content: center;
    background-color: white;
    color: red;
    display: flex;">
            Depencency Graph
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component
export default class DependencyGraphContainer extends Vue{
    @Prop() letterPossessionId?: string;
    
}
</script>
