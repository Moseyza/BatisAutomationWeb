<template >
    <div id="folders-container" class="container2">
        <FoldersTreeNode
        v-for="folder in folders"
        :data="folder"
        :key="folder.url"
        >
        </FoldersTreeNode>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch} from 'vue-property-decorator';
import * as api from '@/store/api';
import * as letterOwnerService from '@/store/Services/letterOwnerService.ts';
import {FoldersTreeNodeData} from './FoldersTreeNode/FoldersTreeNode.vue';
import FoldersTreeNode from './FoldersTreeNode/FoldersTreeNode.vue';
import { OwnerFolder } from '@/store/models/LetterOwner/OwnerFolder';

@Component({
    components:{FoldersTreeNode}
})
export default class FoldersTree extends Vue {
    @Prop() letterOwnerId?: string;
    @Watch('letterOwnerId')
    async onLetterOwnerChanged(){
        if(this.letterOwnerId === undefined) return;
        const archiveFolders =  await letterOwnerService.getArchiveFolders(this.letterOwnerId);

         const cartableFolder = {} as FoldersTreeNodeData;
        cartableFolder.name = "کارتابل نامه ها";
        cartableFolder.isRoot = true;
        cartableFolder.url = "Cartable";
        cartableFolder.children = [];
        cartableFolder.iconClass = {'icon-drawer':true,'fixed-icon':true }
        const receiveLetters = {} as FoldersTreeNodeData;
        receiveLetters.name = 'نامه های دریافتی';
        receiveLetters.url = "ReceivedLetters"
        receiveLetters.isRoot = false;
        receiveLetters.children = [];
        receiveLetters.iconClass = {'icon-outbox':true,'fixed-icon':true }
        const sentLetters = {} as FoldersTreeNodeData;
        sentLetters.name = 'نامه های ارسالی';
        sentLetters.url = "SentLetters"
        sentLetters.isRoot = false;
        sentLetters.iconClass = {'icon-outbox':true,'fixed-icon':true }
        sentLetters.children = [];
        cartableFolder.children.push(receiveLetters,sentLetters);

        const draftFolder = {} as FoldersTreeNodeData;
        draftFolder.name = 'پیش نویس ها';
        draftFolder.isRoot = true;
        draftFolder.url = 'Drafts';
        draftFolder.children = [];
        draftFolder.iconClass = {'icon-clipboard':true,'fixed-icon':true};
        const savedDraft = {} as FoldersTreeNodeData;
        savedDraft.isRoot = false;
        savedDraft.name = 'پیش نویس های ثبت شده';
        savedDraft.url = 'DraftLetters';
        savedDraft.iconClass = {'icon-form':true,'fixed-icon':true};
        savedDraft.children = [];
        draftFolder.children.push(savedDraft);

        const archiveFoldersNode = {} as FoldersTreeNodeData;
        archiveFoldersNode.name = 'پوشه های طبقه بندی';
        archiveFoldersNode.isRoot = true;
        archiveFoldersNode.url = 'ArchiveFolders';
        archiveFoldersNode.iconClass = {'icon-folder1':true,'fixed-icon':true }
        archiveFoldersNode.children = [];
        this.addArchiveFolder(archiveFoldersNode,archiveFolders);

        const faxesNode = {} as FoldersTreeNodeData;
        faxesNode.name = 'فکس ها';
        faxesNode.isRoot = true;
        faxesNode.children = [];
        faxesNode.iconClass = {'icon-fax':true,'fixed-icon':true};
       
        const colosedLettersNode = {} as FoldersTreeNodeData;
        colosedLettersNode.name = 'نامه های مختومه';
        colosedLettersNode.isRoot = true;
        colosedLettersNode.url = 'ClosedLetters';
        colosedLettersNode.children = [];
        colosedLettersNode.iconClass = {'icon-stamp':true,'fixed-icon':true};

        const closedIncomingLetters = {} as FoldersTreeNodeData;
        closedIncomingLetters.name = 'نامه های مختومه دریافتی';
        closedIncomingLetters.isRoot = false;
        closedIncomingLetters.url = 'IncomingClosedLetters';
        closedIncomingLetters.iconClass = {'icon-letterStamp':true,'fixed-icon':true};
        closedIncomingLetters.children = [];

        const closedOutgoingLetters = {} as FoldersTreeNodeData;
        closedOutgoingLetters.name = 'نامه های مختومه ارسالی';
        closedOutgoingLetters.isRoot = false;
        closedOutgoingLetters.url = 'OutgoingClosedLetters';
        closedOutgoingLetters.iconClass = {'icon-letterStamp':true,'fixed-icon':true};
        closedOutgoingLetters.children = [];

        colosedLettersNode.children.push(closedIncomingLetters,closedOutgoingLetters);

        this.folders.push(cartableFolder,draftFolder,archiveFoldersNode,faxesNode,colosedLettersNode);
      
    }

    addArchiveFolder(parent: FoldersTreeNodeData, archiveFolders: OwnerFolder[]){
        archiveFolders.forEach(folder=>{
            const childNode = {} as FoldersTreeNodeData;
            childNode.name = folder.name;
            childNode.isRoot = false;
            childNode.iconClass = {'icon-folder':true,'fixed-icon':true};
            childNode.url = `FolderLetters?folderId=${folder.id}`;
            childNode.children = [];
            parent.children.push(childNode);
            if(folder.childFolders !== null && folder.childFolders != undefined)
                this.addArchiveFolder(childNode,folder.childFolders);
        });
    }

    folders: FoldersTreeNodeData[] = [];

    // created(){
       
    // }

    
    
}
</script>


<style lang="less" scoped>

    #folders-container{
        height: 100%;
    }
    
</style>

