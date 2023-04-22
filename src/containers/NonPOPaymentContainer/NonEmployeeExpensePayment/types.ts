import { UpsertNonEmployeeTravelPayload } from 'src/queries/NonPOPayment/NonEmployeeTravel/types';
import { Vendor } from 'src/queries/Vendors';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { NonPOPaymentProjectItemFormValue } from '../AuthorizationForPayment/types';

export interface POPlaceholderFileAttachment {
  file: File;
  descriptions: string;
  size: string;
  isArtifact?: boolean;
}

export interface UpsertNonEmployeeTravelFormValue
  extends Omit<
    UpsertNonEmployeeTravelPayload,
    //override
    | 'vendorName'
    | 'vendorCode'
    | 'projectItems'
    | 'fromServiceDate'
    | 'toServiceDate'
    | 'startDepartureDate'
    | 'endArrivalDate'
  > {
  vendorName: Vendor | string;
  vendorCode: Vendor | string;
  projectItems: NonPOPaymentProjectItemFormValue[];
  fromServiceDate: Date;
  toServiceDate: Date;
  startDepartureDate: Date;
  endArrivalDate: Date;

  //form only
  placeholderFileAttachment: POPlaceholderFileAttachment;
}

export type UpsertNonEmployeeTravelFormikProps =
  CommonFormikProps<UpsertNonEmployeeTravelFormValue>;
