import {
  POGeneralInfo,
  POLineItem,
  POPaymentLineItem,
  POPurchaseInfo,
  UpdatePOPaymentPayload,
} from 'src/queries';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { POPlaceholderFileAttachment } from '../PurchaseOrderContainer/types';

export interface UpdatePOPaymentFormValue
  extends POGeneralInfo,
    POPurchaseInfo,
    Omit<UpdatePOPaymentPayload, 'paymentLineItems'> {
  lineItems: POLineItem[];

  //payment summary
  advancePaymentLineItem: POPaymentLineItem[];
  partialOrFinalPaymentLineItem: POPaymentLineItem[];

  //attachments
  placeholderFileAttachment: POPlaceholderFileAttachment;
}

export type UpdatePOPaymentFormikProps = CommonFormikProps<UpdatePOPaymentFormValue>;
