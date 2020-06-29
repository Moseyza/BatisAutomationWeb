import { EnterpriseForm } from "../EnterpriseForm/EnterpriseForm";

export interface Workflow {
    id: string;
    name: string;
    enterpriseForms?: (EnterpriseForm)[] | null;
  }
