<template>
    <div class="tree-part-flexbox">        
        <div class="flex-part-top" style="flex: 1">
            <div class="container3">
                <div class="symmetric-grid">
                    <h4 class="highlight" v-if="isReceived">{{letter.sender.nameOnly}}</h4>
                    <div v-else>
                        <div v-for="receiver in letter.recievers" :key="receiver.id"><h4 class="highlight">{{receiver.nameOnly}}</h4> <br/></div>
                    </div>
                    <div>
                        <i @click="downloadLetterPdf()" class="helper-icon-large icon-pdf"></i>
                    </div>
                </div>
                <div>
                    <div>
                        {{letterTime}}
                    </div>
                    <div>
                        <LetterTrailTreeMobile :letterId="letter.letterPossessionId"></LetterTrailTreeMobile>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-part-middle" style="flex: 8">
            <div style="min-height:300px">
                <div class="symmetric-grid">
                    <div style="flex:2">
                        <div style="margin:10px">
                            توضیحات
                        </div>
                        <input list="list" @input="onCommentSelected()" v-model="comment" style="width: 100%">
                        <datalist id="list">
                        <option v-for="item in autoCompleteData" :key="item.id" :value="item.name" ></option>
                        </datalist>
                    </div>
                    <div style="flex:1">
                        <AttachmentEditorMobile/>
                    </div>
                </div>
                
                
                <div style="margin:10px">
                    پوشه های طبقه بندی
                </div>
                <div>
                  <div class="ui compact menu" style="width:100%;">
                    <div class="ui dropdown  item" style="width:100%; direction:ltr">
                      <i class="icon-dropdownArrow" style="right: 0"></i>
                      <div class="left menu" >
                        <div class="item">
                            <FoldersTreeNodeMobile
                            v-for="folder in folders"
                            :data="folder"
                            :key="folder.url"
                            :isSelectable= true
                            @selected-changed="onFolderSelectedChanged($event)"
                            >
                            </FoldersTreeNodeMobile>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <div  style="flex:.2 1 0;display:flex;flex-direction:column;align-items:strech" class="flex-part-bottom">
            <div style="flex:1; display:flex;justify-content:space-around" class="container5">
                <div style="flex:1;text-align: center;" class="action-icon" @click="finalize()" ><i class="icon-stamp" style="font-size:xx-large"></i></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { Letter } from '@/store/models/Letter/Letter';
import LetterTrailTreeMobile from '@/components/MobileComponents/LetterDetailsMobile/LetterTrailMobile/LetterTrailTreeMobile.vue';
import { saveFile, converBase64toBlob, getPersianDate } from '@/util/utils';
import * as fileService from '@/store/Services/fileService';
import * as $ from 'jquery';
import {FoldersTreeNodeData} from '@/components/Cartable/FoldersTree/FoldersTreeNode/FoldersTreeNode.vue';
import FoldersTreeNodeMobile from '@/components/MobileComponents/FoldersTreeMobile/FoldersTreeNodeMobile/FoldersTreeNodeMobile.vue';
import { OwnerFolder } from '@/store/models/LetterOwner/OwnerFolder';
import * as letterOwnerService from '@/store/Services/letterOwnerService.ts';
import * as letterService from '@/store/Services/letterServices.ts';
import * as autoCompleteDataService from '@/store/Services/autoCompleteDataService.ts';
import AttachmentEditorMobile from '@/components/MobileComponents/AttachmentEditorMobile/AttachmentEditorMobile.vue';

import store from '@/store';
import { AutoCompleteData } from '@/store/models/Letter/AutoCompleteData';
@Component({
    components: {LetterTrailTreeMobile, FoldersTreeNodeMobile, AttachmentEditorMobile}
})
export default class FinalizeLetter extends Vue{
@Prop() letter?: Letter
isReceived = true;
@Watch("letter")
onLetterChanged(newVal: Letter, oldVal: Letter){
        this.setIsReceived();
}
created(){
        this.setIsReceived();
}
get letterTime(){
        if(this.letter === undefined) return '';
        const date = new Date( this.letter.sendTime);
        date.setMinutes(date.getMinutes() - 270);
        return (date).toLocaleTimeString();
}

 setIsReceived(){
        this.isReceived = false;
        if(this.letter == undefined)return;
        if(this.letter.recievers === null)
            this.isReceived = true;
    }
   async downloadLetterPdf(){
        if(this.letter === undefined)return;
        if(this.letter.parts === undefined || this.letter.parts === null)return;
        const file = await fileService.getFile(this.letter.parts[0].file.id);
        const blob =  converBase64toBlob(file.content||"",'');
        saveFile(blob,file.extension);
    }
    autoCompleteData: AutoCompleteData[] = [];
    comment = "";
    async mounted(){
        this.autoCompleteData =  await autoCompleteDataService.getCloseAutoCompleteData();

        $('.ui.dropdown').dropdown({ action: 'nothing'  });
        this.loadArchiveFolders(); 
    }

    async loadArchiveFolders(){
        const archiveFolders =  await letterOwnerService.getArchiveFolders(store.state.ownerId);
        archiveFolders.forEach((folder,index)=>{
            const archiveFoldersNode = {} as FoldersTreeNodeData;
            archiveFoldersNode.name = folder.name;
            archiveFoldersNode.isRoot = true;
            archiveFoldersNode.url = folder.id;
            archiveFoldersNode.iconClass = {'icon-folder1':true,'fixed-icon':true }
            archiveFoldersNode.children = [];
            if(folder.childFolders !== undefined && folder.childFolders !== null)
                this.addArchiveFolder(archiveFoldersNode,folder.childFolders);
            this.folders.push(archiveFoldersNode);
        });
        
    }
    onCommentSelected(){
        const data =  this.autoCompleteData.find(item=>item.name === this.comment.trim());
        let autoCompleteDataId = '';
        if(data){
            autoCompleteDataId = data.id;
        }
    }
    addArchiveFolder(parent: FoldersTreeNodeData, archiveFolders: OwnerFolder[]){
        archiveFolders.forEach(folder=>{
            const childNode = {} as FoldersTreeNodeData;
            childNode.name = folder.name;
            childNode.isRoot = true;
            childNode.iconClass = {'icon-folder':true,'fixed-icon':true};
            childNode.url = folder.id;
            childNode.children = [];
            parent.children.push(childNode);
            if(folder.childFolders !== null && folder.childFolders != undefined)
                this.addArchiveFolder(childNode,folder.childFolders);
        });
    }
    folders: FoldersTreeNodeData[] = [];

    finalize(){
        if(this.letter)
            letterService.CloseLetter(this.letter.letterPossessionId,this.comment,this.selectedFolderIds);
    }

    onFolderSelectedChanged(selection: any){
        if(selection.isSelected)
        {
            this.selectedFolderIds.push(selection.id);
        }
        else{
            const index =  this.selectedFolderIds.indexOf(selection.id);
            this.selectedFolderIds.splice(index,1);
        }
    }

    selectedFolderIds: string[] = [];
}
</script>

<style lang="less" scoped>

</style>
