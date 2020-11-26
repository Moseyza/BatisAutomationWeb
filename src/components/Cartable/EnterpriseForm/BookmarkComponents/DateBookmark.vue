<template>
    <!-- for desktop -->
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;display:flex;padding:0 5px">
            <input style="border:none;outline:none;" type="text" v-model="value" :id='controlName' placeholder="__/__/_____">
             <VuePersianDatetimePicker :clearable="true" :element="controlName" v-model="value" />
            <button @click="clear" class="button"  style="margin-right:5px;padding:1px;" >
                <i  class="icon-clearSearch"></i>
            </button>
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
                <input style="border:none;outline:none;" type="text" v-model="value" :id='controlName' placeholder="__/__/_____">
            </div>
             <VuePersianDatetimePicker :clearable="true" :element="controlName" v-model="value" />
            <button @click="clear" class="button"  style="margin-right:5px;padding:1px;" >
                <i  class="icon-clearSearch"></i>
            </button>
        </div>
    </div> -->
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import BookmarkMixin from './BookmarkMixin';
import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
import * as  service from '@/store/Services/enterpriseFormService';
import store from '@/store';
@Component({
    components: {VuePersianDatetimePicker}
})
export default  class  DateBookmark extends Mixins(BookmarkMixin){

    get controlName(){
        if(this.tableRowIndex != undefined)
            return this.englishName + this.tableRowIndex;
        else return this.englishName;
    }
     created(){
        if(this.defaultValue)
        {
            //if(this.defaultValue.includes("%%"))
            //{
                
                //alert(this.value);
                //console.log(this.value);
            //}
            //else
                this.value = this.defaultValue;
        }
            
        else
            this.value = ''; //this.defaultValue;
    }


    clear(){
        this.value = '';
    }

     onValueChanged(){
        this.$emit("value-changed",this.englishName);
        // if(this.value as string)
        //     if((this.value as string).includes("%%")){
        //         this.value =  (await service.updateParameter(store.state.ownerId,this.value) as string);
        //     }

    }
}
</script>