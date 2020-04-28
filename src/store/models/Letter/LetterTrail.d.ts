import { LetterOwner } from "@/store/models/LetterOwner/LetterOwner";
import Title from "@/store/models/Letter/Title";

export interface LetterTrail {
    senderId: string;
    senderName: string;
    sender: LetterOwner;
    attorner?: null;
    closingAttorner?: LetterOwner;
    possessionId: string;
    sendTime: string;
    recievers?: (LetterTrail)[] | null;
    isMainPossession: boolean;
    openTime?: null;
    closeTime?: null;
    isClosed: boolean;
    closingComment?: null;
    comment?: null;
  }
  