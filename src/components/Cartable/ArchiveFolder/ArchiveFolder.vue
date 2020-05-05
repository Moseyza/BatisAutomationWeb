<template>
     <div style="height:100%">
        <LetterList :lettersProp="letters" :loading="loading" @selected-letter-changed="onSelectedLetterChanged($event)" ></LetterList>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch } from 'vue-property-decorator';
import LetterList from '@/components/Cartable/LetterList/LetterList.vue';
import {Letter} from '@/store/models/Letter/Letter'
import * as letterService from '@/store/Services/letterServices'
import * as api from '@/store/api'
@Component({
    components:{LetterList}
})
export default class ArchiveFolder extends Vue {
    letters?: Letter[] = [];
    loading = false;
    @Prop() folderId?: string;
    @Watch('folderId')
    async onFolderIdChanged(){
        if(this.folderId === undefined)return;
        this.loading = true;
        const archiveLetters = await api.getReceivedLetters(); //await letterService.GetArchiveFolderLetters(this.folderId);
        this.loading = false;
        if(!archiveLetters || this.letters === undefined) return;
        if(archiveLetters.letterList === null) return;
        this.letters = archiveLetters.letterList;
    }
    created(){
        alert("test");
    }

    // async created(){
    //      if(this.folderId === undefined)return;
    //     this.loading = true;
    //     const archiveLetters = await letterService.GetArchiveFolderLetters(this.folderId);
    //     this.loading = false;
    //     if(!archiveLetters) return;
    //     this.letters =  archiveLetters;
    // }
    
     onSelectedLetterChanged(letter: Letter){
        this.$emit('selected-letter-changed',letter);
    }
}

</script>


