import * as api from '@/store/api';
import { OwnerFolder } from '@/store/models/LetterOwner/OwnerFolder';

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
