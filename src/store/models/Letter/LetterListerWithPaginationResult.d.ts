import Title from "@/store/models/Letter/Title";
import {Letter} from "@/store/models/Letter/Letter";

export default interface LetterListerWithPaginationResult {
    letterList?: (Letter)[] | null;
    from: string;
    to: string;
  }
