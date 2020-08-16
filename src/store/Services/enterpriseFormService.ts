import * as api from '@/store/api';
import { EnterpriseForm } from '../models/EnterpriseForm/EnterpriseForm';
import { EnterpriseFormValidValues } from '../models/EnterpriseForm/EnterpriseFormValidValues';
import { LetterOwnerWithFaxAndEmails } from '../models/LetterOwner/LetterOwnerWithFaxAndEmails';



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

export async function getClientSideInitializeResult(formId: string,ownerId: string,parametersValue: string, tableParameterValues: string, changedParameterName: string ){
    try {
        
        const serverResult =  await api.batisAutomationApi.post("/EnterpriseForms/ClientSideInitialize",{formId: formId,ownerId: ownerId,parametersValue: parametersValue, TableParametersValue: tableParameterValues, ChangedParameterName: changedParameterName });
        return serverResult.data as string;
    } 
    catch (error) {
        console.log(error);
        return {} as string;    
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

export async function sendEnterpriseForm(sendFormDto: any): Promise<string>{
    try {

        const serverResult =  await api.batisAutomationApi.post("/EnterpriseForms/send",sendFormDto);
        return serverResult.data as string;
    } 
    catch (error) {
        console.log(error);
        return {} as string;    
    }
}