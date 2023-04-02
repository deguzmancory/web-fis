import { PO_CHANGE_FORM_NUMBER } from 'src/containers/POChange/SelectChangeFormType/enums';

export interface PostPOChangeTypePayload {
  poId: string;
  formNumber: PO_CHANGE_FORM_NUMBER;
}
