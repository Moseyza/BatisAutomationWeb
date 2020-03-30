import { LetterOwnerEmail } from "@/store/models/LetterOwner/LetterOwnerEmail";
import { CompanyLetterOwnerPhoneNumber } from "@/store/models/LetterOwner/CompanyLetterOwnerPhoneNumber";
import { LetterOwner } from "@/store/models/LetterOwner/LetterOwner";

export class LetterOwnerForSendingFaxAndEmailAndSms extends LetterOwner {
  childMainReceivers?: (LetterOwnerForSendingFaxAndEmailAndSms | null)[] | null;
  childCopyReceivers?: (LetterOwnerForSendingFaxAndEmailAndSms | null)[] | null;
  childDraftReceivers?: (LetterOwnerForSendingFaxAndEmailAndSms | null)[] | null;
  shallSendSms: boolean;
  trySendToRandomEmail: boolean;
  emails?: (LetterOwnerEmail | null)[] | null;
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



