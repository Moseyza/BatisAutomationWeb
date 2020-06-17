<template>
    <div>
        
        <label >
                        <i class="icon icon-paperclip action-icon"></i>
                        <input type="file" @change="onFileChanged($event)"  style="display:none">
        </label>
    </div>
</template>

<script lang="ts">
import {Vue, Prop , Component, Emit} from 'vue-property-decorator';
@Component
export default class FileSelector extends Vue{
    onFileChanged(e: any){
        this.$emit('file-changed',e.target.files[0]);
    }
}
</script>

