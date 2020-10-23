import Title from "@/store/models/Letter/Title";
import { LetterOwner } from "@/store/models/LetterOwner/LetterOwner";

export interface DependencyTrail {
    ownerPossessions?: (OwnerPossessionsInAllLetter)[] | null;
    letters?: (LettersInDependencyGraph)[] | null;
    dependencyGraph?: (number | null)[] | null;
    rootDependencyIndex: number;
  }
  export interface OwnerPossessionsInAllLetter {
    id: string;
    letterId: string;
    letterNo: string;
    page: number;
    openTime: string;
    sendTime: string;
    closeTime?: null;
    possessionComment?: string | null;
    closeComment?: null;
    isDraft: boolean;
    isClosed: boolean;
    isMainPossession: boolean;
    isOwnerCompany: boolean;
    isOwnerCompanyAndIsAPeer: boolean;
    isMappedToRemoteLetter: boolean;
    senderName?: string | null;
    sender?: LetterOwner;
    letterTitle: string;
  }
 

  export interface LettersInDependencyGraph {
    letterId: string;
    title: string;
    abstract: string;
    letterNo: string;
    isEnterpriseForm: boolean;
    enterpriseFormValues?: (null)[] | null;
    letterDate: string;
    senderNameOnly: string;
    senderPost: string;
    senderLetterOwnerCompanyNameOnly: string;
    senderLetterOwnerPersonnelCode: string;
    enterpriseFormColor?: number;
  }
  