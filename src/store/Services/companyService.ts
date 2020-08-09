import * as api from '@/store/api';
import { Company } from '../models/LetterOwner/Company';


export async function GetAllCompanies(): Promise<Company[]>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/Companies/All");
        return serverResult.data;
    } catch (error) {
        console.log(error);
        return {} as Company[];
    }
}