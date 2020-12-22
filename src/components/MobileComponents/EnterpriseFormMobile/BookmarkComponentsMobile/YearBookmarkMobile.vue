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
            :valueProp="value.Value" 
            :color="columnColor" 
            ::allowUserEntry="false"
            @value-selected="onValueSelected($event)" 
            @value-cleared="onValueCleared()" />
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
export default  class  YearBookmarkMobile extends Mixins(BookmarkMixin){
    // get defaultValue(){
    //     if(this.tableColumnBookmark)
    //     {
    //         return this.tableColumnBookmark.defaultValue;
    //     }
    //     return '';
    // }
    
    get validValues(){
        
            const array = (`1380|1381|1382|1383|1384|1385|1386|1387|1388|1389|1390
            |1391|1392|1393|1394|1395|1396|1397|1398|1399|1400
            |1401|1402|1403|1404|1405|1406|1407|1408|1409|1410`).split('|');
            const result = [] as ValidValues[];
            array.forEach(item=>result.push({item1: item, item2: item}));
            return result;
       
        
    }

    created(){
        const data = {} as any;
        data.Id = '';
        data.Value = '';
        if(this.tableColumnBookmark && this.tableColumnBookmark.defaultValue){
            data.Id = this.tableColumnBookmark.defaultValue;
            data.Value = this.tableColumnBookmark.defaultValue;
        }
        else if(this.bookmark && this.bookmark.defaultValue){
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

    onValueCleared(){
        this.value.Id = "";
        this.value.Value = "";
        this.$emit("value-changed",this.englishName);
    }

    onValueChanged(){
        if(typeof this.value === 'string'){
            const  val = {Id:this.value,Value:this.value};
            this.value = val;
        }

    }

}
</script>