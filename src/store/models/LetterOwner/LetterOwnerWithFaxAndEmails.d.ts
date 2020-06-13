import Title from "@/store/models/Letter/Title";
import { LetterOwner } from "@/store/models/LetterOwner/LetterOwner";
import { LetterOwnerEmail } from "@/store/models/LetterOwner/LetterOwnerEmail";

export interface LetterOwnerWithFaxAndEmails {
    emails?: (LetterOwnerEmail)[] | null;
    faxes?: (null)[] | null;
    companyName: string;
    canUserSend: boolean;
    canUserSendCopy: boolean;
    canUserSendDraft: boolean;
    canUserSendEmail: boolean;
    canUserSendFax: boolean;
    canUserSendSms: boolean;
    defaultSendComment?: null;
    defaultSendCopyComment?: null;
    defaultSendDraftComment?: null;
    isSendDefault: boolean;
    isSendCopyDefault: boolean;
    isSendDraftDefault: boolean;
    isSendEmailDefault: boolean;
    isSendFaxDefault: boolean;
    isSendSmsDefault: boolean;
    canSendViaMessagingApp: boolean;
    isSendViaMessagingAppDefault: boolean;
    id: string;
    name: string;
    nameOnly: string;
    post: string;
    letterOwnerCompanyNameOnly: string;
    letterOwnerPersonnelCode: string;
    sendingComment?: null;
    ownerType: number;
    trailingPermission: number;
    isSecretariatWorker: boolean;
    personnelCode: string;
    isUsedForForwarding: boolean;
    canSeeSecuredLetters: boolean;
    isDeactive: boolean;
    shallSeeUnknownFaxEmailNotifications: boolean;
    shallSeeUnknownFaxEmail: boolean;
    dueDate?: null;
    title: Title;
    canSeeAllLetters: boolean;
    canMakeLetterSecure: boolean;
    hasFullAccessToPhonebook?: boolean | null;
    canChangePhoneBook: boolean;
    englishNameId?: string | null;
    notificationShowPeriod: number;
  }
  
  
 