<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;padding:0 5px">
            <SimpleLookupMobile 
            :validValues="validValues" 
            :valueProp="valueProp" 
            :color="columnColor" 
            ::allowUserEntry="false"
            @value-selected="onValueSelected" />
        </div>
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import { ValidValues } from '../../../../store/models/EnterpriseForm/EnterpriseFormValidValues';
import * as letterOwnerService from '@/store/Services/letterOwnerService';
import BookmarkMixin from '@/components/Cartable/EnterpriseForm/BookmarkComponents/BookmarkMixin';
import SimpleLookupMobile from '@/components/MobileComponents/EnterpriseFormMobile/SimpleLookupMobile/SimpleLookupMobile.vue';
@Component({
    components:{SimpleLookupMobile}
})
export default  class  CompanyLetterOwnerListBookmarkMobile extends Mixins(BookmarkMixin){
   
    valueProp = "";
    validValues = [] as  ValidValues[];

    async created(){
        await this.setValidValues();
    }
    async setValidValues(){
        this.validValues.length = 0;
        const allCompanies =  await letterOwnerService.getAllLetterOwners();
        allCompanies.forEach(c=>{
            const validVal = {} as ValidValues;
            validVal.item1 = c.id;
            validVal.item2 = c.name;
            this.validValues.push(validVal);
        });
    }
    onValueSelected(value: ValidValues){
        this.value.Id = value.item1;
        this.value.Value = value.item2;
        this.$emit("value-changed",this.englishName);
    }
    onValueChanged(){
        if(this.value)
            if(this.value.Value)
                this.valueProp = this.value.Value;
            else 
                this.valueProp = this.value;
    }
    
}
</script>