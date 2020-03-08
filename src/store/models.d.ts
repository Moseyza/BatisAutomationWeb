export interface LetterDto {
    id: string;
    title: string;
    from: string;
    date: string;
    summary: string;
    number: string;
    footNote?: string | null;
  }

  export interface LetterList{
    letters:LetterDto[];
  }
  