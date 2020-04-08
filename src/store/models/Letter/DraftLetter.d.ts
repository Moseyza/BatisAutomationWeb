import {Letter} from "@/store/models/Letter/Letter";
import { InformationForSentLetter } from "@/store/models/Letter/InformationForSentLetter";
import { LetterOwnerForSendingFaxAndEmailAndSms } from "@/store/models/LetterOwner/LetterOwnerForSendingFaxAndEmailAndSms";

export class DraftLetter extends Letter{
    childLetters?: (InformationForSentLetter | null)[] | null;
    draftReceivers: LetterOwnerForSendingFaxAndEmailAndSms;
    version?: number;
}