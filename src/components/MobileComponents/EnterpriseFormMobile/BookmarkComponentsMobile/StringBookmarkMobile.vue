<template>
    <div  class="symmetric-grid" style="margin-bottom:5px">
        <div   :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;padding:0 5px">
            <input type="text" :style="{'background-color': columnColor}" style="width:100%;min-width:40px;border:none;outline:none" @blur="focusOut" v-model="value" :readonly="isReadOnly"/>
        </div>
    </div>
    <!-- <div style="margin-bottom:5px;display: flex;">
        <div style="display: flex;justify-content: center;align-items: center;">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;display:flex;padding:0 5px">
            <div class="ui fluid input" style="flex:1;">
                <input type="text" :style="{'background-color': columnColor}" style="width:100%;min-width:40px;border:none;outline:none" @blur="focusOut" v-model="value" :readonly="isReadOnly"/>
            </div>
        </div>
    </div> -->
</template>

<script lang="ts">
import BookmarkMixin from '@/components/Cartable/EnterpriseForm/BookmarkComponents/BookmarkMixin';
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import store from '../../../../store';
@Component
export default  class  StringBookmarkMobile extends Mixins(BookmarkMixin){
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