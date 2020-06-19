<template>
    <div class="symmetric-grid  single-attachment" style="font-size:small;width:100px;">
        <div class="xxsmall-text"  style="flex:3;white-space:nowrap;overflow:hidden;text-overflow: ellipsis">{{file.extension}}</div>
        <div class="xxsmall-text" style="flex:1 margin:0 3px"><i class="icon-download helper-icon-small" @click="downloadFile"></i></div>
        <i v-if="canRemove"  @click="remove()" class="icon-x icon action-icon"></i>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
    import File from '@/store/models/Letter/File';
    import * as api from '@/store/Services/fileService';
    import { converBase64toBlob, saveFile } from '@/util/utils';
    @Component
    export default class LetterAttachment extends Vue {
        @Prop() file?: File;
    
        @Prop() canRemove?: boolean;
        @Prop() index?: number;
        async downloadFile(){
            if(this.file === undefined)return;
            
            if(this.file.id ==='' || this.file.id ===  '00000000-0000-0000-0000-000000000000' || this.file.id === undefined){
                this.file.content =  this.file.content.substring(this.file.content.indexOf(',') + 1);
                const blob =  converBase64toBlob(this.file.content||"",'');
                saveFile(blob,this.file.extension);
               
            }else{
                const file = await api.getFile(this.file.id);
                const blob =  converBase64toBlob(file.content||"",'');
                saveFile(blob,this.file.extension);
            }
        }

        remove(){
            this.$emit('remove',this.index);
        }

        
    }
</script>

<style lang="less" scoped>
    .single-attachment{
        background-color: #3f3f3f;
        padding: 3px;
        margin: 2px;
        border-radius: 3px;

    }
</style>

