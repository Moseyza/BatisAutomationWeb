
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
