import { LetterOwner } from "@/store/models/LetterOwner/LetterOwner";

export interface OwnerFolder {
    id: string;
    name: string;
    childFolders?: (OwnerFolder)[] | null;
    letterOwner: LetterOwner;
  }


  