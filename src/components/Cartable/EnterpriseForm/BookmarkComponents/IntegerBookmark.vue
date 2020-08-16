<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}" >
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;padding:0 5px">
            <input type="text" style="width:100%;border:none;outline:none" :style="{'background-color': columnColor}" v-model="value" :readonly="isReadOnly"/>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import BookmarkMixin from './BookmarkMixin';
@Component
export default  class  StringBookmark extends Mixins(BookmarkMixin){
    created(){
        this.value = 0;
    }
}
</script>

