export enum FED_ATTACHMENT_VALUE {
  ATTACHMENT_32A = 'Attachment 32a, Terms and Conditions Applicable to Contracts/Subcontracts/Purchase Orders (Under Federal Grants)',
  ATTACHMENT_32B = 'Attachment 32b, Federal Provisions Government Subcontract Provisions Incorporated in all Subcontracts/Purchase Orders (Under Federal Prime Contracts)',
  ATTACHMENT_32C = 'Attachment 32c, Federal Provisions Applicable When Subcontractor (Commercial Entity) is in Possession of Government Property Government Subcontract Provisions Incorporated in All Subcontracts/Purchase Orders (Under Cost-Type Prime Cost Reimbursable Contracts)',
  ATTACHMENT_32D = 'Attachment 32d, Federal Provisions Applicable When Subcontractor (Educational or Nonprofit) is in Possession of Government Property Government Subcontract Provisions Incorporated in All Subcontracts/Purchase Orders (Under Cost-Type Prime Cost Reimbursable Contracts)',
  NON_FEDERAL = 'Non-Federal',
  UH_SUBAWARD = 'UH Subaward',
}

export const fedAttachmentOptions = [
  {
    label: FED_ATTACHMENT_VALUE.ATTACHMENT_32A,
    value: FED_ATTACHMENT_VALUE.ATTACHMENT_32A,
  },
  {
    label: FED_ATTACHMENT_VALUE.ATTACHMENT_32B,
    value: FED_ATTACHMENT_VALUE.ATTACHMENT_32B,
  },
  {
    label: FED_ATTACHMENT_VALUE.ATTACHMENT_32C,
    value: FED_ATTACHMENT_VALUE.ATTACHMENT_32C,
  },
  {
    label: FED_ATTACHMENT_VALUE.ATTACHMENT_32D,
    value: FED_ATTACHMENT_VALUE.ATTACHMENT_32D,
  },
  {
    label: FED_ATTACHMENT_VALUE.NON_FEDERAL,
    value: FED_ATTACHMENT_VALUE.NON_FEDERAL,
  },
];
