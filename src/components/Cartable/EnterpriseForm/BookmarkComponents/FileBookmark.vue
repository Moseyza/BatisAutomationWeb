<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;display:flex;padding:0 5px;">
            <div style="flex:1">
                <LetterAttachment v-if="isFileSelected"  :file="value"/>
            </div>
            <div style="flex: 0 1 auto">     
                <button v-if="!isFileSelected" @click="onFileButtonClick()" class="button"> <i class="icon-addAttachment" ></i></button>
                <input  v-if="!isFileSelected" ref="fileInput" type="file" @change="onFileChanged($event)"  style="display:none">
                <button v-else  @click="clearFile()"  class="button"><i class="icon-clearSearch"></i></button>
            </div>
        </div>
        
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import BookmarkMixin from './BookmarkMixin';
import LetterAttachment from '@/components/Cartable/LetterDetails/LetterAttachment/LetterAttachment.vue';
import File from '../../../../store/models/Letter/File';
import * as util from '@/util/utils';
@Component({
    components:{LetterAttachment}
})
export default  class  FileBookmark extends Mixins(BookmarkMixin){
    isFileSelected = false;
    loadedPercent = 0;
    created(){
        //this.value = {} as File;
        this.value = '';
    }
    onFileButtonClick(){
        (this.$refs.fileInput as any).click();
    }
    onFileChanged(file: any){
        const reader = new FileReader();
        reader.addEventListener("progress",(evt)=>{
            this.loadedPercent = (evt.loaded / evt.total) * 100;
        });
        reader.addEventListener("loadend",(x)=>{
            const attachedFile = {} as File;
            if(x.target)
            {
                attachedFile.id = '00000000-0000-0000-0000-000000000000';
                attachedFile.extension = file.target.files[0].name;
                attachedFile.content =  util.base64RemovePrefix((x.target as any).result);
                this.value = attachedFile;
                this.isFileSelected = true;
            }
        });
        reader.readAsDataURL(file.target.files[0]);
    }

    clearFile(){
        this.isFileSelected = false;
    }
    
}
</script>