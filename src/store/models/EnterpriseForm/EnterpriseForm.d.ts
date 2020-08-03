import File from "../Letter/File";
import { EnterpriseFormBookmark } from "./EnterpriseFormBookmark";

export  interface EnterpriseForm {
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


