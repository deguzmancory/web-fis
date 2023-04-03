import { FinancialProject } from 'src/queries/Projects';
import {
  AdditionalPOForm,
  POEquipmentInventoryPayload,
  POLineItemPayload,
  UpsertPOPayload,
} from 'src/queries/PurchaseOrders';
import { Vendor } from 'src/queries/Vendors';
import { CommonFormikProps } from 'src/utils/commonTypes';

export interface AdditionalPOFormValue extends AdditionalPOForm {
  isExternalUrl: boolean;
  href: string;
}

export interface POLineItemFormValue extends Omit<POLineItemPayload, 'itemProjectNumber'> {
  itemProjectNumber: string | FinancialProject;
}

export interface POEquipmentInventoryFormValue
  extends Omit<POEquipmentInventoryPayload, 'equipmentType'> {
  equipmentType: string[];
}

export interface POPlaceholderFileAttachment {
  file: File;
  descriptions: string;
  size: string;
  isArtifact: boolean;
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
}

export type UpsertPOFormikProps = CommonFormikProps<UpsertPOFormValue>;
