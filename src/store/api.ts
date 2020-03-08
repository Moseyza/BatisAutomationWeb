import axios from 'axios'

export const batisAutomationApi = axios.create(
    {baseURL:"http://localhost:55604/api"}
);

export async function getLetters(): Promise<any>{
     const test =  await batisAutomationApi.get("/letter");
    return test;
}