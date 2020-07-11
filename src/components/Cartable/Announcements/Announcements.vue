<template>
     <div style="height:100%">
        <LetterList :lettersProp="letters" :mode="'announcements'" :loading="loading" @selected-letter-changed="onSelectedLetterChanged($event)" ></LetterList>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop } from 'vue-property-decorator';
import LetterList from '@/components/Cartable/LetterList/LetterList.vue';
import {Letter} from '@/store/models/Letter/Letter'
import * as announcementBoardService from '@/store/Services/announcementBoardService';
import store from '@/store';
@Component({
    components:{LetterList}
})
export default class Announcement extends Vue {
    letters?: Letter[] = [];
    loading = false;
    @Prop() boardId?: string;
    async created(){
       this.refresh();
    }
     onSelectedLetterChanged(letter: Letter){
        this.$emit('selected-letter-changed',letter);
    }

    async refresh(){
         this.loading = true;
        const ownerId = store.state.ownerId;
        if(!this.boardId)return;
        const announcements = await announcementBoardService.getAnnouncementsInBoard(ownerId,this.boardId);
        this.loading = false;
        if(!announcements) return;
        this.letters =  announcements;
    }
}

</script>





