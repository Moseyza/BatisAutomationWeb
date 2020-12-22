<template>
    <div style="display:flex;">
        <div v-for="index in columnCount" :key="index" style="flex:1" :ref="`col${rowIndex}${index}`">

        </div>
    </div>    
</template>

<script lang="ts">
import {Vue, Prop , Component} from 'vue-property-decorator';
@Component
export default class FormFormatRowMobile extends Vue{
    @Prop() columnCount?: number;
    @Prop() rowIndex?: number;
    
}
</script>