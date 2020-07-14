<template>
    <div>
        <div>{{type}}</div>
        <div></div>
        <div></div>
        {{type}}    
    </div>

    
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
@Component
export default class LetterTrailNodeComment extends Vue{
    @Prop() type?: string;
    @Prop() sendTime?: string;
    @Prop() comment?: string;
}   
</script>