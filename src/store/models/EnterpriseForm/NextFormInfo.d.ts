import { EnterpriseForm } from "./EnterpriseForm";

export interface NextFormInfo {
    enterpriseForm: EnterpriseForm;
    multipleValues: MultipleEnterpriseFormValues;
    senderId: string;
    dependentLetterId: string;
    announcementBoardIdToSend: string;
  }
  
 
  export interface TableColumnsEntity {
    englishName: string;
    persianName: string;
    isReadonly: boolean;
    isVisible: boolean;
    columnIndex: number;
    type: number;
    validValues?: string | null;
    validValuesQueries?: string | null;
    isMandatory: boolean;
    defaultValue?: string | null;
    color: number;
    viewTablePosition: string;
    labelColor: number;
    isBold: boolean;
    fontSize: number;
  }
  export interface MultipleEnterpriseFormValues {
    letters?: (SingleEnterpriseFormLetterWithValues)[] | null;
  }
  export interface SingleEnterpriseFormLetterWithValues {
    values?: (EnterpriseFormSingleValue)[] | null;
    letterId: string;
    letterNumber: string;
    sendTime: string;
  }
  export interface EnterpriseFormSingleValue {
    id: string;
    name?: null;
    type: number;
    defaultValue?: null;
    englishName: string;
    persianName: string;
    sequenceNo: number;
    isMandatory: boolean;
    comment?: null;
    value: string;
    file?: null;
    isVisibleInSend: boolean;
    isVisibleInTrail: boolean;
    tableColumns?: (EnterpriseFormTableBookmarkColumns | null)[] | null;
    isHorizontal: boolean;
    columnFormat?: string | null;
    validValuesQuery: string;
  }
  export interface EnterpriseFormTableBookmarkColumns {
    englishName: string;
    persianName: string;
    isReadonly: boolean;
    isVisible: boolean;
    columnIndex: number;
    type: number;
    validValues?: string | null;
    validValuesQueries?: string | null;
    isMandatory: boolean;
    defaultValue?: string | null;
    color: number;
    viewTablePosition: string;
    labelColor: number;
    isBold: boolean;
    fontSize: number;
  }
  