<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}" >
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;padding:0 5px">
            <input type="text" style="width:100%;border:none;outline:none" @blur="focusOut()" :style="{'background-color': columnColor}" v-model="value" :readonly="isReadOnly"/>
        </div>
    </div>
</template>

<script lang="ts">
import BookmarkMixin from '@/components/Cartable/EnterpriseForm/BookmarkComponents/BookmarkMixin';
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
@Component
export default  class  IntegerBookmarkMobile extends Mixins(BookmarkMixin){
    created(){
        this.value = 0;
    }
    focusOut(){
        this.$emit("value-changed",this.englishName);
    }
}
</script>

