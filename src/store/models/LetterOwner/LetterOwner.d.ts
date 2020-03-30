import  Title  from "@/store/models/Letter/Title";

export class LetterOwner {
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
    // mailSenderId: string;
    // selectedFaxId: string;
    // selectedEmails?: null;
  }
