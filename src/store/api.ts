import axios from 'axios'
import { LetterDto, LetterList } from '@/store/models';

export const batisAutomationApi = axios.create(
    {baseURL:"http://localhost:55604/api"}
);

export async function getLetters(): Promise<LetterList>{
    const serverResult  = await  batisAutomationApi.get("/letter");
    
    const letterArray =  serverResult.data as LetterDto[];
    console.log("data in service is:");
    

    const test: any = {};
    test.letters = letterArray;
    console.log(test);
    return test as LetterList; 
}