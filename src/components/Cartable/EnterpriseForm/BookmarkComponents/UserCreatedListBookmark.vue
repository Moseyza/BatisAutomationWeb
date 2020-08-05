<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;padding:0 5px">
            <SimpleLookup :validValues="validValues" :valueProp="defaultValue" />
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
   
    
  
    get defaultValue(){
        if(this.tableColumnBookmark)
            return this.tableColumnBookmark.defaultValue;
        return '';
    }
    get options(){
        if(this.bookmark)return this.bookmark.validValue;
        else if(this.tableColumnBookmark) return (this.tableColumnBookmark.validValues as string).split('|');
        else return [];
    }

    get validValues(){
        if(this.tableColumnBookmark)
        {
            const array =  ((this.tableColumnBookmark.validValues) as string).split('|');
            const result = [] as ValidValues[];
            array.forEach(item=>result.push({item1: item, item2: item}));
            return result;
        }
        return [];
    }
}
</script>