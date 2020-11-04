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
            onSelectdLetterChangedMobile(letter: Letter ){
            this.$emit('set-selectdLetterChanged-letterListView',letter);    
            // this.leftSideMode = 'details';
            // this.noLetterSelected = false;
            // const temp: any = {};
            // Object.assign(temp,letter)
            // this.selectedLetter = temp;
        }
        async onSelectdDraftChangedMobile(letter: DraftLetter ){
            this.$emit('set-selectdDraftChanged-letterListView',letter);    

            // if(letter.isEnterpriseForm){
            //     const ownerId =  store.state.ownerId;
            //     const loadDraftEnterpriseFormRequest = {
            //         possessionId: letter.letterPossessionId,
            //         letterId: letter.id,
            //         formId: letter.enterpriseFormId,
            //         ownerId: ownerId
            //     }
            //     const draftFormInfo =  await enterpriseFormService.getDraftEnterpriseForm(loadDraftEnterpriseFormRequest);
            //     draftFormInfo.draftEnterpriseForm.enterpriseFormDto
            //     this.onEnterpriseFormSelected(draftFormInfo.draftEnterpriseForm.enterpriseFormDto,undefined,draftFormInfo);
            // }
            // else{
            //     this.leftSideMode = 'draftDetails';
            //     this.noLetterSelected = false;
            //     const temp: any = {};
            //     Object.assign(temp,letter)
            //     this.selectedLetter = temp;
            // }
        }
        onSelectdSearchResultChangedMobile(searchResult: LetterSearchResult){
        this.$emit('set-selectdSearchResultChanged-letterListView',searchResult);    

            // //this.leftSideMode = 'searchResultDetails';
            // this.noLetterSelected = false;
            // const temp: any = {};
            // Object.assign(temp,searchResult)
            // this.selectedSearchResult = temp;
            // this.selectedLetter = {} as Letter;
            // this.selectedLetter.id = this.selectedSearchResult.letterId;
            // this.selectedLetter.title = this.selectedSearchResult.title;
            // this.selectedLetter.abstract = this.selectedSearchResult.abstract;
            // this.selectedLetter.letterPossessionId = this.selectedSearchResult.possessionId;
            // this.selectedLetter.sender = this.selectedSearchResult.from;
            // this.selectedLetter.recievers = this.selectedSearchResult.to;
            // this.selectedLetter.comment = this.selectedSearchResult.comment;
            // this.selectedLetter.isOpenned = this.selectedSearchResult.isOpenned;
            // this.selectedLetter.letterNo = this.selectedSearchResult.letterNo;
            // this.selectedLetter.isForwarded = this.selectedSearchResult.isForwarded;
            // this.selectedLetter.letterReferences = this.selectedSearchResult.letterReferences;
            // this.selectedLetter.sendTime = this.selectedSearchResult.sendTime;
            
            
            // this.leftSideMode = 'details';
        }
    }
</script>


<style lang="less" scoped>

    #folders-container{
        height: 100%;
        overflow: auto;
    }
    
</style>

