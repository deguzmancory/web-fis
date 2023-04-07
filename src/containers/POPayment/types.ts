import { POGeneralInfo, POLineItem, POPurchaseInfo, UpdatePOPaymentPayload } from 'src/queries';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { POPlaceholderFileAttachment } from '../PurchaseOrderContainer/types';

export interface UpdatePOPaymentFormValue
  extends POGeneralInfo,
    POPurchaseInfo,
    UpdatePOPaymentPayload {
  lineItems: POLineItem[];
  placeholderFileAttachment: POPlaceholderFileAttachment;
}

export type UpdatePOPaymentFormikProps = CommonFormikProps<UpdatePOPaymentFormValue>;
