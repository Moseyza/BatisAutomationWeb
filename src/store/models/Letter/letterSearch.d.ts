import { LetterOwner } from "../LetterOwner/LetterOwner";

export default interface letterSearch{
    title: string;
    sendTo: LetterOwner;
    sendFrom: LetterOwner;
    sentTiemFrom: string;
    sentTimeTo: string;
    answerTimeFrom: string;
    answerTimeTo: string;
    abstract: string;
    comment: string;
    closingComment: string;
    fileName: string;
    letterNumberPrefix: string;
    letterNumberSequence: string;
    searchInLetterOwnerDashboard: LetterOwner;
    isSecured: boolean | null;
    priorityFrom: number | null;
    isClosed: boolean | null;
    isNotLastInWorkflow: boolean | null;
    allStrings: string; 
    isConjunctive: boolean;
    IncomingLetterNumberReferenceNumber: string;
    SearchingOwner: LetterOwner
    IncludePersonalComment: boolean;
    PersonalComment: string;
    EnterpriseForm: string;
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

}