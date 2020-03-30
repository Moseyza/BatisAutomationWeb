import { LetterOwner } from "@/store/models/LetterOwner/LetterOwner";

export  interface LetterOwnerEmail{
    id: string;
    email: string;
    letterOwner: LetterOwner;
    canBeUsedForSending: boolean;
}