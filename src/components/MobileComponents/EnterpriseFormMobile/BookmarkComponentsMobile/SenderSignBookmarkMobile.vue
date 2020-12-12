<template>
    <div  class="symmetric-grid" style="margin-bottom:5px">
        <div   :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;padding:0 5px">
            <input type="text" :style="{'background-color': columnColor}" style="width:100%;border:none;outline:none;display:none" @blur="focusOut" v-model="value" :readonly="isReadOnly"/>
        </div>
    </div>
</template>

<script lang="ts">
import BookmarkMixin from '@/components/Cartable/EnterpriseForm/BookmarkComponents/BookmarkMixin';
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import store from '../../../../store';
@Component
export default  class  SenderSignBookmarkMobile extends Mixins(BookmarkMixin){
    created(){
        if(this.defaultValue)
            this.value = this.defaultValue;
        else
            this.value = '';
    }
    focusOut(){
        if(this.isMandatory)
            this.$emit("value-changed",this.englishName);
    }
}
</script>