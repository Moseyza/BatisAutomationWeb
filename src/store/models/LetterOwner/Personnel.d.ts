export interface Personnel {
    personnelId: string;
    firstName: string;
    lastName: string;
    fatherName?: string | null;
    nationalCode?: string | null;
    birthDate: string;
    gender: number;
    email?: string | null;
    address?: string | null;
    homePhone?: string | null;
    persCode: string;
    pictureId: string;
    personnelPicture?: null;
    personnelSignId: string;
    personnelSign?: null;
    personnelStampId: string;
    personnelStamp?: null;
  }
  