export interface Workflow {
    id: string;
    name: string;
    enterpriseForms?: (EnterpriseForm)[] | null;
  }
  export interface EnterpriseForm {
    id: string;
    name: string;
  }
  