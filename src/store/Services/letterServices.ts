import * as api from '@/store/api';
import { LetterTrail } from '@/store/models/Letter/LetterTrail';

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