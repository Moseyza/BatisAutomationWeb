<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;padding:0 5px">
            <select  :value="value" style="width: 100%" :style="{'background-color': columnColor}" >
                <option  v-for="(option,index) in options" :key="index" :value="option.trim()" >{{option}}</option>
            </select>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import BookmarkMixin from './BookmarkMixin';
@Component
export default  class  UserCreatedListBookmark extends Mixins(BookmarkMixin){
   
    
    created(){
        if(this.tableColumnBookmark){
            if(this.tableColumnBookmark.defaultValue)
                this.value = this.tableColumnBookmark.defaultValue.trim();
        }

    }
    get options(){
        if(this.bookmark)return this.bookmark.validValue;
        else if(this.tableColumnBookmark) return (this.tableColumnBookmark.validValues as string).split('|');
        else return [];
    }
}
</script>