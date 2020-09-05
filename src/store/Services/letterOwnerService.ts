import * as api from '@/store/api';
import { OwnerFolder } from '@/store/models/LetterOwner/OwnerFolder';
import { LetterOwner } from '@/store/models/LetterOwner/LetterOwner';
import { LetterOwnerWithFaxAndEmails } from '@/store/models/LetterOwner/LetterOwnerWithFaxAndEmails';
import { LetterOwnerWithSendingInformationAndAttachments } from '../models/LetterOwner/LetterOwnerWithSendingInformationAndAttachments';
import { LetterOwnerForSendingFaxAndEmailAndSms } from '../models/LetterOwner/LetterOwnerForSendingFaxAndEmailAndSms';
import { CompanyLetterOwner } from '../models/LetterOwner/CompanyLetterOwner';

export async function getArchiveFolders(ownerId: string): Promise<OwnerFolder[]>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/LetterOwners/ArchiveFolders",{ownerId: ownerId});
        return serverResult.data as OwnerFolder[];
    } 
    catch (error) {
        console.log(error);
        return {} as OwnerFolder[];    
    }
}

export async function getOwnerRecipients(ownerId: string): Promise<LetterOwnerWithFaxAndEmails[]>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/LetterOwners/Recipients",{ownerId: ownerId});
        return serverResult.data as LetterOwnerWithFaxAndEmails[];
    } 
    catch (error) {
        console.log(error);
        return {} as LetterOwnerWithFaxAndEmails[];    
    }
}

export async function getAllLetterOwners(): Promise<LetterOwner[]>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/LetterOwners/All",{});
        return serverResult.data as LetterOwner[];
    } 
    catch (error) {
        console.log(error);
        return {} as LetterOwner[];    
    }
}

export async function getAllCompanyLetterOwners(): Promise<LetterOwner[]>{
    try {
        const serverResult =  await api.batisAutomationApi.post("/LetterOwners/CompanyLetterOwners",{});
        return serverResult.data as LetterOwner[];
    } 
    catch (error) {
        console.log(error);
        return {} as LetterOwner[];    
    }
}

export function getLetterOwnerWithSendingInfo(recipient: LetterOwnerWithFaxAndEmails): LetterOwnerWithSendingInformationAndAttachments{
    const result = {} as LetterOwnerWithSendingInformationAndAttachments;
    result.id = recipient.id;
    result.name = recipient.name;
    result.nameOnly = recipient.nameOnly;
    result.post = recipient.post;
    result.ownerType = recipient.ownerType;
    result.emails = [];
    if(recipient.emails)
        recipient.emails.forEach(email=>{
            result.emails.push(email);
        });
    result.shallReceiveSms = false;
    result.shallReceiveMessageViaMessagingApp = false;
    result.attachments = [];
    return result;
}
export function getLetterOwnerForSendingFaxAndEmailAndSms(recipient: LetterOwnerWithFaxAndEmails): LetterOwnerForSendingFaxAndEmailAndSms{
    const result = {} as LetterOwnerForSendingFaxAndEmailAndSms;
    result.id = recipient.id;
    result.name = recipient.name;
    result.nameOnly = recipient.nameOnly;
    result.post = recipient.post;
    result.ownerType = recipient.ownerType;
    result.emails = [];
    if(recipient.emails )
        recipient.emails.forEach(email=>{
            if(result.emails)
                result.emails.push(email);
        });
    result.shallSendSms = false;
    result.shallSendViaMessagingApp = false;
    result.childDraftReceivers = [];
    result.childCopyReceivers = [];
    result.childMainReceivers = [];
    result.canUserSendEmail = recipient.canUserSendEmail;
    result.canUserSendSms = recipient.canUserSendSms;
    result.canSendViaMessagingApp = recipient.canSendViaMessagingApp;
    return result;
}


