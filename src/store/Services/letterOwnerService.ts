import * as api from '@/store/api';
import { OwnerFolder } from '@/store/models/LetterOwner/OwnerFolder';
import { LetterOwner } from '@/store/models/LetterOwner/LetterOwner';
import { LetterOwnerWithFaxAndEmails } from '@/store/models/LetterOwner/LetterOwnerWithFaxAndEmails';

export async function getArchiveFolders(ownerId: string): Promise<OwnerFolder[]>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/LetterOwners/ArchiveFolders",{ownerId: ownerId});
        return serverResult.data as OwnerFolder[];
    } 
    catch (error) {
        console.log(error);
        return {} as OwnerFolder[];    
    }
}

export async function getOwnerRecipients(ownerId: string): Promise<LetterOwnerWithFaxAndEmails[]>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/LetterOwners/Recipients",{ownerId: ownerId});
        return serverResult.data as LetterOwnerWithFaxAndEmails[];
    } 
    catch (error) {
        console.log(error);
        return {} as LetterOwnerWithFaxAndEmails[];    
    }
}

