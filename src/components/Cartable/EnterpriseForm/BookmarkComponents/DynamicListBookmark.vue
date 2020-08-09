<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;padding:0 5px">
            <SimpleLookup :validValues="validValues" :valueProp="defaultValue" :color="columnColor" @value-selected="onValueSelected" />
        </div>
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import BookmarkMixin from './BookmarkMixin';
import SimpleLookup from '@/components/Cartable/EnterpriseForm/SimpleLookup/SimpleLookup.vue';
import { ValidValues } from '../../../../store/models/EnterpriseForm/EnterpriseFormValidValues';

@Component({
    components:{SimpleLookup}
})
export default  class  DynamicListBookmark extends Mixins(BookmarkMixin){
   
    @Prop() validValues?: ValidValues;
    get defaultValue(){
        if(this.tableColumnBookmark)
            return this.tableColumnBookmark.defaultValue;
        return '';
    }
    created(){
        const data = {} as any;
        data.SqlQuery = "";
        data.ValidValues = [{Id:"",Value:""}];
        data.SelectedValue = {Id:"",Value:""};
        this.value = data;

    }
    onValueSelected(value: ValidValues){
        this.value.Id = value.item1;
        this.value.Value = value.item2;
        this.$emit("value-changed",this.englishName);
    }
    
}
</script>