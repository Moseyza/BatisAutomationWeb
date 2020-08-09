<template>
    <div class="form-table-row" ref="tablerow">

    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop} from 'vue-property-decorator';

@Component
export default class TableRowContainer extends Vue{

}

</script>

<style lang="less" scoped>
    .form-table-row:hover{
        border: 1px solid #3498db;
        background-color: grey;
    }
</style>