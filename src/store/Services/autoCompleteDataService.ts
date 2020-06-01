import * as api from '@/store/api';
import { AutoCompleteData } from '@/store/models/Letter/AutoCompleteData';
export async function getCloseAutoCompleteData(): Promise<AutoCompleteData[]>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/AutoCompleteData/Close");
        return serverResult.data as AutoCompleteData[];
    } 
    catch (error) {
        console.log(error);
        return {} as AutoCompleteData[];    
    }
}
