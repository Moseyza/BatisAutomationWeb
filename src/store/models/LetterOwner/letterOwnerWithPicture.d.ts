import  Title  from "@/store/models/Letter/Title";

export interface LetterOwnerWithPicture {
    picture: string;
    onlyForReceivingIncommingLetter: boolean;
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
    hasFullAccessToPhonebook: boolean;
    canChangePhoneBook: boolean;
    englishNameId?: null;
    notificationShowPeriod: number;
  }

  