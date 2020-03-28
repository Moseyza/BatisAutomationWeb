import qs from 'qs'
import axios from 'axios'
import { LetterDto, LetterList } from '@/store/models'
import store from '@/store'
import router from '@/router';
import { LetterOwnerWithPicture } from '@/store/models/LetterOwner/letterOwnerWithPicture';
import LetterListerWithPaginationResult from '@/store/models/Letter/LetterListerWithPaginationResult';



export const batisAutomationApi = axios.create(
    {baseURL:"http://localhost:54173/api"}
);

batisAutomationApi.interceptors.request.use(
    (config) => {
      const token = store.state.authenticationToken;
  
      if (token) {
        config.headers['Authorization'] = `Bearer ${ token }`
      }
  
      return config
    },
  
    (error) => {
      return Promise.reject(error)
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

export async function getReceivedLetters(): Promise<LetterListerWithPaginationResult>{
    try {
        const config = {
            //headers: {'Content-Type': 'application/json' }
        };
        const data = {
            ownerId: store.state.ownerId,
            form: null,
            to: null
        };
        const serverResult = await batisAutomationApi.post("/ReceivedLetters",data);
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