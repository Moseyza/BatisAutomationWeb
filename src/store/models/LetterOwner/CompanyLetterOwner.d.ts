import { Company } from "@/store/models/LetterOwner/Company";

export interface CompanyLetterOwner {
    id: string;
    name: string;
    company: Company;
    responsibleId: string;
    responsibleName: string;
    generType: GenderType;
    post: string;
    signId: string;
    sign?: null;

}

export enum GenderType {
    male = 0,
    female = 1
}