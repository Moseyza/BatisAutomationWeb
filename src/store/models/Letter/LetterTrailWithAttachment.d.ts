import File from "./File";
import { LetterOwner } from "../LetterOwner/LetterOwner";

export interface LetterTrailWithAttachments {
    letterId: string;
    attachments?: File[];
    letterNo: string;
    isOwnerCompany: boolean;
    closeAttachments?: (null)[] | null;
    isEmailed: boolean;
    emailReference: string;
    isFaxed: boolean;
    faxReference: string;
    isMappedToRemoteLetter: boolean;
    incomingLetterNumberReferenceNumber: string;
    isDraft: boolean;
    basedOnReferencedLetters?: (null)[] | null;
    referencedLettersBasedOnCurrentLetter?: (null)[] | null;
    isOwnerCompanyAndIsAPeer: boolean;
    shallNotIncludeInTrail: boolean;
    isSendedViaMessagingApp: boolean;
    messagingAppReference: string;
    isSecured: boolean;
    senderId: string;
    senderName: string;
    sender: LetterOwner;
    attorner?: null;
    closingAttorner?: null;
    possessionId: string;
    sendTime: string;
    recievers: (LetterTrailWithAttachments)[];
    isMainPossession: boolean;
    openTime?: null;
    closeTime?: null;
    isClosed: boolean;
    closingComment?: null;
    comment?: null;
    isSender: boolean;
  }
  
  
  

