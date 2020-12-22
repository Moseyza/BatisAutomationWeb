<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;padding:0 5px">
            <SimpleLookupMobile :validValues="validValues" :valueProp="valueProp" :color="columnColor" @value-selected="onValueSelected" />
        </div>
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import SimpleLookupMobile from '@/components/MobileComponents/EnterpriseFormMobile/SimpleLookupMobile/SimpleLookupMobile.vue';
import { ValidValues } from '../../../../store/models/EnterpriseForm/EnterpriseFormValidValues';
import BookmarkMixin from '@/components/Cartable/EnterpriseForm/BookmarkComponents/BookmarkMixin';

@Component({
    components:{SimpleLookupMobile}
})
export default  class  CustomQueryListBookmarkMobile extends Mixins(BookmarkMixin){
   
    valueProp = "";
    @Prop() validValues?: ValidValues;
    // get defaultValue(){
    //     if(this.tableColumnBookmark)
    //         return this.tableColumnBookmark.defaultValue;
    //     return '';
    // }
    created(){
        const data = {} as any;
        data.Id = '';
        data.Value = '';
        if(this.tableColumnBookmark && this.tableColumnBookmark.defaultValue){
            data.Id = this.tableColumnBookmark.defaultValue;
            data.Value = this.tableColumnBookmark.defaultValue;
        }
        else if(this.bookmark && this.bookmark.defaultValue)
        {
            data.Id = this.bookmark.defaultValue;
            data.Value = this.bookmark.defaultValue;
        }
        this.value = data;
    }
    onValueSelected(value: ValidValues){
        this.value.Id = value.item1;
        this.value.Value = value.item2;
        this.$emit("value-changed",this.englishName);
    }
    onValueChanged(){
        
        if(this.englishName.toLowerCase() === "kindofactivity"){
            const test = 1;
        }
        if(this.value)
            if(this.value.Value)
                this.valueProp = this.value.Value;
            else
                this.valueProp = this.value;
    }
    
}
</script>