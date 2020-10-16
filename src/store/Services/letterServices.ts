import * as api from '@/store/api';
import { LetterTrail } from '@/store/models/Letter/LetterTrail';
import { Letter } from '@/store/models/Letter/Letter';
import LetterListerWithPaginationResult from '@/store/models/Letter/LetterListerWithPaginationResult';
import store from '@/store';
import { LetterOwnerWithSendingInformationAndAttachments } from '@/store/models/LetterOwner/LetterOwnerWithSendingInformationAndAttachments';
import SentLetterInformation, { SendLetterAndSaveDraftResults } from '@/store/models/Letter/SentLetterInformation';
import { LetterTrailWithAttachments } from '../models/Letter/LetterTrailWithAttachment';
import { LetterSearchResult } from '../models/Letter/LetterSearchResult';
import letterSearch from '../models/Letter/letterSearch';

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

export async function GetLetterTrialWithAttachment(letterPossessionId: string,letterOwnerId: string): Promise<LetterTrailWithAttachments>{
    try {

        const serverResult =  await api.batisAutomationApi.post("/Letters/LetterTrailWithAttachment",{letterPossessionId: letterPossessionId, currentOwnerId: letterOwnerId});
        return serverResult.data as LetterTrailWithAttachments;
    } catch (error) {
        console.log(error);
        return {} as LetterTrailWithAttachments;
    }
}

export async function GetRemoteLetterTrail(letterPossessionId: string,letterOwnerId: string): Promise<LetterTrailWithAttachments> {
    try {
        const serverResult =  await api.batisAutomationApi.post("/Letters/RemoteLetterTrail",{letterPossessionId: letterPossessionId, ownerId: letterOwnerId});
        return serverResult.data as LetterTrailWithAttachments;
    } catch (error) {
        console.log(error);
        return {} as LetterTrailWithAttachments;
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


export async function CloseLetter(letterPossessionId: string,comment: string, acrchiveFolderIds: string[]){
    try {
        const serverResult =  await api.batisAutomationApi.post("/letters/Close",{letterPossessionId: letterPossessionId, comment: comment, archiveFolderIds: acrchiveFolderIds});
    } catch (error) {
        console.log(error);
    }
}

export async function CloseLetterFast(letterPossessionId: string){
    try {
        const serverResult =  await api.batisAutomationApi.post("/letters/CloseFast",{letterPossessionId: letterPossessionId});
    } catch (error) {
        console.log(error);
    }
}

export async function RejectClosedLetter(letterPossessionId: string){
    try {
        const serverResult =  await api.batisAutomationApi.post("/letters/RejectClosedLetter",{letterPossessionId: letterPossessionId});
    } catch (error) {
        console.log(error);
    }
}


export async function ForwardLetter(letterPossessionId: string, mainRecipients: LetterOwnerWithSendingInformationAndAttachments[], copyRecipients: LetterOwnerWithSendingInformationAndAttachments[]): Promise<SentLetterInformation>
{
   
    try {
        const serverResult =  await api.batisAutomationApi.post("/letters/Forward",{letterPossessionId: letterPossessionId, mainRecipients: mainRecipients, copyRecipients: copyRecipients});
        return serverResult.data;
    } catch (error) {
        console.log(error);
        return {} as SentLetterInformation
    }
}


export async function SendLetterFast(sendLetterFastDto: any): Promise<SentLetterInformation>{
    try {
        const result = await api.batisAutomationApi.post('/letters/SendLetterFast',sendLetterFastDto);
        return result.data;
    } catch (error) {
        console.log(error);
        return {} as SentLetterInformation;
    }
}

export async function SendLetter(sendLetterFastDto: any): Promise<SendLetterAndSaveDraftResults>{
    try {
        const result = await api.batisAutomationApi.post('/letters/SendLetter',sendLetterFastDto);
        return result.data;
    } catch (error) {
        console.log(error);
        return {} as SendLetterAndSaveDraftResults;
    }
}

export async function SaveDraft(sendLetterFastDto: any): Promise<SendLetterAndSaveDraftResults>{
    try {
        const result = await api.batisAutomationApi.post('/letters/SaveDraft',sendLetterFastDto);
        return result.data;
    } catch (error) {
        console.log(error);
        return {} as SendLetterAndSaveDraftResults;
    }
}

export async function SearchAll(searchDto: letterSearch): Promise<LetterSearchResult[]>{
    try {
        const result = await api.batisAutomationApi.post('/letters/SearchAll',searchDto);
        return result.data;
    } catch (error) {
        console.log(error);
        return {} as any;
    }
}

export async function getServerTime(){
    try {
        const result = await api.batisAutomationApi.get('/letters/ServerTime');
        return result.data;
    } catch (error) {
        console.log(error);
        return '';
    }
}

export async function deleteLetter(letter: Letter){
    try {
        await api.batisAutomationApi.post('/letters/DeleteLetter', letter);
        
    } catch (error) {
        console.log(error);
    }
}


export async function getEmailStatus(emailReferenceId: string)
{
    try {
        const result = await api.batisAutomationApi.post('/letters/EmailState',{emailReferenceId: emailReferenceId});
        return result.data;
    } catch (error) {
        console.log(error);
        return {} as any;
    }
}

export async function getTelegramStatus(telegramReferenceId: string)
{
    try {
        const result = await api.batisAutomationApi.post('/letters/TelegramState',{telegramReferenceId: telegramReferenceId});
        return result.data;
    } catch (error) {
        console.log(error);
        return {} as any;
    }
}
