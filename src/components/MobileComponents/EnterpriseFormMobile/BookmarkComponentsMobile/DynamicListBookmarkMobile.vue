<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;padding:0 5px">
            <SimpleLookupMobile :validValues="validValues" :valueProp="value.SelectedValue.Value" :color="columnColor" @value-selected="onValueSelected" />
        </div>
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import SimpleLookupMobile from '@/components/MobileComponents/EnterpriseFormMobile/SimpleLookupMobile/SimpleLookupMobile.vue';
import { ValidValues, ValidValuesForSingleTable } from '../../../../store/models/EnterpriseForm/EnterpriseFormValidValues';
import BookmarkMixin from '@/components/Cartable/EnterpriseForm/BookmarkComponents/BookmarkMixin';

@Component({
    components:{SimpleLookupMobile}
})
export default  class  DynamicListBookmarkMobile extends Mixins(BookmarkMixin){
   
    //@Prop() validValues?: ValidValues;
    validValues = [] as ValidValues[];
   
    created(){
        const data = {} as any;
        data.SqlQuery = "";
        data.ValidValues = [{Id:"",Value:""}];
        data.SelectedValue = {Id:"",Value:""};
        this.value = data;

    }
    onValueSelected(value: ValidValues){
        this.value.SelectedValue.Id = value.item1;
        this.value.SelectedValue.Value = value.item2;
        this.$emit("value-changed",this.englishName);
    }

    onValueChanged(newVal: any, oldVal: any){
        if(oldVal.ValidValues){
            if(newVal.ValidValues != null && oldVal.ValidValues.length > 0){
                if(newVal.ValidValues.find((item: any)=> item.Id === oldVal.ValidValues[0].Id))
                    return;
            }
        }
        this.validValues.length = 0;
        if(newVal.ValidValues === null && oldVal.ValidValues !== null)
        {
            //this.value.ValidValues = oldVal.ValidValues;
            this.value = oldVal;
        }
        if(!newVal.ValidValues)return;
        newVal.ValidValues.forEach((element: any) => {
            const validVal = {} as ValidValues;
            validVal.item1 = element.Id;
            validVal.item2 = element.Value;
            this.validValues.push(validVal);
        });
    }
    
}
</script>