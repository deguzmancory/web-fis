import { FinancialProject } from 'src/queries/Projects';
import { AdditionalPOForm, UpsertPOPayload } from 'src/queries/PurchaseOrders';
import { Vendor } from 'src/queries/Vendors';
import { CommonFormikProps } from 'src/utils/commonTypes';

export interface AdditionalPOFormValue extends AdditionalPOForm {
  isExternalLink: boolean;
  href: string;
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
  > {
  projectTitle: string | FinancialProject;
  projectNumber: string | FinancialProject;
  vendorName: string | Vendor;
  vendorCode: string | Vendor;
  availableForms: AdditionalPOFormValue[];
  formAttachments: AdditionalPOFormValue[];
}

export type UpsertPOFormikProps = CommonFormikProps<UpsertPOFormValue>;
