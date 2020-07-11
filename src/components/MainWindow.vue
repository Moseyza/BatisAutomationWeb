<template>
    <div class="three-part-flexbox" id="main-container">
        <CartableTitle @on-letter-owner-set="onLetterOwnerSet" class="flex-part-top" />
        <div class="container3 flex-part-middle" id="child-container"  style="flex: 18 1 0%;overflow: hidden;">
            <div style="flex:2;">
                    <div class="three-part-flexbox">
                        <div class="flex-part-top" style="flex: 0.5 0 0;display:flex;">
                                <QuickAccess  @fast-send-clicked="onFastSendBtnClick($event)"/>
                        </div>
                        <div class="flex-part-middle">
                            <FoldersTree :letterOwnerId="letterOwnerId" @folder-clicked="onFolderClicked()"></FoldersTree>
                        </div>
                        <div class="flex-part-bottom" style="flex: 0.5 0 0;"></div>
                        
                    </div>
                     
            </div>
            <div class="conatiner2" style="flex:3">
                <router-view @selected-letter-changed="onSelectdLetterChanged($event)" @selected-searchresult-changed="onSelectdSearchResultChanged($event)" ref='letterlist'></router-view>
            </div>
            <div class="container2" style="flex:6">
                <LetterDetails v-if="noLetterSelected == false && leftSideMode==='details'" :letter="selectedLetter" 
                :searchResult="selectedSearchResult"
                @finalize-letter="onFinalizeLetter($event)"
                @forward-letter="onForwardLetter($event)"
                @letter-closed-fast="onLetterClosedFast($event)"
                @closed-letter-rejected="onClosedLetterRejected($event)"
                >
                </LetterDetails>
                <SearchResultDetails v-else-if="noLetterSelected == false && leftSideMode==='searchResultDetails'" :searchResult="selectedSearchResult"
                @finalize-letter="onFinalizeLetter($event)"
                @forward-letter="onForwardLetter($event)"
                 >
                </SearchResultDetails>
                <FinalizeLetter v-else-if="leftSideMode=== 'finalize'" :letter="selectedLetter"  />
                <ForwardLetter v-else-if="leftSideMode=== 'forward'" @forward-canceled="onForwardCanceled" :letter="selectedLetter" />
                <FastSend :mode="fastSendMode" v-else-if="leftSideMode=== 'fastSend'" @fastsend-canceled="onFastSendCanceled($event)"/>
            </div>
            
        </div>
        <div class="flex-part-bottom container2" style="flex: .2 0 0;direction:ltr;font-size:x-small;">
            Batis idea processors. All rights reserved ©
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop} from 'vue-property-decorator';
import * as api from '@/store/api';
import SingleCartableOwner from '@/components/Cartable/CartableOwner/SingleCartableOwner.vue';
import CartableTitle from '@/components/Cartable/CartableTitle/CartableTitle.vue';
import FoldersTree from '@/components/Cartable/FoldersTree/FoldersTree.vue';
import LetterDetails from '@/components/Cartable/LetterDetails/LetterDetails.vue';
import SearchResultDetails from '@/components/Cartable/LetterDetails/SearchResultDetails.vue';
import FinalizeLetter from '@/components/Cartable/LetterDetails/FinalizeLetter/FinalizeLetter.vue';
import { Letter } from '@/store/models/Letter/Letter';
import ForwardLetter from '@/components/Cartable/ForwardLetter/ForwardLetter.vue';
import QuickAccess from '@/components/Cartable/QuickAccess/QuickAccess.vue';
import FastSend from '@/components/Cartable/FastSend/FastSend.vue';
import {LetterSearchResult } from '@/store/models/Letter/LetterSearchResult';
@Component({
    components: { FoldersTree, LetterDetails, CartableTitle,FinalizeLetter, ForwardLetter, QuickAccess, FastSend, SearchResultDetails}
})
export default class MainWindow extends Vue {
    selectedLetter: Letter = {} as Letter;
    selectedSearchResult: LetterSearchResult = {} as LetterSearchResult;
    noLetterSelected = true;
    letterOwnerId = '';
    leftSideMode = 'details';
    firstLoad = false;
    onSelectdLetterChanged(letter: Letter ){
        
        this.leftSideMode = 'details';
        this.noLetterSelected = false;
        const temp: any = {};
        Object.assign(temp,letter)
        this.selectedLetter = temp;
    }
    onSelectdSearchResultChanged(searchResult: LetterSearchResult){
        this.leftSideMode = 'searchResultDetails';
        this.noLetterSelected = false;
        const temp: any = {};
        Object.assign(temp,searchResult)
        this.selectedSearchResult = temp;
        this.selectedLetter = {} as Letter;
        this.selectedLetter.id = this.selectedSearchResult.letterId;
        this.selectedLetter.title = this.selectedSearchResult.title;
        this.selectedLetter.abstract = this.selectedSearchResult.abstract;
        this.selectedLetter.letterPossessionId = this.selectedSearchResult.possessionId;
    }
    
    onLetterOwnerSet(){
        this.letterOwnerId = this.$store.state.ownerId;
    }
    onFinalizeLetter(letterId: string){
        this.leftSideMode = 'finalize';
    }

    onForwardLetter(possessionId: string){
        this.leftSideMode = 'forward';
        (this.$refs.letterlist as any).forwardLetter(possessionId);
    }
    onForwardCanceled(){
        this.leftSideMode = 'details';
    }
    onFastSendCanceled(){
        this.leftSideMode = 'details';
    }
    onFastSendBtnClick(mode: string){
        this.fastSendMode = mode;
        this.leftSideMode = 'fastSend';
    }
    async onFolderClicked(){
         await (this.$refs.letterlist as any).refresh();
    }

    onLetterClosedFast(possessionId: string){
         (this.$refs.letterlist as any).closeLetter(possessionId);
    }
    onClosedLetterRejected(possessionId: string){
        (this.$refs.letterlist as any).rejectCloseLetter(possessionId);
    }
    fastSendMode = '';
}
</script>

<style lang="less" scoped>
#main-container{
    display:flex;
    flex-direction:column;
    //height:-webkit-fill-available;
}

#child-container{
    display: flex;
    flex-direction: row;
    max-height:-webkit-fill-available;
    //overflow:auto;
    //height:100%;
}

</style>


