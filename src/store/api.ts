import qs from 'qs'
import axios from 'axios'
import { LetterDto, LetterList } from '@/store/models'
import store from '@/store'
import router from '@/router';



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
        console.log(data);
        const config = { headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          }};
        const serverResponse =  await batisAutomationApi.post("/token",data,config);
        if(serverResponse){
            store.commit("setAuthenticationToken",serverResponse.data.access_token);
            return true;
        }
        else{
            return false;
        }
        
    } catch (error) {
        alert(error);
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

export async function getLetterOwners(): Promise<any>
{
    try {
        const test = await batisAutomationApi.get("/LetterOwners");
        return test.data;
    } catch (error) {
        console.log(error);
        return null;
    }
   
}