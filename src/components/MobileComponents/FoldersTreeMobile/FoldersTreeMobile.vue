<template >
    <div id="folders-container"  class="container2" style="display:flex;flex-direction:column;" >
        <FoldersTreeNodeMobile
        v-for="folder in folders"
        :data="folder"
        :key="folder.url"
        @folder-clicked="onFolderClicked($event)"
        >
        </FoldersTreeNodeMobile>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch} from 'vue-property-decorator';
import * as api from '@/store/api';
import * as letterOwnerService from '@/store/Services/letterOwnerService.ts';
import * as announcementBoardService from '@/store/Services/announcementBoardService.ts';
import {FoldersTreeNodeDataMobile} from './FoldersTreeNodeMobile/FoldersTreeNodeMobile.vue';
import FoldersTreeNodeMobile from './FoldersTreeNodeMobile/FoldersTreeNodeMobile.vue';
import { OwnerFolder } from '@/store/models/LetterOwner/OwnerFolder';
import { AnnouncementBoard } from '../../../store/models/AnnouncementBoard/AnnouncementBoard';
import { SendLetter } from '../../../store/Services/letterServices';

@Component({
    components:{FoldersTreeNodeMobile}
})
export default class FoldersTreeMobile extends Vue {
    @Prop() letterOwnerId?: string;
    @Watch('letterOwnerId')
    async onLetterOwnerChanged(){
        this.folders = [];
        if(this.letterOwnerId === undefined) return;
        const archiveFolders =  await letterOwnerService.getArchiveFolders(this.letterOwnerId);
        const announcementBoards = await announcementBoardService.getAccessibleAnnouncementBoards(this.letterOwnerId);

        //const cartableFolder = {} as FoldersTreeNodeData;
        //cartableFolder.name = "کارتابل نامه ها";
        //cartableFolder.isRoot = true;
        //cartableFolder.url = "Cartable";
        //cartableFolder.children = [];
        //cartableFolder.iconClass = {'icon-dashbord':true,'fixed-icon':true }
        const receiveLetters = {} as FoldersTreeNodeDataMobile;
        receiveLetters.name = 'نامه های دریافتی';
        receiveLetters.isSelected = true;
        receiveLetters.url = "ReceivedLettersMobile"
        receiveLetters.isRoot = false;
        receiveLetters.children = [];
        receiveLetters.iconClass = {'icon-inbox':true,'fixed-icon':true }
        const sentLetters = {} as FoldersTreeNodeDataMobile;
        sentLetters.name = 'نامه های ارسالی';
        sentLetters.url = "SentLettersMobile"
        sentLetters.isRoot = false;
        sentLetters.iconClass = {'icon-outbox':true,'fixed-icon':true }
        sentLetters.isSelected = false;
        sentLetters.children = [];
        //cartableFolder.children.push(receiveLetters,sentLetters);

        //const draftFolder = {} as FoldersTreeNodeData;
        //draftFolder.name = 'پیش نویس ها';
        //draftFolder.isRoot = true;
        //draftFolder.url = 'Drafts';
        //draftFolder.children = [];
        //draftFolder.iconClass = {'icon-allDraft':true,'fixed-icon':true};
        const savedDraft = {} as FoldersTreeNodeDataMobile;
        savedDraft.isRoot = false;
        savedDraft.name = 'پیش نویس های ثبت شده';
        savedDraft.url = 'DraftLettersMobile';
        savedDraft.iconClass = {'icon-drafts xxlarg-text':true,'fixed-icon':true};
        savedDraft.children = [];
        savedDraft.isSelected = false;
        //draftFolder.children.push(savedDraft);

        const archiveFoldersNode = {} as FoldersTreeNodeDataMobile;
        archiveFoldersNode.name = 'پوشه های طبقه بندی';
        archiveFoldersNode.isRoot = true;
        archiveFoldersNode.url = 'ArchiveFolders';
        archiveFoldersNode.iconClass = {'icon-allFolders':true,'fixed-icon':true }
        archiveFoldersNode.children = [];
        archiveFoldersNode.isSelected = false;
        this.addArchiveFolder(archiveFoldersNode,archiveFolders);

        const faxesNode = {} as FoldersTreeNodeDataMobile;
        faxesNode.name = 'فکس ها';
        faxesNode.isRoot = true;
        faxesNode.children = [];
        faxesNode.iconClass = {'icon-allFaxes':true,'fixed-icon':true};
        faxesNode.isSelected = false;
        const incommingFaxes = {} as FoldersTreeNodeDataMobile;
        incommingFaxes.name = 'فکس های دریافتی';
        incommingFaxes.isRoot = false;
        incommingFaxes.url = "IncommingFaxes";
        incommingFaxes.children = [];
        incommingFaxes.iconClass = {'icon-incommingFaxes':true,'fixed-icon':true};
        incommingFaxes.isSelected = false;
        const outgoingFaxes = {} as FoldersTreeNodeDataMobile;
        outgoingFaxes.name = 'فکس های دریافتی';
        outgoingFaxes.isRoot = false;
        outgoingFaxes.url = "OutgoingFaxes";
        outgoingFaxes.children = [];
        outgoingFaxes.iconClass = {'icon-outgoingFaxes':true,'fixed-icon':true};
        outgoingFaxes.isSelected = false;

        faxesNode.children.push(incommingFaxes,outgoingFaxes);
       
        const colosedLettersNode = {} as FoldersTreeNodeDataMobile;
        colosedLettersNode.name = 'نامه های مختومه';
        colosedLettersNode.isRoot = true;
        colosedLettersNode.url = 'ClosedLetters';
        colosedLettersNode.children = [];
        colosedLettersNode.iconClass = {'icon-allClosed':true,'fixed-icon':true};
        colosedLettersNode.isSelected =  false;
        const closedIncomingLetters = {} as FoldersTreeNodeDataMobile;
        closedIncomingLetters.name = 'نامه های مختومه دریافتی';
        closedIncomingLetters.isRoot = false;
        closedIncomingLetters.url = 'IncomingClosedLettersMobile';
        closedIncomingLetters.iconClass = {'icon-incommingClosed':true,'fixed-icon':true};
        closedIncomingLetters.children = [];    
        closedIncomingLetters.isSelected = false;

        const closedOutgoingLetters = {} as FoldersTreeNodeDataMobile;
        closedOutgoingLetters.name = 'نامه های مختومه ارسالی';
        closedOutgoingLetters.isRoot = false;
        closedOutgoingLetters.url = 'OutgoingClosedLettersMobile';
        closedOutgoingLetters.iconClass = {'icon-outgoingClosed':true,'fixed-icon':true};
        closedOutgoingLetters.children = [];
        closedIncomingLetters.isSelected = false;
        const announcementBoardsNode = {} as FoldersTreeNodeDataMobile;
        announcementBoardsNode.name = 'برد اعلانات و اسناد';
        announcementBoardsNode.isRoot = true;
        announcementBoardsNode.url = 'AnnouncementBoardsMobile';
        announcementBoardsNode.iconClass = {'icon-AnnouncementBoard':true,'fixed-icon':true }
        announcementBoardsNode.children = [];
        this.addAnnouncementBoard(announcementBoardsNode,announcementBoards);

        colosedLettersNode.children.push(closedIncomingLetters,closedOutgoingLetters);

        this.folders.push(receiveLetters,sentLetters,savedDraft,archiveFoldersNode,faxesNode,announcementBoardsNode,colosedLettersNode);
      
    }

    addArchiveFolder(parent: FoldersTreeNodeDataMobile, archiveFolders: OwnerFolder[]){
        archiveFolders.forEach(folder=>{
            const childNode = {} as FoldersTreeNodeDataMobile;
            childNode.name = folder.name;
            childNode.isRoot = false;
            childNode.iconClass = {'icon-folder':true,'fixed-icon':true};
            childNode.url = `FolderLettersMobile?folderId=${folder.id}`;
            childNode.children = [];
            childNode.isSelected = false;
            parent.children.push(childNode);
            if(folder.childFolders !== null && folder.childFolders != undefined)
                this.addArchiveFolder(childNode,folder.childFolders);
        });
    }

    addAnnouncementBoard(parent: FoldersTreeNodeDataMobile, announcementBoards: AnnouncementBoard[]){
        announcementBoards.forEach(board=>{
            const childNode = {} as FoldersTreeNodeDataMobile;
            childNode.name = board.name;
            childNode.isRoot = false;
            childNode.iconClass = {'icon-AnnouncementBoardChild':true,'fixed-icon':true};
            childNode.url = `AnnouncementBoardsMobile?boardId=${board.id}`;
            childNode.isSelected = false;
            childNode.children = [];
            parent.children.push(childNode);
            if(board.children !== null && board.children != undefined)
                this.addAnnouncementBoard(childNode,board.children);
        });
    }
    
    onFolderClicked(name: string){
        this.unSelectRecursive(this.folders,name);
        this.$emit('folder-clicked');
    }
    unSelectRecursive(folders: FoldersTreeNodeDataMobile[], name: string){
        folders.forEach(x=>
        {   if(x.name === name) {x.isSelected = true}
            else
                x.isSelected = false;   
            this.unSelectRecursive(x.children, name);
        });
    }
    folders: FoldersTreeNodeDataMobile[] = [];

    // created(){
       
    // }

    
    
}
</script>


<style lang="less" scoped>

    #folders-container{
        height: 100%;
        overflow: auto;
    }
    
</style>

