export default interface File {
    id: string;
    content: string;
    extension: string;
    isBasedOnPattern: boolean;
    openMaximized: boolean;
    originalContentIsSet: boolean;
    preferedId: string;
    shallCreateNew: boolean;
  }