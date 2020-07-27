import qs from 'qs'
import axios from 'axios'
import { LetterDto, LetterList } from '@/store/models'
import store from '@/store'
import router from '@/router';
import { LetterOwnerWithPicture } from '@/store/models/LetterOwner/letterOwnerWithPicture';
import LetterListerWithPaginationResult from '@/store/models/Letter/LetterListerWithPaginationResult';
import {DraftLetter} from "@/store/models/Letter/DraftLetter"
import { Branch } from '@/store/models/LetterOwner/Branch';
import * as persianDate from 'persian-date';



export const batisAutomationApi = axios.create(
    {
        //baseURL:"http://91.92.190.222:1620/api",
        baseURL:"http://185.8.174.148:1620/api",
        //baseURL:"http://localhost:54173/api"
        //baseURL:"http://localhost:1620/api"
        //baseURL:"http://45.149.76.4:1620//api"

    }
);

batisAutomationApi.interceptors.request.use(
    (config) => {
      const token = store.state.authenticationToken;
  
      if (token) {
        config.headers['Authorization'] = `Bearer ${ token }`
      }
  
      return config;
    },
  
    (error) => {
      return Promise.reject(error);
    }
);

batisAutomationApi.interceptors.response.use(
    (response) =>
    
    {
       return response;
    }, (error) => {
        if(error.response.status === 401){
          
                alert("Token expiered....");
                store.commit("clearToken");
                router.replace({name: "Login"});
            }
        
    }
    
    
);

export async function isUserValid(userName: string , password: string): Promise<boolean> {
    try {
        const data = qs.stringify({"userName": userName , "password": password  , 'grant_type': "password"});
        const config = { headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        
          }};
        const serverResponse =  await batisAutomationApi.post("/token",data,config);
        if(serverResponse){
            store.commit("setAuthenticationToken",serverResponse.data.access_token);
            store.commit("setUserId",serverResponse.data.userId);
            store.commit("clearBranchIds");
            const branchesCount =  serverResponse.data.branchesCount as number;
            for(let i = 0; i<branchesCount; i++)
            {
                store.commit("addToBranchIds",serverResponse.data[`branchId${i+1}`]);
            }
            return true;
        }
        else{
            return false;
        }
        
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

export function getCartableYears(startDate: string, endDate: string ): number[]{
    const pcStart = new persianDate(new Date(startDate));
    const pcEnd = new persianDate(new Date(endDate));
    const startMonth = pcStart.month() as number;
    const startYear = pcStart.year() as number;
    const endMonth = pcEnd.month() as number;
    const endYear = pcEnd.year() as number;
    let counter = endYear;
    const result = [];
    while(counter>= startYear){
        result.push(counter);
        counter--;
    }
    return result;
}

export function getDefaultDate(date: string): any{
    const pc = new persianDate(new Date(date));
    return {year: pc.year(), month: pc.month()}
}

export async function getReceivedLetters(from?: Date, to?: Date): Promise<LetterListerWithPaginationResult>{
    try {
        const config = {
            //headers: {'Content-Type': 'application/json' }
        };
        const data = {
            ownerId: store.state.ownerId,
            from: from,
            to: to
        };
        const serverResult = await batisAutomationApi.post("/ReceivedLetters",data);
        getCartableYears(serverResult.data.from,serverResult.data.to);
        return serverResult.data;
    } catch (error) {
        console.log(error);
        return {} as LetterListerWithPaginationResult;
    }
}

export async function getSentLetters(from?: Date, to?: Date): Promise<LetterListerWithPaginationResult>{
    try {
        const data = {
            ownerId: store.state.ownerId,
            form: from,
            to: to
        };
        const serverResult = await batisAutomationApi.post("/SentLetters",data);
        return serverResult.data;
    } catch (error) {
        console.log(error);
        return {} as LetterListerWithPaginationResult;
    }
}

export async function getDraftLetters(from?: Date, to?: Date): Promise<DraftLetter[]> {
    try {
        const data = {
            ownerId: store.state.ownerId,
            form: from,
            to: to
        };
        const serverResult = await batisAutomationApi.post("/DraftLetters",data);
        const result =  serverResult.data.letterList;
        return result;
    } catch (error) {
        console.log(error);
        return [] ;
    }
}

export async function getLetterOwners(): Promise<LetterOwnerWithPicture[]>
{
    try {
        const config = {
            headers: {'Content-Type': 'application/json' }
        };
        const data = {
            userId: store.state.userId,
            branchIds: store.state.branchIds
        };
        const serverResult = await batisAutomationApi.post("/LetterOwners",data,config);
        return serverResult.data;
    } catch (error) {
        console.log(error);
        return [];
    }
   
}

export async function getBranches(): Promise<Branch[]>
{
    try {
        // const config = {
        //     headers: {'Content-Type': 'application/json' }
        // };
        const data = {
            userId: store.state.userId,
            branchIds: store.state.branchIds
        };
        const serverResult = await batisAutomationApi.post("/Branches",data);
        return serverResult.data;
    } catch (error) {
        console.log(error);
        return [];
    }
   
}

