<template>
    <div class="three-part-flexbox" id="main-container">
        <CartableTitleMobile @on-letter-owner-set="onLetterOwnerSet($event)" class="flex-part-top" style="flex: 0 1 auto" />
        <div ref="formlabel" style="position:absolute">{{maxLengthFormLabel}}</div> 
        <div ref="tablelabel" style="position:absolute">{{maxLengthTableLabel}}</div> 
        <div class="container3 flex-part-middle" id="child-container"  style="flex: 18 1 0%;overflow: hidden;">
            <div style="width: 100%;height: 100%;display: flex;flex-direction: column;">
             <!-- <div class="fill-parent" data-b-content="{Binding mainWindowViewModel,ViewSelector:viewSelector}"></div> -->
                <div class="ui top attached menu">
                    <a class="item sidebarButton" style="color: var(--Text);">
                        <i class="sidebar icon" style="color: var(--Text);"></i> Menu
                    </a>
                    <!-- <div style="display:flex;width:100%;" @click="shallHideletterList"> -->
                    <div style="display:flex;width:100%;">
                        <!-- <QuickAccessMobile @shallShowenterpriseFormListsEvent="showOfficeFormlist()" @fast-send-clicked="onFastSendBtnClick($event)" @enterprise-form-selected-Mobile="onEnterpriseFormSelected($event,null,null)"/> -->
                        <QuickAccessMobile @shallShowenterpriseFormListsEvent="showOfficeFormlist()" @fast-send-clicked="onFastSendMobileBtnClick($event)" />
                    </div>
                </div>
                <div class="ui bottom attached segment pushable mobileBottomSegmant" style="background: transparent !important; height: 100%;flex:1">
                    <div class="ui inverted labeled icon inline vertical right sidebar mainWindowMobile menu mobilesidebar" style="width: 70%;">
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
                        <div class="" style="background: transparent !important;padding: 0;height: 100%;width:100%">
                            <div class="container2"  style="height:100%;width:100%;display: flex;margin:0;">
                                <transition name="fade">
                                    <div v-if="shallShowMessage" class="ui green message">{{message}}</div>
                                </transition>
                                <div v-if="shallshowparentcomponent==false && shallShowLetterListRouter==true" style="height: 100%;width: 100%;flex: 1;">
                                    <LetterDetailsMobile style="flex:1;"  v-if="(noLetterSelected == false && leftSideMode==='details')" :letter="selectedLetter" 
                                    :searchResult="selectedSearchResult"
                                    @finalize-letter="onFinalizeLetter($event)"
                                    @returnToParentPage="onReturnToParentPage($event)"
                                    @forward-letter="onForwardLetter($event)"
                                    @letter-closed-fast="onLetterClosedFast($event)"
                                    @closed-letter-rejected="onClosedLetterRejected($event)"
                                    @send-fast-dependon="sendFastDependOn($event)"
                                    @next-form-selected="onNextFormSelected($event)"
                                    >
                                    </LetterDetailsMobile>
                                </div>
                               
                                <DraftDetails style="width:100%"
                                v-if="noLetterSelected == false && leftSideMode==='draftDetails'" 
                                :letter="selectedLetter" 
                                @delete-letter="onDeleteLetter($event)"
                                >
                                </DraftDetails>
                                <SearchResultDetails style="width:100%" v-else-if="noLetterSelected == false && leftSideMode==='searchResultDetails'" :searchResult="selectedSearchResult"
                                @finalize-letter="onFinalizeLetter($event)"
                                @forward-letter="onForwardLetter($event)"
                                >
                                </SearchResultDetails >
                                <FinalizeLetter style="width:100%" v-else-if="leftSideMode=== 'finalize'" :letter="selectedLetter"  />
                                <ForwardLetterMobile style="width:100%" v-else-if="leftSideMode=== 'forward'" @forward-closed="onForwardClosed" @forward-done="onLetterForwarded($event)" :letter="selectedLetter" />
                                <FastSendMobile  style="width:100%" :mode="fastSendMode" v-else-if="leftSideMode=== 'fastSend' && shallshowFastSend==true"  @fastsend-canceled="onFastSendCanceledMobile($event)"  :dependentLetters="fastSendDependencies" />
                                <SendEnterpriseFormMobile  style="width:100%" v-else-if="leftSideMode=== 'enterpriseForm'" @shallShowenterpriseFormListsEvent="showOfficeFormlist()" @sendform-close="onSendFormCloseMobile($event)" :form="selectedFrom" :nextFormInfo="nextFormInfo" :tableLblWidth="maxTableLabelWidth" :formLblWidth="maxFormLabelWidth" :draftFormInfo="draftFormInfo" />
                                <EnterpriseFormLists style="width:100%"  v-else-if="leftSideMode=== 'enterpriseFormLists'"  @enterprise-form-selected-Mobile="onEnterpriseFormMobileSelected($event,null,null)" />
                                <!-- <LetterListRouterView  v-else-if="leftSideMode=== 'letterListRouterView'"  @set-selectdLetterChanged-letterListView="onSetSelectdLetterChangedLetterListView($event)" @set-selectdDraftChanged-letterListView="onSetSelectdDraftChangedLetterListView($event)" @set-selectdSearchResultChanged-letterListView="onSetSelectdSearchResultChangedLetterListView($event)"/> -->
                                <LetterListRouterView  v-show="shallshowparentcomponent==true && shallShowLetterListRouter==false" ref="letterlist"  @set-selectdLetterChanged-letterListView="onSetSelectdLetterChangedLetterListView($event)" @set-selectdDraftChanged-letterListView="onSetSelectdDraftChangedLetterListView($event)" @set-selectdSearchResultChanged-letterListView="onSetSelectdSearchResultChangedLetterListView($event)"/>
                            </div>
                        </div>
                    </div>
                </div>
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
import { EnterpriseForm } from '@/store/models/EnterpriseForm/EnterpriseForm';
import { NextFormInfo } from '@/store/models/EnterpriseForm/NextFormInfo';
import { DraftEnterpriseFormInfo } from '@/store/models/EnterpriseForm/LoadEnterpriseFormDraftResponse';
import router from '@/router';
import SendEnterpriseFormMobile from '@/components/MobileComponents/EnterpriseFormMobile/SendEnterpriseFormMobile.vue';
import FastSendMobile from '@/components/MobileComponents/FastSendMobile/FastSendMobile.vue';
import ForwardLetterMobile from '@/components/MobileComponents/ForwardLetterMobile/ForwardLetterMobile.vue';


@Component({
    components:{ForwardLetterMobile,FastSendMobile,CartableTitleMobile,QuickAccessMobile,FoldersTreeMobile,LetterDetailsMobile,EnterpriseFormLists,LetterListRouterView,SendEnterpriseFormMobile}
})
export default class MainWindowMobile extends Mixins(MixinMainWindow) {

    shallShowenterpriseFormLists=false;
    shallShowLetterListRouter=false;
    shallshowparentcomponent=true;
     async mounted(){
    //    alert("test");
           $('.mainWindowMobile').sidebar({
            context: $('.bottom.segment')
          }).sidebar('attach events','.sidebarButton')
          .sidebar('setting', 'mobileTransition', 'overlay')
          ;
        //   await (this.$refs.letterlist as any).refresh();
    }
    //  mounted(){
    //    alert("test");
    //        $('.ui.sidebar').sidebar({
    //         context: $('.bottom.segment')
    //       }).sidebar('attach events','.sidebarButton').sidebar('setting', 'mobileTransition', 'overlay');
    //       window.addEventListener("keydown", function(event:any) {
    //         let str = "KeyboardEvent: key='" + event.key + "' | code='" +
    //                     event.code + "'";
    //                 if(event.code=='Backspace'){
    //                     alert(event.code);
    //                     router.replace("ReceivedLettersMobile");
    //                 }
    //     }.bind(this), true);
    // }
    // created(){
    //     window.addEventListener("hashchange", function(e) {
    //     if(e.oldURL.length > e.newURL.length)
    //         alert("back")   
    //     });
    // }
    onSetSelectdLetterChangedLetterListView(letter: Letter){
        this.shallshowparentcomponent=false;
        this.shallShowLetterListRouter=true;
        this.onSelectdLetterChanged(letter);
    }

    async onSetSelectdDraftChangedLetterListView(letter: DraftLetter){
        this.onSelectdDraftChanged(letter);
    }

    onEnterpriseFormMobileSelected(form: EnterpriseForm,nextFormInfo?: NextFormInfo,draftFormInfo?: DraftEnterpriseFormInfo){
        this.onEnterpriseFormSelected(form,nextFormInfo,draftFormInfo)
    }

    onSetSelectdSearchResultChangedLetterListView(searchResult: LetterSearchResult){
        this.onSelectdSearchResultChanged(searchResult);
    }

    showOfficeFormlist(){
        this.shallShowenterpriseFormLists=true;
        this.leftSideMode = 'enterpriseFormLists';
        this.shallshowparentcomponent=false;
    }
    async onFolderMobileClicked(){
        this.onReturnToParentPage();
        this.leftSideMode = "letterListRouterView";
         $('.ui.sidebar').hide("500");
            store.state.eventHub.$emit('refreshFeedEvent')
        //  $('.ui.sidebar').fadeOut( "slow" );
        //  await (this.$refs.letterlist as any).refresh();
    }

   onFastSendMobileBtnClick(mode: string){
       this.shallshowparentcomponent=false;
       this.onFastSendBtnClick(mode)
   }

    onReturnToParentPage(){
        this.shallShowLetterListRouter=false;
        this.shallshowparentcomponent=true;
    }

    onSendFormCloseMobile(isNextForm: boolean){
        this.onSendFormClose(isNextForm);
        this.shallshowparentcomponent=true;
        this.shallshowFastSend=false;        
        // this.$router.replace('ReceivedLettersMobile');
        // this.$router.push('LetterDetailsMobile');
    }

    onFastSendCanceledMobile(){
        this.shallshowparentcomponent=true;
        this.shallshowFastSend=false;        
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


