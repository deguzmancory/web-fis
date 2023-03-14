export enum PO_AUTH_TO_PURCHASE_KEY {
  GRANT_NUMBER = 'grantNumber',
  CONTRACT_NUMBER = 'contractNumber',
  ACCOUNT_NUMBER = 'accountNumber',
  REQUIRES_PRIOR_APPROVAL = 'requiresPriorApproval',
  NOT_REQUIRES_PRIOR_APPROVAL = 'notRequirePriorApproval',
  NOT_REQUIRES_PRIOR_APPROVAL_REASON = 'notRequirePriorApprovalReason',
  EQUIPMENT_TITLE_VESTED = 'equipmentTitleVested',
  FED = 'fed',
  UNI = 'uni',
  MULTIPLE_FEDERAL_SPONSORS = 'multipleFederalSponsors',
  COST_SHARING = 'costSharing',
  FEDERAL_PERCENTAGE = 'federalPercentage',
  STATE_PERCENTAGE = 'statePercentage',
  IPE = 'ipe',
  DD = 'dd',
  REMARKS = 'remarks',
  EQUIPMENT_DESCRIPTION = 'equipmentDescription',
  PROJECT = 'project',
  ESTIMATED_COST = 'estimatedCost',
  //
  RESPONSES = 'responses',
  AVAILABILITY_NOT_EXISTS_REASON = 'availabilityNotExistsReason',
  FORM_COMPLETED_BY = 'formCompletedBy',
}

export enum PO_AUTH_TO_PURCHASE_LINE_ITEM_KEY {
  ATTACHMENT_NAME = 'attachmentName',
  ATTACHMENT_RESPONSE = 'attachmentResponse',
  ATTACHMENT_DATE = 'attachmentDate',
}
