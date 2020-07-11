import * as api from '@/store/api';
import { AnnouncementBoard } from '../models/AnnouncementBoard/AnnouncementBoard';
import { Announcement } from '../models/Letter/Announcement';
export async function getAccessibleAnnouncementBoards(ownerId: string): Promise<AnnouncementBoard[]>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/AnnouncementBoards/AllAccessible",{letterownerId: ownerId});
        return serverResult.data as AnnouncementBoard[];
    } 
    catch (error) {
        console.log(error);
        return {} as AnnouncementBoard[];    
    }
}

export async function getAnnouncementsInBoard(ownerId: string,announcementBoardId: string): Promise<Announcement[]>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/Letters/Announcements",{ownerId: ownerId,announcementBoardId: announcementBoardId});
        return serverResult.data as Announcement[];
    } 
    catch (error) {
        console.log(error);
        return {} as Announcement[];    
    }
}