import { FinancialProject } from 'src/queries/Projects';
import {
  AdditionalPOForm,
  POEquipmentInventory,
  POLineItem,
  UpsertPOPayload,
} from 'src/queries/PurchaseOrders';
import { Vendor } from 'src/queries/Vendors';
import { CommonFormikProps } from 'src/utils/commonTypes';

export interface AdditionalPOFormValue extends AdditionalPOForm {
  isExternalUrl: boolean;
  href: string;
}

export interface POLineItemFormValue extends Omit<POLineItem, 'itemProjectNumber'> {
  itemProjectNumber: string | FinancialProject;
}

export interface POOriginalLineItemFormValue extends Omit<POLineItem, 'itemProjectNumber'> {
  itemProjectNumber: string;
}

export interface POEquipmentInventoryFormValue extends Omit<POEquipmentInventory, 'equipmentType'> {
  equipmentType: string[];
}

export interface POPlaceholderFileAttachment {
  file: File;
  descriptions: string;
  size: string;
  isArtifact?: boolean;
}

export interface UpsertPOFormValue
  extends Omit<
    UpsertPOPayload,
    //override
    | 'availableForms'
    | 'formAttachments'
    | 'projectTitle'
    | 'projectNumber'
    | 'vendorName'
    | 'vendorCode'
    | 'lineItems'
    | 'equipmentInventory'
  > {
  placeholderFileAttachment: POPlaceholderFileAttachment;
  projectTitle: string | FinancialProject;
  projectNumber: string | FinancialProject;
  vendorName: string | Vendor;
  vendorCode: string | Vendor;
  availableForms: AdditionalPOFormValue[];
  formAttachments: AdditionalPOFormValue[];
  lineItems: POLineItemFormValue[];
  equipmentInventory: POEquipmentInventoryFormValue;

  //po change
  originalLineItems?: POOriginalLineItemFormValue[];
}

export type UpsertPOFormikProps = CommonFormikProps<UpsertPOFormValue>;
