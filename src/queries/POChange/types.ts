import { PO_CHANGE_FORM_NUMBER } from './enums';

export interface PostPOChangeTypePayload {
  poId: string;
  formNumber: PO_CHANGE_FORM_NUMBER;
}
