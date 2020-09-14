import { EnterpriseForm } from "./EnterpriseForm";
import { EnterpriseFormSingleValue } from "./NextFormInfo";
import { DraftLetter } from "../Letter/DraftLetter";

export interface DraftEnterpriseFormInfo {
    draftEnterpriseForm: DraftEnterpriseForm;
    draftLetter: DraftLetter;
    draftLetterId: string;
    senderId: string;
  }
  export interface DraftEnterpriseForm {
    enterpriseFormDto: EnterpriseForm;
    lastVersionEnterpriseFormDto: EnterpriseForm;
    values: EnterpriseFormValues;
  }
  

  export interface EnterpriseFormValues {
    values?: (EnterpriseFormSingleValue)[] | null;
    formName: string;
    announcementBoardName?: null;
    columnFormat: string;
    formId: string;
  }
