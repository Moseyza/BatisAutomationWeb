export interface AnnouncementBoard {
    id: string;
    name: string;
    children?: (AnnouncementBoard)[] | null;
    tempId: string;
    archiveFolder?: null;
    archiveFolderTempId: string;
  }
 