import { AdditionalPOForm, UpsertPOPayload } from 'src/queries/PurchaseOrders';
import { CommonFormikProps } from 'src/utils/commonTypes';

export interface AdditionalPOFormValue extends AdditionalPOForm {
  isExternalLink: boolean;
  href: string;
}

export interface UpsertPOFormValue
  extends Omit<UpsertPOPayload, 'availableForms' | 'formAttachments'> {
  availableForms: AdditionalPOFormValue[];
  formAttachments: AdditionalPOFormValue[];
}

export type UpsertPOFormikProps = CommonFormikProps<UpsertPOFormValue>;
