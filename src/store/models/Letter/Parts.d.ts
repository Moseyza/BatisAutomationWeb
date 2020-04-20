import File from '@/store/models/Letter/File';
export default interface Parts {
    id: string;
    partIndex: number;
    file: File;
  }