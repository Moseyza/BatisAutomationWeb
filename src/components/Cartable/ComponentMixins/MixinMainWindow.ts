import { Vue, Component, Prop, Mixins} from 'vue-property-decorator';
import * as api from '@/store/api';
import SingleCartableOwner from '@/components/Cartable/CartableOwner/SingleCartableOwner.vue';
import CartableTitle from '@/components/Cartable/CartableTitle/CartableTitle.vue';
import FoldersTree from '@/components/Cartable/FoldersTree/FoldersTree.vue';
import LetterDetails from '@/components/Cartable/LetterDetails/LetterDetails.vue';
import DraftDetails from '@/components/Cartable/DraftDetails/DraftDetails.vue';
import SearchResultDetails from '@/components/Cartable/LetterDetails/SearchResultDetails.vue';
import FinalizeLetter from '@/components/Cartable/LetterDetails/FinalizeLetter/FinalizeLetter.vue';
import { Letter } from '@/store/models/Letter/Letter';
import ForwardLetter from '@/components/Cartable/ForwardLetter/ForwardLetter.vue';
import QuickAccess from '@/components/Cartable/QuickAccess/QuickAccess.vue';
import FastSend from '@/components/Cartable/FastSend/FastSend.vue';
import {LetterSearchResult } from '@/store/models/Letter/LetterSearchResult';
import { DependentLetter } from '@/store/models/Letter/DependentLetter';
import { DraftLetter } from '@/store/models/Letter/DraftLetter';
import { EnterpriseForm } from '@/store/models/EnterpriseForm/EnterpriseForm';
import SendEnterpriseForm from '@/components/Cartable/EnterpriseForm/SendEnterpriseForm.vue';
import * as enterpriseFormService from '@/store/Services/enterpriseFormService';
import { NextFormInfo } from '@/store/models/EnterpriseForm/NextFormInfo';
import FullPageLoader from '@/components/UiComponents/FullPageLoader.vue';
import { getAllWorkflowsWithEnterpriseForms } from '@/store/Services/workflowService';
import store from '@/store';
import { DraftEnterpriseFormInfo } from '@/store/models/EnterpriseForm/LoadEnterpriseFormDraftResponse';
import ComponentMixinBase from './ComponentMixinBase';

@Component({
    components: { FoldersTree, LetterDetails, DraftDetails , CartableTitle,FinalizeLetter, ForwardLetter, QuickAccess, FastSend, SearchResultDetails, SendEnterpriseForm, FullPageLoader}
})
export default class MixinMainWindow extends Mixins(ComponentMixinBase) {
    selectedLetter: Letter = {} as Letter;
    selectedSearchResult: LetterSearchResult = {} as LetterSearchResult;
    noLetterSelected = true;
    letterOwnerId = '';
    leftSideMode = 'details';
    firstLoad = false;
    isLoading = false;
    shallShowMessage = false;
    public shallshowFastSend=false;
    interval = 0;
    message = '';
    created(){
        store.state.eventHub.$on('show-message',this.onShowMessage);
    }

    
    onShowMessage(message: string){
        this.message = message;
        this.shallShowMessage = true;
        this.interval =  setInterval(this.onMessageInterval,4000);
    }
    onMessageInterval(interval: number)
    {
        this.shallShowMessage = false;
        clearInterval(this.interval);
        
    }
    onSelectdLetterChanged(letter: Letter ){
        this.leftSideMode = 'details';
        this.noLetterSelected = false;
        const temp: any = {};
        Object.assign(temp,letter)
        this.selectedLetter = temp;
    }
    async onSelectdDraftChanged(letter: DraftLetter ){
        if(letter.isEnterpriseForm){
            const ownerId =  store.state.ownerId;
            const loadDraftEnterpriseFormRequest = {
                possessionId: letter.letterPossessionId,
                letterId: letter.id,
                formId: letter.enterpriseFormId,
                ownerId: ownerId
            }
            const draftFormInfo =  await enterpriseFormService.getDraftEnterpriseForm(loadDraftEnterpriseFormRequest);
            draftFormInfo.draftEnterpriseForm.enterpriseFormDto
            this.onEnterpriseFormSelected(draftFormInfo.draftEnterpriseForm.enterpriseFormDto,undefined,draftFormInfo);
        }
        else{
            this.leftSideMode = 'draftDetails';
            this.noLetterSelected = false;
            const temp: any = {};
            Object.assign(temp,letter)
            this.selectedLetter = temp;
        }
    }
    onSelectdSearchResultChanged(searchResult: LetterSearchResult){
        //this.leftSideMode = 'searchResultDetails';
        this.noLetterSelected = false;
        const temp: any = {};
        Object.assign(temp,searchResult)
        this.selectedSearchResult = temp;
        this.selectedLetter = {} as Letter;
        this.selectedLetter.id = this.selectedSearchResult.letterId;
        this.selectedLetter.title = this.selectedSearchResult.title;
        this.selectedLetter.abstract = this.selectedSearchResult.abstract;
        this.selectedLetter.letterPossessionId = this.selectedSearchResult.possessionId;
        this.selectedLetter.sender = this.selectedSearchResult.from;
        this.selectedLetter.recievers = this.selectedSearchResult.to;
        this.selectedLetter.comment = this.selectedSearchResult.comment;
        this.selectedLetter.isOpenned = this.selectedSearchResult.isOpenned;
        this.selectedLetter.letterNo = this.selectedSearchResult.letterNo;
        this.selectedLetter.isForwarded = this.selectedSearchResult.isForwarded;
        this.selectedLetter.letterReferences = this.selectedSearchResult.letterReferences;
        this.selectedLetter.sendTime = this.selectedSearchResult.sendTime;
        
        
        this.leftSideMode = 'details';
    }
    
    async onLetterOwnerSet(e: boolean){
        this.letterOwnerId = this.$store.state.ownerId;
        if(e){
            this.leftSideMode = "";
            await (this.$refs.letterlist as any).refresh();
        }
        
        
    }
    onFinalizeLetter(letterId: string){
        this.leftSideMode = 'finalize';
    }

    onForwardLetter(possessionId: string){
        this.leftSideMode = 'forward';
        //(this.$refs.letterlist as any).forwardLetter(possessionId);
    }
    onLetterForwarded(possessionId: string){
        (this.$refs.letterlist as any).forwardLetter(possessionId);
    }
    onForwardClosed(){
        this.leftSideMode = 'details';
    }
    onFastSendCanceled(){
        this.leftSideMode = 'details';
    }
    onFastSendBtnClick(mode: string){
        this.fastSendDependencies = [];
        this.fastSendMode = mode;
        this.leftSideMode = 'fastSend';
        this.shallshowFastSend=true;

    }
    async onFolderClicked(){
        this.leftSideMode = "";
         await (this.$refs.letterlist as any).refresh();
    }

    onLetterClosedFast(possessionId: string){
         (this.$refs.letterlist as any).closeLetter(possessionId);
    }
    onClosedLetterRejected(possessionId: string){
        (this.$refs.letterlist as any).rejectCloseLetter(possessionId);
    }
    fastSendDependencies: DependentLetter[] = [];
    sendFastDependOn(mode: string){
        this.fastSendMode = 'send';
        this.leftSideMode = 'fastSend';
        this.shallshowFastSend=true;
        const dependentLetter = {} as DependentLetter;
        dependentLetter.dependencyType = mode;
        dependentLetter.id = this.selectedLetter.id;
        dependentLetter.title = this.selectedLetter.title;
        dependentLetter.letterPossessionId = this.selectedLetter.letterPossessionId;
        dependentLetter.letterNo = this.selectedLetter.letterNo;
        dependentLetter.parts = [];
        if(this.selectedLetter.parts)
            dependentLetter.parts.push(...this.selectedLetter.parts);
        
        this.fastSendDependencies.length = 0;
        this.fastSendDependencies.push(dependentLetter);


    }
    fastSendMode = '';
    onDeleteLetter(){
        this.leftSideMode = '';
        (this.$refs.letterlist as  any).refresh();
        
    }
    selectedFrom: EnterpriseForm = {} as EnterpriseForm;
    maxLengthFormLabel = '';
    maxLengthTableLabel = '';
    maxFormLabelWidth = 0;
    maxTableLabelWidth = 0;
    shallShowSendEnterpriseForm = false;
    onEnterpriseFormSelected(form: EnterpriseForm,nextFormInfo?: NextFormInfo,draftFormInfo?: DraftEnterpriseFormInfo){
        
            this.nextFormInfo = nextFormInfo;
            this.draftFormInfo = draftFormInfo;
        if(form.bookmarks){
            form.bookmarks.forEach(bm=>
            {
                if(this.maxLengthFormLabel.length <  bm.persianName.length && bm.isVisibleInSend)
                    this.maxLengthFormLabel = bm.persianName;
                if(bm.type === 18 && bm.tableColumns) //bookmark is a table
                    bm.tableColumns.forEach(tabelColumn => {
                        if(tabelColumn &&  tabelColumn.persianName.length > this.maxLengthTableLabel.length && tabelColumn.isVisible){
                            this.maxLengthTableLabel = tabelColumn.persianName;
                        }
                    });
            });
        }
        this.selectedFrom = form;
        this.shallShowSendEnterpriseForm = true;
        this.leftSideMode = "";
    }

    updated(){
        if(this.maxLengthFormLabel !== ''){
            this.maxFormLabelWidth = (this.$refs.formlabel as any).clientWidth;
            this.maxLengthFormLabel = '';
        }
        if(this.maxLengthTableLabel !==''){
            this.maxTableLabelWidth = (this.$refs.tablelabel as any).clientWidth;
            this.maxLengthTableLabel = '';
            
        }
        if(this.shallShowSendEnterpriseForm){
            this.shallShowSendEnterpriseForm = false;
            this.leftSideMode = 'enterpriseForm';
        }
        this.isLoading = false;
    }
    onSendFormClose(isNextForm: boolean){
        if(isNextForm){
            const possessionId =  this.selectedLetter.letterPossessionId;
            this.onLetterForwarded(possessionId);
        }
        this.clearLeftSide();
    }

   

    clearLeftSide(){
        this.leftSideMode = '';
    }
    nextFormInfo?: NextFormInfo;
    draftFormInfo?: DraftEnterpriseFormInfo;
    async onNextFormSelected(nextFormRequest: any){
        this.isLoading = true;
        const nextFormInfo = await  enterpriseFormService.getNextForm(nextFormRequest);
        this.onEnterpriseFormSelected(nextFormInfo.enterpriseForm,nextFormInfo,undefined);
    }
     
}