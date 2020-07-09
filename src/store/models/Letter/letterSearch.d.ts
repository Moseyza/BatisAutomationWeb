import { LetterOwner } from "../LetterOwner/LetterOwner";

export default interface letterSearch{
    title: string;
    sendTo: LetterOwner;
    sendFrom: LetterOwner;
    sentTimeFrom: Date | null;
    sentTimeTo: Date | null;
    answerTimeFrom: Date | null;
    answerTimeTo: Date | null;
    abstract: string;
    comment: string;
    closingComment: string;
    fileName: string;
    letterNumberPrefix: string;
    letterNumberSequence: string;
    searchInLetterOwnerDashboard: LetterOwner;
    isSecured: boolean | null;
    priorityFrom: number | null;
    priorityTo: number | null;
    isClosed: boolean | null;
    isNotLastInWorkflow: boolean | null;
    allStrings: string; 
    isConjunctive: boolean;
    IncomingLetterNumberReferenceNumber: string;
    SearchingOwner: LetterOwner
    IncludePersonalComment: boolean;
    PersonalComment: string;
    EnterpriseForm: string | null;
    //EnterpriseFormFilters:EnterpriseFormFilterDto[]
    //SendFromCompany
    //SendToCompany
    enterpriseFormName: string;
    nextEnterpriseFormName: string;
    LetterId: string | null;
    OwnerParticipateInTrail: LetterOwner;
    //CompanyParticipateInTrail
    //NextEnterpriseForm
    SearchInReturnedLetters: boolean | null;
    isSelected: boolean;

}