<template>
    <div class="three-part-flexbox" id="main-container">
        <div ref="formlabel" style="position:absolute">{{maxLengthFormLabel}}</div> 
        <div ref="tablelabel" style="position:absolute">{{maxLengthTableLabel}}</div> 
        <CartableTitle @on-letter-owner-set="onLetterOwnerSet($event)" class="flex-part-top" style="flex: 0 1 auto" />
        <div class="container3 flex-part-middle" id="child-container"  style="flex: 18 1 0%;overflow: hidden;">
            <div style="flex:2;">
                <div class="three-part-flexbox">
                    <div class="flex-part-top" style="flex: 0 0 auto;display:flex;">
                            <QuickAccess  @fast-send-clicked="onFastSendBtnClick($event)" @enterprise-form-selected="onEnterpriseFormSelected($event,null,null)"/>
                    </div>
                    <div class="flex-part-middle">
                        <FoldersTree :letterOwnerId="letterOwnerId" @folder-clicked="onFolderClicked()"></FoldersTree>
                    </div>
                    <div class="flex-part-bottom" style="flex: 0 1 auto;"></div>
                </div>
            </div>
            <div class="conatiner2" style="flex:3">
                <router-view 
                @selected-letter-changed="onSelectdLetterChanged($event)" 
                @selected-draft-changed="onSelectdDraftChanged($event)"
                @selected-searchresult-changed="onSelectdSearchResultChanged($event)" 
                ref='letterlist'>
                </router-view>
            </div>
            <div class="container2" style="flex:6">
                <transition name="fade">
                    <div v-if="shallShowMessage" class="ui green message">{{message}}</div>
                </transition>
                
                <LetterDetails v-if="noLetterSelected == false && leftSideMode==='details'" :letter="selectedLetter" 
                :searchResult="selectedSearchResult"
                @finalize-letter="onFinalizeLetter($event)"
                @forward-letter="onForwardLetter($event)"
                @letter-closed-fast="onLetterClosedFast($event)"
                @closed-letter-rejected="onClosedLetterRejected($event)"
                @send-fast-dependon="sendFastDependOn($event)"
                @next-form-selected="onNextFormSelected($event)"
                >
                </LetterDetails>
                <DraftDetails 
                v-if="noLetterSelected == false && leftSideMode==='draftDetails'" 
                :letter="selectedLetter" 
                @delete-letter="onDeleteLetter($event)"
                >
                </DraftDetails>
                <SearchResultDetails v-else-if="noLetterSelected == false && leftSideMode==='searchResultDetails'" :searchResult="selectedSearchResult"
                @finalize-letter="onFinalizeLetter($event)"
                @forward-letter="onForwardLetter($event)"
                 >
                </SearchResultDetails>
                <FinalizeLetter v-else-if="leftSideMode=== 'finalize'" :letter="selectedLetter"  />
                <ForwardLetter v-else-if="leftSideMode=== 'forward'" @forward-closed="onForwardClosed" @forward-done="onLetterForwarded($event)" :letter="selectedLetter" />
                <FastSend :mode="fastSendMode" v-else-if="leftSideMode=== 'fastSend'" @fastsend-canceled="onFastSendCanceled($event)"  :dependentLetters="fastSendDependencies" />
                <SendEnterpriseForm  v-else-if="leftSideMode=== 'enterpriseForm'" @sendform-close="onSendFormClose($event)" :form="selectedFrom" :nextFormInfo="nextFormInfo" :tableLblWidth="maxTableLabelWidth" :formLblWidth="maxFormLabelWidth" :draftFormInfo="draftFormInfo" />
            </div>
            
        </div>
        <div class="flex-part-bottom container2" style="flex: 0 1 auto;direction:ltr;font-size:x-small;">
            Batis idea processors. All rights reserved ©
        </div>
        <!-- <FullPageLoader :isActive="isLoading"/> -->
    </div>
</template>

<script lang="ts">
import MixinMainWindow from '@/components/Cartable/ComponentMixins/MixinMainWindow';
import {Component, Mixins} from 'vue-property-decorator'


@Component
export default class MainWindow extends Mixins(MixinMainWindow) {
   
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .8s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>


