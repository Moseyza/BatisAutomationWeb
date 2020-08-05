export interface EnterpriseFormValidValues {
    formValidValues: FormValidValues;
    tableValidValues: ValidValuesForSingleTable[];
  }
  export interface FormValidValues {
  }
  export interface ValidValuesForSingleTable {
    tableName: string;
    columnsValidValues: ValidValuesForSingleColumn[];
  }
  export interface ValidValuesForSingleColumn {
    columnName: string;
    validValues: ValidValues[];
  }
  export interface ValidValues {
    item1: string;
    item2: string;
  }
  