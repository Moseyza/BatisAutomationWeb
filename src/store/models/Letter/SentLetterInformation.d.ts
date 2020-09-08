import { EnterpriseFormValidatorResult } from "../EnterpriseForm/EnterpriseFormValidatorResult";

export default interface SentLetterInformation{
    letterNumber: string;
    sendTime: string;
    receiverName: string;
    outsideCompanyLetters: SentLetterInformation[];
    letterId: string;
    basePossessionId: string;
    enterpriseFormValidatorResultDto: EnterpriseFormValidatorResult;    
    shallCloseLastLetter: boolean;
}


export interface SendLetterAndSaveDraftResults{
    letterNo: string;
    isAnyDraftSaved: boolean|null;
}

export  interface SendingFormResults
{
    hasError: boolean;
    sentLetterInformation: SentLetterInformation;
    errorMessage: string;
}