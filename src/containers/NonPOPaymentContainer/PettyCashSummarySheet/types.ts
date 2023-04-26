import { UpsertPettyCashPayload } from 'src/queries/NonPOPayment/PettyCash/types';
import { Vendor } from 'src/queries/Vendors';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { NonPOPaymentProjectItemFormValue } from '../AuthorizationForPayment/types';

export interface POPlaceholderFileAttachment {
  file: File;
  descriptions: string;
  size: string;
  isArtifact?: boolean;
}

export interface UpsertPettyCashFormValue
  extends Omit<
    UpsertPettyCashPayload,
    //override
    'vendorName' | 'vendorCode' | 'projectLineItems'
  > {
  vendorName: Vendor | string;
  vendorCode: Vendor | string;
  projectLineItems: NonPOPaymentProjectItemFormValue[];

  //form only
  placeholderFileAttachment: POPlaceholderFileAttachment;
}

export type UpsertPettyCashFormikProps = CommonFormikProps<UpsertPettyCashFormValue>;
