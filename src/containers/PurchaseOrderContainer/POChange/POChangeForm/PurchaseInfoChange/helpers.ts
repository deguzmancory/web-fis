import { getOptionsByEnum } from 'src/utils';

export const MAX_TAX_NUMBER = 10000000;

export enum FED_ATTACHMENT_VALUE {
  ATTACHMENT_32A = 'Attachment 32a, Terms and Conditions Applicable to Contracts/Subcontracts/Purchase Orders (Under Federal Grants)',
  ATTACHMENT_32B = 'Attachment 32b, Federal Provisions Government Subcontract Provisions Incorporated in all Subcontracts/Purchase Orders (Under Federal Prime Contracts)',
  ATTACHMENT_32C = 'Attachment 32c, Federal Provisions Applicable When Subcontractor (Commercial Entity) is in Possession of Government Property Government Subcontract Provisions Incorporated in All Subcontracts/Purchase Orders (Under Cost-Type Prime Cost Reimbursable Contracts)',
  ATTACHMENT_32D = 'Attachment 32d, Federal Provisions Applicable When Subcontractor (Educational or Nonprofit) is in Possession of Government Property Government Subcontract Provisions Incorporated in All Subcontracts/Purchase Orders (Under Cost-Type Prime Cost Reimbursable Contracts)',
  NON_FEDERAL = 'Non-Federal',
  UH_SUBAWARD = 'UH Subaward',
}

export const fedAttachmentOptions = getOptionsByEnum(FED_ATTACHMENT_VALUE).slice(0, -1); //remove last item (UH_SUBAWARD) for custom input field inline purpose
