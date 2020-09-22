import * as api from '@/store/api';
import { EnterpriseForm } from '../models/EnterpriseForm/EnterpriseForm';
import { EnterpriseFormValidValues } from '../models/EnterpriseForm/EnterpriseFormValidValues';
import { LetterOwnerWithFaxAndEmails } from '../models/LetterOwner/LetterOwnerWithFaxAndEmails';
import axios from 'axios';
import { NextFormInfo } from '../models/EnterpriseForm/NextFormInfo';
import { EnterpriseFormValidatorResult } from '../models/EnterpriseForm/EnterpriseFormValidatorResult';
import SentLetterInformation, { SendingFormResults } from '../models/Letter/SentLetterInformation';
import { DraftEnterpriseFormInfo } from '../models/EnterpriseForm/LoadEnterpriseFormDraftResponse';



export async function getOwnerEnterpriseForms(ownerId: string): Promise<EnterpriseForm[]>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/EnterpriseForms/OwnerForms",{ownerId: ownerId});
        return serverResult.data as EnterpriseForm[];
    } 
    catch (error) {
        console.log(error);
        return {} as EnterpriseForm[];    
    }
}

export async function getFormValidValus(formId: string): Promise<EnterpriseFormValidValues>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/EnterpriseForms/FormValidValues",{formId: formId});
        return serverResult.data as EnterpriseFormValidValues;
    } 
    catch (error) {
        console.log(error);
        return {} as EnterpriseFormValidValues;    
    }
}

export async function getCodeBehindExecutionResult(formId: string,ownerId: string,parametersValue: string, tableParameterValues: string, changedParameterName: string ){
    try {
        const serverResult =  await api.batisAutomationApi.post("/EnterpriseForms/BehindCodeExecutionResult",{formId: formId,ownerId: ownerId,parametersValue: parametersValue, TableParametersValue: tableParameterValues, ChangedParameterName: changedParameterName });
        if(serverResult)
            return serverResult.data as string;
        else
            return '';
    } 
    catch (error) {
        console.log(error);
        return {} as string;    
    }
}

export async function getClientSideInitializeResult(formId: string,ownerId: string,parametersValue: string, tableParameterValues: string){
    try {
        
        const serverResult =  await api.batisAutomationApi.post("/EnterpriseForms/ClientSideInitialize",{formId: formId,ownerId: ownerId,parametersValue: parametersValue, TableParametersValue: tableParameterValues });
        return serverResult.data as string;
    } 
    catch (error) {
        console.log(error);
        return {} as string;    
    }
}

export async function getClientSideInitialEvaluateResult(formId: string,ownerId: string,parametersValue: string, tableParameterValues: string): Promise<EnterpriseFormValidatorResult>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/EnterpriseForms/ClientSideInitialEvaluate",{formId: formId,ownerId: ownerId,parametersValue: parametersValue, TableParametersValue: tableParameterValues });
        return serverResult.data as EnterpriseFormValidatorResult;
    } 
    catch (error) {
        console.log(error);
        return {} as EnterpriseFormValidatorResult;    
    }
}


export async function getFormReceivers(formId: string,senderId: string,dependentLetterId: string ): Promise<LetterOwnerWithFaxAndEmails[]>{
    try {

        const serverResult =  await api.batisAutomationApi.post("/EnterpriseForms/FormReceivers",{formId: formId,senderId: senderId,dependentLetterId: dependentLetterId  });
        return serverResult.data as LetterOwnerWithFaxAndEmails[];
    } 
    catch (error) {
        console.log(error);
        return {} as LetterOwnerWithFaxAndEmails[];    
    }
}

export async function getDraftEnterpriseForm(request: any): Promise<DraftEnterpriseFormInfo> {
    try {

        const serverResult =  await api.batisAutomationApi.post("/EnterpriseForms/LoadDraft",request);
        return serverResult.data as DraftEnterpriseFormInfo;
    } 
    catch (error) {
        console.log(error);
        return {} as DraftEnterpriseFormInfo;
    }
}

export async function IsFormAutoClose(formId: string): Promise<boolean>{
    try {

        const serverResult =  await api.batisAutomationApi.get(`/EnterpriseForms/IsAutoClose/${formId}`);
        return serverResult.data as boolean;
    } 
    catch (error) {
        console.log(error);
        return {} as boolean;
    }
}

export async function sendEnterpriseForm(sendFormDto: any,mode: string): Promise<SendingFormResults>{
    try {
        const formData = new FormData();
        const fileBookmarkNames = [] as string[];
        sendFormDto.attachedFiles.forEach((file: any) => {
            formData.append(file.fileId,file.fileContent);
            fileBookmarkNames.push(file.bookmarkName);
        });
        
        for(const key in sendFormDto){
            if(key !== 'attachedFiles'){
                formData.append(key,JSON.stringify(sendFormDto[key]));
            }
        }
        formData.append("fileBookmarks",JSON.stringify(fileBookmarkNames));
        const serverResult =  await api.batisAutomationApi.post(`/EnterpriseForms/send/${mode}`,formData,
        { 
            headers: {
            'Content-Type': 'multipart/form-data; boundary=${form._boundary}'
            }
        });
        return serverResult.data as SendingFormResults;
    } 
    catch (error) {
        console.log(error);
        return {} as SendingFormResults;    
    }
}

export async function getNextForms(letterId: string,letterOwnerId: string): Promise<EnterpriseForm[]>{
    try {

        const serverResult =  await api.batisAutomationApi.post("/EnterpriseForms/NextFormsList",{letterId: letterId,letterOwnerId: letterOwnerId  });
        return serverResult.data as EnterpriseForm[];
    } 
    catch (error) {
        console.log(error);
        return [] as EnterpriseForm[];    
    }
}

export async function getNextForm(nextFormReqeust: any): Promise<NextFormInfo>{
    try {

        const serverResult =  await api.batisAutomationApi.post("/EnterpriseForms/NextForm",nextFormReqeust);
        return serverResult.data as NextFormInfo;
    } 
    catch (error) {
        console.log(error);
        return {} as NextFormInfo;    
    }
}