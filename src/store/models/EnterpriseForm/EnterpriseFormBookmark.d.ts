import { EnterpriseFormBookmarksTypes } from "./EnterpriseFormBookmarksTypes";
import { EnterpriseFormTableBookmarkColumn } from "./EnterpriseFormTableBookmarkColumn";

export interface EnterpriseFormBookmark {
  id: string;
  name: string;
  type: EnterpriseFormBookmarksTypes;
  defaultValue?: string | null;
  englishName: string;
  persianName: string;
  sequenceNo: number;
  isMandatory: boolean;
  comment?: null;
  validValue?: string | null;
  isReadOnly: boolean;
  isVisibleInSend: boolean;
  isVisibleInTrail: boolean;
  tableColumns?: EnterpriseFormTableBookmarkColumn[];
  canAddNewRow: boolean;
  shallInheritValueFromLastEnterpriseForm: boolean;
  defaultFile?: null;
  columnFormat?: string | null;
  isHorizontalTable: boolean;
  validValuesQuery?: string | null;
  isTransient: boolean;
}
