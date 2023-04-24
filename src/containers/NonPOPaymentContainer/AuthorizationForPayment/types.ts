import { FinancialProject, Vendor } from 'src/queries';
import { UpsertAuthorizationPayload } from 'src/queries/NonPOPayment/AuthorizationForPayment/types';
import { NonPOPaymentProjectLineItem } from 'src/queries/NonPOPayment/types';
import { CommonFormikProps } from 'src/utils/commonTypes';

export interface NonPOPaymentProjectItemFormValue
  extends Omit<NonPOPaymentProjectLineItem, 'projectNumber' | 'serviceDate'> {
  projectNumber: string | FinancialProject;
  serviceDate: Date;
}

export interface POPlaceholderFileAttachment {
  file: File;
  descriptions: string;
  size: string;
  isArtifact?: boolean;
}

export interface UpsertAuthorizationFormValue
  extends Omit<UpsertAuthorizationPayload, 'vendorName' | 'vendorCode' | 'projectLineItems'> {
  vendorName: string | Vendor;
  vendorCode: string | Vendor;
  projectLineItems: NonPOPaymentProjectItemFormValue[];

  //form only
  placeholderFileAttachment: POPlaceholderFileAttachment;

  //equipment inventories
  paymentNumberOfEquipmentInventories: number;
}

export type UpsertAuthorizationPaymentFormikProps = CommonFormikProps<UpsertAuthorizationFormValue>;
