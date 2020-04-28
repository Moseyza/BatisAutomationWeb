<template>
    <div class="symmetric-grid container2" style="font-size:small;width:100px;height:30px">
        <div style="flex:3;white-space:nowrap;overflow:hidden">{{file.extension}}</div>
        <div style="flex:1"><i class="icon-download helper-icon-small" @click="downloadFile"></i></div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator';
    import File from '@/store/models/Letter/File';
    import * as api from '@/store/Services/fileService';
import { converBase64toBlob, saveFile } from '@/util/utils';
    @Component
    export default class LetterAttachment extends Vue {
        @Prop() file?: File;
        async downloadFile(){
            if(this.file === undefined)return;
            const file = await api.getFile(this.file.id);
            const blob =  converBase64toBlob(file.content||"",'');
            saveFile(blob,file.extension);
        }
    }
</script>

<style lang="less" scoped>
    div{
        font-size: 7pt;
    }
</style>

