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
import { ValidValues } from '../../../../store/models/EnterpriseForm/EnterpriseFormValidValues';
import BookmarkMixin from '@/components/Cartable/EnterpriseForm/BookmarkComponents/BookmarkMixin';
import SimpleLookupMobile from '@/components/MobileComponents/EnterpriseFormMobile/SimpleLookupMobile/SimpleLookupMobile.vue';

@Component({
    components:{SimpleLookupMobile}
})
export default  class  DayBookmark extends Mixins(BookmarkMixin){
    get validValues(){
        const result = [] as ValidValues[];
        result.push({item1:"1",item2:"1"});
        result.push({item1:"2",item2:"2"});
        result.push({item1:"3",item2:"3"});
        result.push({item1:"4",item2:"4"});
        result.push({item1:"5",item2:"5"});
        result.push({item1:"6",item2:"6"});
        result.push({item1:"7",item2:"7"});
        result.push({item1:"8",item2:"8"});
        result.push({item1:"9",item2:"9"});
        result.push({item1:"10",item2:"10"});
        result.push({item1:"11",item2:"11"});
        result.push({item1:"12",item2:"12"});
        result.push({item1:"13",item2:"13"});
        result.push({item1:"14",item2:"14"});
        result.push({item1:"15",item2:"15"});
        result.push({item1:"16",item2:"16"});
        result.push({item1:"17",item2:"17"});
        result.push({item1:"18",item2:"18"});
        result.push({item1:"19",item2:"19"});
        result.push({item1:"20",item2:"20"});
        result.push({item1:"21",item2:"21"});
        result.push({item1:"22",item2:"22"});
        result.push({item1:"23",item2:"23"});
        result.push({item1:"24",item2:"24"});
        result.push({item1:"25",item2:"25"});
        result.push({item1:"26",item2:"26"});
        result.push({item1:"27",item2:"27"});
        result.push({item1:"28",item2:"28"});
        result.push({item1:"29",item2:"29"});
        result.push({item1:"30",item2:"30"});
        result.push({item1:"31",item2:"31"});
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