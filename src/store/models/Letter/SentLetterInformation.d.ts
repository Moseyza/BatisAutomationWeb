export default interface SentLetterInformation{
    LetterNumber: string;
    SendTime: string;
    ReceiverName: string;
    OutsideCompanyLetters: SentLetterInformation[];
    LetterId: string;
    BasePossessionId: string;
    //EnterpriseFormValidatorResultDto EnterpriseFormValidatorResult;    
    ShallCloseLastLetter: boolean;
}