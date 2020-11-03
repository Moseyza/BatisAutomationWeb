<template>
    <div id="editor">
        <div style="flex:5;min-height:100px;overflow-y: scroll; max-height: -webkit-fill-available;" class="container3">
            <AttachmentRowMobile v-for="(file,index) in files" :key="index" :file="file" :index="index" @removed="onAttachmentRemoved($event)"/>
        </div>
        <div class="symmetric-grid" style="flex:1; justify-content:flex-end">
            <label for="upload">
                <i class="icon-attachment action-icon" style="margin: 0 5px;"></i>
                <input type="file" id="upload" style="display:none" @change="onFileChanged($event)">
            </label>
            
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Prop, Component, Watch} from 'vue-property-decorator';
import AttachmentRowMobile from './AttachmentRowMobile/AttachmentRowMobile.vue';
@Component({
    components: {AttachmentRowMobile}

})
export default class AttachmentEditorMobile extends Vue{
    files: File[] = [];
    onFileChanged(e: any){
        this.files.push(e.target.files[0]);
    }
    onAttachmentRemoved(index: number){
         this.files.splice(index,1);
    }
}
</script>


<style scoped>
    #editor{
        display: flex;
        flex-direction: column;
    }
</style>


