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
            :valueProp="value" 
            :color="columnColor" 
            @value-selected="onValueSelected($event)" 
            @value-cleared="onValueCleared()"
            ::allowUserEntry="false" />
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
export default  class  MonthBookmark extends Mixins(BookmarkMixin){
    get validValues(){
        const result = [] as ValidValues[];
        result.push({item1:"فروردین",item2:"فروردین"});
        result.push({item1:"اردیبهشت",item2:"اردیبهشت"});
        result.push({item1:"خرداد",item2:"خرداد"});
        result.push({item1:"تیر",item2:"تیر"});
        result.push({item1:"مرداد",item2:"مرداد"});
        result.push({item1:"شهریور",item2:"شهریور"});
        result.push({item1:"مهر",item2:"مهر"});
        result.push({item1:"آبان",item2:"آبان"});
        result.push({item1:"آذر",item2:"آذر"});
        result.push({item1:"دی",item2:"دی"});
        result.push({item1:"بهمن",item2:"بهمن"});
        result.push({item1:"اسفند",item2:"اسفند"});
        return result;
    }

    created(){
        // const data = {} as any;
        // data.Id = '';
        // data.Value = '';
        // if(this.tableColumnBookmark && this.tableColumnBookmark.defaultValue){
        //     data.Id = this.tableColumnBookmark.defaultValue;
        //     data.Value = this.tableColumnBookmark.defaultValue;
        // }
        // else if(this.bookmark && this.bookmark.defaultValue){
        //      data.Id = this.bookmark.defaultValue;
        //     data.Value = this.bookmark.defaultValue;
        // }
        // this.value = data.Value;
    }
    onValueSelected(value: ValidValues){
        //this.value.Id = value.item1;
        this.value = value.item2;
        this.$emit("value-changed",this.englishName);
    }

    onValueCleared(){
        this.value = "";
        this.$emit("value-changed",this.englishName);
    }
}
</script>