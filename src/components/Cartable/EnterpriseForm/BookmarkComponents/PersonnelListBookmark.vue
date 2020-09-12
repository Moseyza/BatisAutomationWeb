<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;padding:0 5px">
            <SimpleLookup 
            :validValues="validValues" 
            :valueProp="valueProp" 
            :color="columnColor" @value-selected="onValueSelected"
            ::allowUserEntry="false"
             />
        </div>
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import BookmarkMixin from './BookmarkMixin';
import SimpleLookup from '@/components/Cartable/EnterpriseForm/SimpleLookup/SimpleLookup.vue';
import { ValidValues } from '../../../../store/models/EnterpriseForm/EnterpriseFormValidValues';
import * as personnelService from '@/store/Services/personnelService';

@Component({
    components:{SimpleLookup}
})
export default  class  PersonnelListBookmark extends Mixins(BookmarkMixin){
   
    valueProp = "";
    validValues = [] as  ValidValues[];
    // get defaultValue(){
    //     if(this.tableColumnBookmark)
    //         return this.tableColumnBookmark.defaultValue;
    //     return '';
    // }
    async created(){
        await this.setValidValues();
    }
    async setValidValues(){
        this.validValues.length = 0;
        const allPersonnel =  await personnelService.GetAllPersonnel();
        allPersonnel.forEach(p=>{
            const validVal = {} as ValidValues;
            validVal.item1 = p.personnelId
            validVal.item2 = `${p.firstName} ${p.lastName}`
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