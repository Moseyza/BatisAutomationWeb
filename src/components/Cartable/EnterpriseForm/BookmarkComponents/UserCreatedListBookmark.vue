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
            :valueProp="defaultValue" 
            :color="columnColor" 
            @value-selected="onValueSelected($event)" 
            @value-cleared="onValueCleared()" />
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
export default  class  UserCreatedListBookmark extends Mixins(BookmarkMixin){
    // get defaultValue(){
    //     if(this.tableColumnBookmark)
    //     {
    //         return this.tableColumnBookmark.defaultValue;
    //     }
    //     return '';
    // }
    
    get validValues(){
        if(this.tableColumnBookmark)
        {
            const array =  ((this.tableColumnBookmark.validValues) as string).split('|');
            const result = [] as ValidValues[];
            array.forEach(item=>result.push({item1: item, item2: item}));
            return result;
        }
        else if(this.bookmark){
            const array =  ((this.bookmark.validValue) as string).split('|');
            const result = [] as ValidValues[];
            array.forEach(item=>result.push({item1: item, item2: item}));
            return result;
        }
        return [];
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
}
</script>