import Title from "@/store/models/Letter/Title";
import Parts from "@/store/models/Letter/Parts";
import { LetterOwner } from "@/store/models/LetterOwner/LetterOwner";
import LetterReferencesToOtherLetters from "@/store/models/Letter/LetterReferencesToOtherLetters";

export default interface Letter {
    id: string;
    letterPossessionId: string;
    isMainPossession: boolean;
    title: string;
    abstract: string;
    isSecured: boolean;
    priority: number;
    createTime: string;
    sendTime: string;
    parts?: (Parts)[] | null;
    sender: LetterOwner;
    recievers?: null;
    isOpenned: boolean;
    comment: string;
    letterNo: string;
    transferType: number;
    isForwarded: boolean;
    letterReferences?: (LetterReferencesToOtherLetters | null)[] | null;
    doesHasComment: boolean;
    incomingLetterNumberReferenceNumber: string;
    isEnterpriseForm: boolean;
    enterpriseFormId: string;
    dueDate?: null;
    enterpriseFormName: string;
    isHardSecured: boolean;
    isClosed: boolean;
  }
 

 

