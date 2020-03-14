import axios from 'axios'
import qs from 'qs'
import { LetterDto, LetterList } from '@/store/models'
import store from '@/store'



export const batisAutomationApi = axios.create(
    {baseURL:"http://localhost:54173/api"}
);


export async function isUserValid(userName: string , password: string): Promise<boolean> {
    try {
        const data = qs.stringify({"userName": userName , "password": password  , 'grant_type': "password"});
        console.log(data);
        const config = { headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          }};
        const token =  await batisAutomationApi.post("/token",data,config);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
 
 }

export async function getLetters(): Promise<LetterList>{
    const serverResult  = await  batisAutomationApi.get("/letter");
    const letterArray =  serverResult.data as LetterDto[];
    const test: any = {};
    test.letters = letterArray;
    return test as LetterList; 
}