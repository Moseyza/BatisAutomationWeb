import { LetterOwner } from "../LetterOwner/LetterOwner"
import Parts from "./Parts"
import LetterReferencesToOtherLetters from "./LetterReferencesToOtherLetters"

export interface LetterSearchResult{
    possessionId: string;
    from : LetterOwner;
    currentOwner : LetterOwner;
    to : LetterOwner[];
    isMainPossession : boolean;
    title : string;
    abstract : string;
    isSecured : boolean;
    isHardSecured : boolean;
    priority : number;
    createTime : string | null;
    sendTime : string;
    parts : Parts[];
    comment : string;
    letterNo : string;
    isForwarded : boolean;
    letterReferences?: LetterReferencesToOtherLetters[];
    page: string;
    doesHasComment : boolean;
    incomingLetterNumberReferenceNumber : string
    isEnterpriseForm : boolean;
    letterId : string;
    isOpenned : boolean;
    isClosed : boolean;
    draftVersion : number;
    dueDate : string;
    enterpriseFormId : string;
    enterpriseFormName : string;
    isSelected: boolean;
}