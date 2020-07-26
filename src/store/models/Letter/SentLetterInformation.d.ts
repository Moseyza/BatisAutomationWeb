export default interface SentLetterInformation{
    letterNumber: string;
    sendTime: string;
    receiverName: string;
    outsideCompanyLetters: SentLetterInformation[];
    letterId: string;
    basePossessionId: string;
    //EnterpriseFormValidatorResultDto EnterpriseFormValidatorResult;    
    shallCloseLastLetter: boolean;
}


export interface SendLetterAndSaveDraftResults{
    letterNo: string;
    isAnyDraftSaved: boolean|null;
}