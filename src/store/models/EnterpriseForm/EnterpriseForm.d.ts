import File from "../Letter/File";

export interface EnterpriseForm {
  id: string;
  name: string;
  file: File;
  abstract: string;
  title: string;
  mainLetterName: string;
  priority: number;
  isSecured: boolean;
  isDisabled: boolean;
  bookmarks?: (EnterpriseFormBookmark)[] | null;
  canHaveAttachment: boolean;
  canHaveDependencies: boolean;
  validationComputationCode?: string | null;
  onlySystemUsage: boolean;
  intermediateUsage: boolean;
  beginningUsage: boolean;
  workflowId?: string | null;
  workflowName?: string | null;
  reportName?: string | null;
  hasReportFunction: boolean;
  natureAsDependency?: number | null;
  color: number;
  selectionColor: number;
  defaultAnnouncementBoardId: string;
  shallInheritAnnouncementBoard: boolean;
  shallApplyAnnouncement: boolean;
  showChooseAnnouncementBoard: boolean;
  canChangeAnnouncementBoard: boolean;
  columnFormat: string;
  englishName?: string | null;
  shallCreateExcelOutput: boolean;
  automaticClosing: boolean;
  versionId: string;
  openMaximized: boolean;
}

export interface EnterpriseFormBookmark {
  id: string;
  name: string;
  type: number;
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
  tableColumns?: (EnterpriseFormTableBookmarkColumn | null)[] | null;
  canAddNewRow: boolean;
  shallInheritValueFromLastEnterpriseForm: boolean;
  defaultFile?: null;
  columnFormat?: string | null;
  isHorizontalTable: boolean;
  validValuesQuery?: string | null;
  isTransient: boolean;
}
export interface EnterpriseFormTableBookmarkColumn {
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
  viewTablePosition?: string | null;
  labelColor: number;
  isBold: boolean;
  fontSize: number;
}
