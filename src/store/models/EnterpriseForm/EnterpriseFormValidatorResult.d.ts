export interface EnterpriseFormValidatorResult{
    errors: string[];
    hasBusinessError: boolean;
    hasError: boolean;
    newValues: any;
    requestForReloadingData: any[];
    requestForReloadingTableValues: any[];
}