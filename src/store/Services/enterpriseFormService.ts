import * as api from '@/store/api';
import { EnterpriseForm } from '../models/EnterpriseForm/EnterpriseForm';
import { EnterpriseFormValidValues } from '../models/EnterpriseForm/EnterpriseFormValidValues';



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