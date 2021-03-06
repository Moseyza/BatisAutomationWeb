import Title from "@/store/models/Letter/Title";
import Parts from "@/store/models/Letter/Parts";
import { LetterOwner } from "@/store/models/LetterOwner/LetterOwner";
import LetterReferencesToOtherLetters from "@/store/models/Letter/LetterReferencesToOtherLetters";
import { InformationForSentLetter } from "@/store/models/Letter/InformationForSentLetter";
import { getNewGuid } from '@/util/utils';
import { IObservablArrayItem } from '@/store/models/ObservableArray';


export  class Letter  {
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
    sender?: LetterOwner | null;
    recievers?: (LetterOwner)[] | null;
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
    isSelected: boolean;
  }
 

 

