import * as api from '@/store/api';
import File from '@/store/models/Letter/File';

export async function getFile(fileId: string): Promise<File>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/File/Pdf",{fileId: fileId});
        return serverResult.data as File;
    } 
    catch (error) {
        console.log(error);
        return {} as File;    
    }
}

export async function convertWordToPdf(fileId: string, letterInfo: any): Promise<File>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/File/WordToPdf",{wordFileId: fileId,letterInfo: letterInfo});
        return serverResult.data as File;
    } 
    catch (error) {
        console.log(error);
        return {} as File;    
    }
}