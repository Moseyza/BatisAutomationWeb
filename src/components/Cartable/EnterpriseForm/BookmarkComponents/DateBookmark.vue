<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;display:flex;padding:0 5px">
            <input style="border:none;outline:none;" type="text" v-model="value" :id='englishName' placeholder="__/__/_____"> <VuePersianDatetimePicker :clearable="true" :element="englishName" v-model="value" />
            <button @click="clear" class="button"  style="margin-right:5px;padding:1px;" ><i  class="icon-clearSearch"></i></button>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import BookmarkMixin from './BookmarkMixin';
import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
@Component({
    components: {VuePersianDatetimePicker}
})
export default  class  DateBookmark extends Mixins(BookmarkMixin){
    created(){
        this.value = ''; //this.defaultValue;
    }

    clear(){
        this.value = '';
    }

    onValueChanged(){
        this.$emit("value-changed",this.englishName);
    }
}
</script>