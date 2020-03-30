import { CompanyLetterOwner } from "@/store/models/LetterOwner/CompanyLetterOwner";

export interface CompanyLetterOwnerPhoneNumber{
    id: string;
    faxNumber: string;
    comment: string;
    companyLetterOwner: CompanyLetterOwner;
    canBeUsedForSending: boolean;
}