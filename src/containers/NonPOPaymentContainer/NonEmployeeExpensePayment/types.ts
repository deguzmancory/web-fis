import {
  NonEmployeeTravelProjectItem,
  UpsertNonEmployeeTravelPayload,
} from 'src/queries/NonPOPayment/NonEmployeeTravel/types';
import { FinancialProject } from 'src/queries/Projects';
import { Vendor } from 'src/queries/Vendors';
import { CommonFormikProps } from 'src/utils/commonTypes';

export interface NonEmployeeTravelProjectItemFormValue
  extends Omit<NonEmployeeTravelProjectItem, 'projectNumber' | 'serviceDate'> {
  projectNumber: string | FinancialProject;
  serviceDate: Date;
}

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
    'vendorName' | 'vendorCode' | 'projectItems' | 'fromServiceDate' | 'toServiceDate'
  > {
  vendorName: string | Vendor;
  vendorCode: string | Vendor;
  projectItems: NonEmployeeTravelProjectItemFormValue[];
  fromServiceDate: Date;
  toServiceDate: Date;

  //form only
  placeholderFileAttachment: POPlaceholderFileAttachment;
}

export type UpsertNonEmployeeTravelFormikProps =
  CommonFormikProps<UpsertNonEmployeeTravelFormValue>;
