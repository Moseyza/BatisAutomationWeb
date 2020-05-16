import * as api from '@/store/api';
import { Workflow } from '../models/workflow/workflow';


export async function getAllWorkflowsWithEnterpriseForms(): Promise<Workflow[]>
{
    try {
        const serverResult =  await api.batisAutomationApi.post("/workflows/all");
        return serverResult.data as Workflow[];
    } catch (error) {
        console.log(error);
        return {} as Workflow[];
    }
}