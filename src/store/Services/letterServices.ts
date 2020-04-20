import * as api from '@/store/api';

export async function OpenLetter(letterPossessionId: string){
    const serverResult =  await api.batisAutomationApi.post("/Letters",{letterPossessionId: letterPossessionId});
    console.log("Test1:");
    console.log(serverResult.data);
}