import  Title  from "@/store/models/Letter/Title";
import File from "@/store/models/Letter/File";
import { LetterOwnerEmail } from "@/store/models/LetterOwner/LetterOwnerEmail";
import { CompanyLetterOwnerPhoneNumber } from "@/store/models/LetterOwner/CompanyLetterOwnerPhoneNumber";

export class LetterOwnerWithSendingInformationAndAttachments {
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
    englishNameId: string;
    notificationShowPeriod: number;
    forwardingComment: string;
    attachments: File[];
    shallReceiveSms: boolean;
    emails: LetterOwnerEmail[];
    faxes:CompanyLetterOwnerPhoneNumber[];
    parentRemoteLetterPossessionId: string;
    shallReceiveMessageViaMessagingApp: boolean;
    isSendSecure: boolean;
    requiresFollowUp: boolean;

    // mailSenderId: string;
    // selectedFaxId: string;
    // selectedEmails?: null;
  }
