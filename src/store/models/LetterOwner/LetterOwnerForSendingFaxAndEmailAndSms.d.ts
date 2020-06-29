import { LetterOwnerEmail } from "@/store/models/LetterOwner/LetterOwnerEmail";
import { CompanyLetterOwnerPhoneNumber } from "@/store/models/LetterOwner/CompanyLetterOwnerPhoneNumber";
import { LetterOwner } from "@/store/models/LetterOwner/LetterOwner";

export class LetterOwnerForSendingFaxAndEmailAndSms extends LetterOwner {
  childMainReceivers?: LetterOwnerForSendingFaxAndEmailAndSms[];
  childCopyReceivers?: LetterOwnerForSendingFaxAndEmailAndSms[];
  childDraftReceivers?: LetterOwnerForSendingFaxAndEmailAndSms[];
  shallSendSms: boolean;
  trySendToRandomEmail: boolean;
  emails: LetterOwnerEmail[];
  trySendToRandomFax: boolean;
  faxes?: (CompanyLetterOwnerPhoneNumber | null)[] | null;
  parentRemoteLetterPossessionId: string;
  dueDate?: null;
  partIndexes?: (null)[] | null;
  shallSendViaMessagingApp: boolean;
  shallSendFax: boolean;
  shallSendEmail: boolean;
  mustBecomeSecure: boolean;
  requiresFollowUp: boolean;
 
}



