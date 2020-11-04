<template>
    <div class="three-part-flexbox" id="main-container">
        <CartableTitleMobile @on-letter-owner-set="onLetterOwnerSet($event)" class="flex-part-top" style="flex: 0 1 auto" />
        <div ref="formlabel" style="position:absolute">{{maxLengthFormLabel}}</div> 
        <div ref="tablelabel" style="position:absolute">{{maxLengthTableLabel}}</div> 
        <div class="container3 flex-part-middle" id="child-container"  style="flex: 18 1 0%;overflow: hidden;">
            <div style="width: 100%;height: 100%;">
             <!-- <div class="fill-parent" data-b-content="{Binding mainWindowViewModel,ViewSelector:viewSelector}"></div> -->
             <div class="ui top attached menu">
                <a class="item sidebarButton" style="color: var(--Text);">
                    <i class="sidebar icon" style="color: var(--Text);"></i> Menu
                </a>
                <!-- <div style="display:flex;width:100%;" @click="shallHideletterList"> -->
                <div style="display:flex;width:100%;">
                    <QuickAccessMobile @shallShowenterpriseFormListsEvent="showOfficeFormlist()" @fast-send-clicked="onFastSendBtnClick($event)" @enterprise-form-selected-Mobile="onEnterpriseFormSelected($event,null,null)"/>
                </div>
             </div>
            <div class="ui bottom attached segment" style="background: transparent !important; height: 100%;">
                <div class="ui inverted labeled icon inline vertical top sidebar menu" style="height: 100% !important;">
                    <div style="display: flex;flex-direction: column; height: 100%;background: var(--Header);">
                        <div class="three-part-flexbox">
                            <div class="flex-part-middle">
                                <FoldersTreeMobile :letterOwnerId="letterOwnerId" @folder-clicked="onFolderMobileClicked()"></FoldersTreeMobile>
                            </div>
                            <div class="flex-part-bottom" style="flex: 0 1 auto;"></div>
                        </div>
                    </div>
                </div>
                <div class="pusher" style="display: flex;height:100%">
                    <div class="" style="background: transparent !important;padding: 0;width: 100%;height: 100%;">
                        <div class="container2"  style="height:100%">
                            <transition name="fade">
                                <div v-if="shallShowMessage" class="ui green message">{{message}}</div>
                            </transition>
                            <LetterDetailsMobile v-if="noLetterSelected == false && leftSideMode==='details'" :letter="selectedLetter" 
                            :searchResult="selectedSearchResult"
                            @finalize-letter="onFinalizeLetter($event)"
                            @forward-letter="onForwardLetter($event)"
                            @letter-closed-fast="onLetterClosedFast($event)"
                            @closed-letter-rejected="onClosedLetterRejected($event)"
                            @send-fast-dependon="sendFastDependOn($event)"
                            @next-form-selected="onNextFormSelected($event)"
                            >
                            </LetterDetailsMobile>
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
                            <EnterpriseFormLists  v-else-if="leftSideMode=== 'enterpriseFormLists'"  />
                            <LetterListRouterView  v-else-if="leftSideMode=== 'letterListRouterView'"  @set-selectdLetterChanged-letterListView="onSetSelectdLetterChangedLetterListView($event)" @set-selectdDraftChanged-letterListView="onSetSelectdDraftChangedLetterListView($event)" @set-selectdSearchResultChanged-letterListView="onSetSelectdSearchResultChangedLetterListView($event)"/>
                        </div>
                        <!-- <div v-show="shallShowLetterList"> -->
                        <!-- <div style="height:100%">
                            <router-view 
                                @selected-letter-changed="onSelectdLetterChanged($event)" 
                                @selected-draft-changed="onSelectdDraftChanged($event)"
                                @selected-searchresult-changed="onSelectdSearchResultChanged($event)" 
                                ref='letterlist'>
                            </router-view>
                        </div> -->
                        <!-- <div v-show="shallOfficeFormlist" class="ui center menu" > -->
                       
                    </div>
                </div>
             </div>
           </div>
        </div>
        <!-- <div class="flex-part-bottom container2" style="flex: 0 1 auto;direction:ltr;font-size:x-small;">
            Batis idea processors. All rights reserved ©
        </div> -->
        <!-- <FullPageLoader :isActive="isLoading"/> -->
        
    </div>
</template>


<script lang="ts">
import MixinMainWindow from '@/components/Cartable/ComponentMixins/MixinMainWindow';
import CartableTitleMobile from '@/components/MobileComponents/CartableTitleMobile/CartableTitleMobile.vue';
import QuickAccessMobile from '@/components/MobileComponents/QuickAccessMobile/QuickAccessMobile.vue';
import FoldersTreeMobile from '@/components/MobileComponents/FoldersTreeMobile/FoldersTreeMobile.vue';
import LetterDetailsMobile from '@/components/MobileComponents/LetterDetailsMobile/LetterDetailsMobile.vue';
import EnterpriseFormLists from '@/components/MobileComponents/EnterpriseFormLists/EnterpriseFormLists.vue';
import LetterListRouterView from '@/components/MobileComponents/LetterListRouterView/LetterListRouterView.vue';
import store from '@/store';
import {LetterSearchResult } from '@/store/models/Letter/LetterSearchResult';
import * as enterpriseFormService from '@/store/Services/enterpriseFormService';
import {Component, Mixins, Watch} from 'vue-property-decorator';
import * as $ from 'jquery';
import {Letter} from '@/store/models/Letter/Letter';
import { DraftLetter } from '@/store/models/Letter/DraftLetter';


@Component({
    components:{CartableTitleMobile,QuickAccessMobile,FoldersTreeMobile,LetterDetailsMobile,EnterpriseFormLists,LetterListRouterView}
})
export default class MainWindowMobile extends Mixins(MixinMainWindow) {

    // shallShowLetterList = true;
    shallShowenterpriseFormLists=false
     mounted(){
       alert("test");
           $('.ui.sidebar').sidebar({
            context: $('.bottom.segment')
          }).sidebar('attach events','.sidebarButton').sidebar('setting', 'mobileTransition', 'overlay');
    }
    onSetSelectdLetterChangedLetterListView(letter: Letter){
       this.onSelectdLetterChanged(letter);
    }

    async onSetSelectdDraftChangedLetterListView(letter: DraftLetter){
        this.onSelectdDraftChanged(letter);
    }

    onSetSelectdSearchResultChangedLetterListView(searchResult: LetterSearchResult){
        this.onSelectdSearchResultChanged(searchResult);
    }

    showOfficeFormlist(){
        this.shallShowenterpriseFormLists=true;
        this.leftSideMode = 'enterpriseFormLists';
    }
    async onFolderMobileClicked(){
        this.leftSideMode = "letterListRouterView";
         await (this.$refs.letterlist as any).refresh();
    }
   
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


