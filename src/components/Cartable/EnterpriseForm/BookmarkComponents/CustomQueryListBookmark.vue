<template>
    <div class="symmetric-grid">
        <div style="flex:0 1 auto;padding:5px">
            <span style="white-space: break-spaces;">{{persianName}}:</span>
        </div>
        <div style="flex:1;padding:0 5px">
            <input type="text" :style="{'background-color': columnColor}" style="width:100%;border:none;outline:none" v-model="value" :readonly="isReadOnly"/>
        </div>
        
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import BookmarkMixin from './BookmarkMixin';
@Component
export default  class  CustomQueryListBookmark extends Mixins(BookmarkMixin){
    created(){
        this.value = '';
    }
}
</script>