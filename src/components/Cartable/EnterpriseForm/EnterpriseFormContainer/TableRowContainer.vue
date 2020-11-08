<template>
    <div style="display:flex;align-items: center; border-bottom:1px solid black" class="form-table-row" >
        <div style="flex:0 1 auto;padding:5px;" @click="removeRow()"> <i class="action-icon icon-removeFile small-text"></i> </div>
        <div style="flex:1;padding:5px; border-right:1px solid black;" ref="tablerow"  ></div>
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop} from 'vue-property-decorator';
import store from '@/store';
@Component
export default class TableRowContainer extends Vue{
    @Prop() rowIndex?: number;
    @Prop() tableName?: string;
    removeRow(){
        //alert(this.rowIndex);
        store.state.eventHub.$emit('table-row-removed',{tableName: this.tableName, rowIndex: this._rowIndex});
        this.$destroy();
        this.$el.remove();
    }
    _rowIndex = 0;
    created(){
        if(this.rowIndex)
            this._rowIndex = this.rowIndex;
        //console.log(this.rowIndex);
    }
}

</script>

<style lang="less" scoped>
    .form-table-row:hover{
        border: 1px solid var(--color-primary)  !important;
        background-color: var(--LineItem);
    }
</style>