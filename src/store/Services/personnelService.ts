import * as api from '@/store/api';
import { Personnel } from '../models/LetterOwner/Personnel';


export async function GetAllPersonnel(): Promise<Personnel[]>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/Personnel/All");
        return serverResult.data;
    } catch (error) {
        console.log(error);
        return {} as Personnel[];
    }
}