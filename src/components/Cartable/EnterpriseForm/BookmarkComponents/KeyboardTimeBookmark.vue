<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;padding:0 5px">
            <input type="text" style="width:100%;text-align:center;border:none;outline:none" :style="{'background-color': columnColor}" v-model="value" placeholder="--:--" :readonly="isReadOnly"/>
        </div>
        
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import BookmarkMixin from './BookmarkMixin';
@Component
export default  class  StringBookmark extends Mixins(BookmarkMixin){
    created(){
        this.value = '';
    }

    onValueChanged(newVal: string, oldVal: string){
        const array = newVal.split('');
        if(array.length == 0)return;
        if(isNaN(parseInt(array[array.length -1])) || this.value.length > 5){
            this.value = (this.value as string).substring(0,this.value.length -1);
        }
        if(newVal.length > oldVal.length){
            if(this.value.length === 2)this.value = this.value + ':';
        }
        if(this.value.length === 5){
            const splited =  (this.value as string).split(':');
            if(parseInt(splited[0]) > 23 || parseInt(splited[1]) > 59){
                this.value = '';
            }
        }
    }

}
</script>