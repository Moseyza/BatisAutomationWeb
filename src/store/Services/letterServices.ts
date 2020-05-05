import * as api from '@/store/api';
import { LetterTrail } from '@/store/models/Letter/LetterTrail';
import { Letter } from '@/store/models/Letter/Letter';
import LetterListerWithPaginationResult from '@/store/models/Letter/LetterListerWithPaginationResult';
import store from '@/store';

export async function OpenLetter(letterPossessionId: string){
    const serverResult =  await api.batisAutomationApi.post("/Letters/OpenLetter",{letterPossessionId: letterPossessionId});

}

export async function GetLetterTrial(letterPossessionId: string): Promise<LetterTrail>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/Letters/LetterTrail",{letterPossessionId: letterPossessionId});
        return serverResult.data as LetterTrail;
    } catch (error) {
        console.log(error);
        return {} as LetterTrail;
    }
   

}

export async function GetArchiveFolderLetters(folderId: string): Promise<Letter[]>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/ArchiveFolders/Letters",{folderId: folderId});
        return serverResult.data as Letter[];
    } catch (error) {
        console.log(error);
        return {} as Letter[];
    }
   

}

export async function GetIncomingClosedLetters(from?: Date, to?: Date): Promise<LetterListerWithPaginationResult>
{
    try {
        const serverResult =  await api.batisAutomationApi.post("/IncomingClosedLetters",{ownerId:store.state.ownerId , from: from, to: to});
        return serverResult.data as LetterListerWithPaginationResult;
    } catch (error) {
        console.log(error);
        return {} as LetterListerWithPaginationResult;
    }
}


export async function GetOutgoingClosedLetters(from?: Date, to?: Date): Promise<LetterListerWithPaginationResult>
{
    try {
        const serverResult =  await api.batisAutomationApi.post("/OutgoingClosedLetters",{ownerId:store.state.ownerId , from: from, to: to});
        return serverResult.data as LetterListerWithPaginationResult;
    } catch (error) {
        console.log(error);
        return {} as LetterListerWithPaginationResult;
    }
}