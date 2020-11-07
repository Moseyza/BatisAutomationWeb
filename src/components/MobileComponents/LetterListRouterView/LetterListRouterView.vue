<template >
    <div id="LetterListRouterView-container" style="height:100%" >
       <router-view
            @selected-letter-changed="onSelectdLetterChangedMobile($event)" 
            @selected-draft-changed="onSelectdDraftChangedMobile($event)"
            @selected-searchresult-changed="onSelectdSearchResultChangedMobile($event)" 
            ref='letterlist'>
        </router-view>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Watch} from 'vue-property-decorator';
    import * as api from '@/store/api';
    import * as letterOwnerService from '@/store/Services/letterOwnerService.ts';
    import * as announcementBoardService from '@/store/Services/announcementBoardService.ts';
    import { Letter } from '@/store/models/Letter/Letter';
    import { DraftLetter } from '@/store/models/Letter/DraftLetter';
    import {LetterSearchResult } from '@/store/models/Letter/LetterSearchResult';

    @Component({
    })
    export default class LetterListRouterView extends Vue {

        async created(){
            // alert('listRouter')
            //  await (this.$refs.letterlist as any).refresh();
        }
        
        onSelectdLetterChangedMobile(letter: Letter ){
            this.$emit('set-selectdLetterChanged-letterListView',letter);    
            
        }
        async onSelectdDraftChangedMobile(letter: DraftLetter ){
            this.$emit('set-selectdDraftChanged-letterListView',letter);    
        }
        onSelectdSearchResultChangedMobile(searchResult: LetterSearchResult){
        this.$emit('set-selectdSearchResultChanged-letterListView',searchResult);    
        }
    }
</script>


<style lang="less" scoped>

    #folders-container{
        height: 100%;
        overflow: auto;
    }
    
</style>

