export interface SharedPODetail {
  documentType: string;
  majorVersion: string;
  minorVersion: number;
  formName: string;
  shortFormName: string;
  loginName: string;
  number: string;
  formNumber: string;
  projectTitle: string;
  projectNumber: string;
  piName: string;
  projectPeriod: string;
  faStaffReviewer: string;
  vendorName: string;
  vendorAddress: string;
  vendorCode: string;
  shipTo: string;
  shipVia: string;
  shipOther: string;
  deliveryBy: string;
  discountTerms: string;
  quotationNumber: string;
  directInquiriesTo: string;
  phoneNumber: string;
  date: string;
  confirming: boolean;
  getExempt: boolean;
  taxRate: number;
  taxTotal: number;
  subtotal: number;
  total: number;
  shippingTotal: number;
  attachment31: boolean;
  fedAttachment: string;
  internalA: string;
  internalA1: string;
  internalB: string;
  internalC: string;
  presetInstructions: string;
  signature: string;
  poComments: string;
  amountChange: number;
  uhSubawardNumber: string;
  superquoteNumber: string;
  superquoteBidId: string;
}

export interface UpsertPOPayload extends SharedPODetail {
  id?: string;

  availableForms: AdditionalPOForm[];
  lineItems: POLineItemPayload[];
  fileAttachments: POFileAttachmentPayload[];
  formAttachments: AdditionalPOForm[];
  determination: PODeterminationPayload;
  soleSource: POSoleSourcePayload;
  authToPurchase: POAuthToPurchasePayload;
  equipmentInventory: POEquipmentInventoryPayload;
  subcontractor: SubcontractorPayload;
  agreement: POAgreementPayload;
  agreementUh: POAgreementUhPayload;
  ffata: FfataPayload;
}

export interface PODetailResponse extends SharedPODetail {
  id?: string;

  createdAt: string;
  updatedAt: string;
  poChangeNumber: number;
  previousPoNumber: number;
  originalPoNumber: number;
  routeToFa: string;
  preparerEmail: string;
  faReviewer: string;
  faEmail: string;
  faName: string;
  faCode: string;
  faApprover: string;
  faApprovedDate: string;
  rcuhApprover: string;
  rcuhApprovedDate: string;
  finalApprovedDate: string;
  approved: any; //TODO: update type
  vendorName2: string;
  address1: string;
  address2: string;
  address3: string;
  zipcode: string;
  modifiedDate: string;
  originalTaxTotal: number;
  originalSubtotal: number;
  originalTotal: number;
  originalShippingTotal: number;
  externalSpecialInstructions: string;
  status: string;
  userType: string;
  sendInvoiceTo: string;
  sendInvoiceToClearFlag: boolean;
  sendInvoiceToFaEmail: string;
  invoiceDept: string;
  invoiceStreetAddress: string;
  invoiceCity: string;
  invoiceState: string;
  invoiceZip: string;
  invoiceZip4: string;
  invoiceCountry: string;
  printedDate: string;
  balance: number;
  hasChangeDocument: boolean;
  hasFinalPdf: boolean;
  isHistorical: boolean;
  reasonForChange: string;
  updateVersionNumber: number;
  paymentDirectInquiriesTo: string;
  paymentPhoneNumber: string;
  paymentFaStaffReviewer: string;
  paymentDate: string;
  paymentRequestNumber: string;
  paymentLoginName: string;
  paymentAuthorizedBy: string;
  paymentType: string;
  paymentReceiptAcknowledgement: string;
  paymentRemittanceDifferentName: string;
  paymentRemittanceDifferentAddress: string;
  paymentRemittanceDifferentAttn: string;
  paymentRemittanceDifferentStreet: string;
  paymentRemittanceDifferentCity: string;
  paymentRemittanceDifferentZip: string;
  paymentRemittanceDifferentZip4: string;
  paymentReturnRemittanceToFiscalOffice: boolean;
  paymentRemittanceAdviceName: string;
  paymentRemittanceAdvicePhoneNumber: string;
  paymentEquipmentInventoryManualFlag: boolean;
  paymentTotal: number;
  paymentRemittanceAdviceTotal: number;
  totalAmount: number;
  checkNumber: string;
  checkDate: string;
  remittanceVendorAddress: string;
  paymentRemittanceDifferentState: string;
  preferredPaymentMethod: string;
  preferredPaymentMethodTimestamp: string;
  paymentMethod: string;
  piUserId: string;
  faUserId: string;
  cuUserId: string;
  piOriginalUserId: string;
  faOriginalUserId: string;
  cuOriginalUserId: string;
  createdById: string;

  agreement: POAgreementResponse;
  agreementUh: POAgreementUhResponse;
  fileAttachments: POFileAttachmentResponse[];
  formAttachments: POAdditionalFormResponse[];
  determination: PODeterminationResponse;
  availableForms: POAdditionalFormResponse[];
  lineItems: POLineItemResponse[];
  soleSource: POSoleSourceResponse;
  authToPurchase: POAuthToPurchaseResponse;
  equipmentInventory: POEquipmentInventoryResponse;
  subcontractor: SubcontractorResponse;
  ffata: FfataReponse;
}

export interface POCommonResponse {
  createdAt: string;
  updatedAt: string;
  purchaseOrderId: string;
}

export interface POAgreementResponse extends POAgreementPayload, POCommonResponse {}

export interface POAgreementUhResponse extends POAgreementUhPayload, POCommonResponse {}

export interface POFileAttachmentResponse extends POFileAttachmentPayload, POCommonResponse {}

export interface POAdditionalFormResponse extends AdditionalPOForm, POCommonResponse {}

export interface PODeterminationResponse extends PODeterminationPayload, POCommonResponse {}

export interface POLineItemResponse extends POLineItemPayload, POCommonResponse {}

export interface POSoleSourceResponse extends POSoleSourcePayload, POCommonResponse {}

export interface POAuthToPurchaseResponse extends POAuthToPurchasePayload, POCommonResponse {}

export interface POEquipmentInventoryResponse
  extends POEquipmentInventoryPayload,
    POCommonResponse {}

export interface SubcontractorResponse extends SubcontractorPayload, POCommonResponse {}

export interface FfataReponse extends FfataPayload, POCommonResponse {}

export interface AdditionalPOForm {
  id?: string;
  name: string;
  code: string;
  accessKey: string;
}

export interface POLineItemPayload {
  id?: string;
  itemProjectNumber: string;
  subProject: string;
  budgetCategory: string;
  subBudgetCategory: string;
  description: string;
  quantity: string;
  unit: string;
  unitPrice: number;
  ext: number;
  isOriginal?: boolean;
}

export interface POFileAttachmentPayload {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  description: string;
  isArtifact: boolean;
  afterFinalApprove: boolean;
  url: string;
}

export interface PODeterminationPayload {
  id: string;
  to: string;
  dDate: string;
  from: string;
  phone: string;
  department: string;
  soleSource: string;
  emergencyProcurement: string;
  competitiveBidding: string;
  requestForProposals: string;
  priceAdjustment: string;
  priceAdjPoNumber: string;
  priceAdjContractNumber: string;
  requestForQuotationsOneQuote: string;
  requestForQuotationsLowest: string;
  exemptProcurement: string;
  exemptionNumber: string;
  professionalSvcProcurement: string;
  extension: string;
  beneficialReason: string;
  other: string;
  expenditureConditionOther: string;
  reason1: string;
  reason1Ref: string;
  reason2: string;
  reason2Ref: any; //todo: update type;
  reason3: any; //todo: update type;
  reason3Ref: any; //todo: update type;
  reason4: any; //todo: update type;
  reason4Ref: any; //todo: update type;
  reason5: any; //todo: update type;
  reason5Ref: any; //todo: update type;
  reason6: any; //todo: update type;
  reason6Ref: any; //todo: update type;
  reason6PoNumber: any; //todo: update type;
  reason6ContractNumber: any; //todo: update type;
  reason7: any; //todo: update type;
  costJustification: string;
  departmentHead: string;
  departmentHeadDate: string;
  approvedDuo: any; //todo: update type;
  approvedDuoDate: string;
  requestForQuotationsLessThanThree: any; //todo: update type;
  requestForQuotationsInvitationForBidOnlyOne: any; //todo: update type;
  requestForQuotationsInvitationForBidLowest: any; //todo: update type;
}

export interface POSoleSourcePayload {
  id: string;
  to: string;
  ssDate: string;
  from: string;
  phone: string;
  department: string;
  priorReferenceNumber: string;
  statementReasons: string;
  serviceUnacceptableReasons: string;
  explanation: string;
  statementFrom: string;
  departmentHead: string;
  departmentHeadDate: string;
  approvedDuo: string;
  approvedDuoDate: string;
}

export interface POAuthToPurchasePayload {
  id: string;
  grantNumber: string;
  contractNumber: string;
  accountNumber: string;
  requiresPriorApproval: string;
  notRequirePriorApproval: string;
  notRequirePriorApprovalReason: string;
  equipmentTitleVested: string;
  fed: string;
  uni: string;
  costSharing: string;
  federalPercentage: string;
  statePercentage: string;
  ipe: string;
  dd: string;
  remarks: string;
  equipmentDescription: string;
  project: string;
  estimatedCost: string;
  availabilityNotExistsReason: string;
  formCompletedBy: string;
  multipleFederalSponsors: string;
  responses: AuthToPurchaseResponse[];
}

export interface AuthToPurchaseResponse {
  id: string;
  attachmentName: string;
  attachmentResponse: string;
  attachmentDate: string;
}

export interface POEquipmentInventoryPayload {
  id: string;
  buildingCode: string;
  equipmentDescription: string;
  equipmentLocation: string;
  equipmentType: string;
  decal: string;
  partOfFabrication: string;
  finishedProductName: string;
  decal2: string;
  completedBy: string;
}

export interface SubcontractorPayload {
  id: string;
  subcontractor: string;
  date: string;
  project: string;
  subcontractorName: string;
  businessAddressAndTaxIdNumber: string;
  contractNumber: string;
  grantNumber: string;
  startDate: string;
  endDate: string;
  expenditures: string;
  executedDate: string;
  principalInvestigator: string;
  subcontractorSignature: string;
  rcuhSignature: string;
  socSubcontractorName: string;
  socSubcontractorDate: string;
  socSubcontractorSignature: string;
  socSubcontractorTitle: string;
}

export interface POAgreementPayload {
  id: string;
  day: string;
  month: string;
  year: string;
  project: string;
  contractorName: string;
  business: string;
  stateOf: string;
  state: string;
  projectAuthoritySignature: string;
  contractorSignature: string;
  rcuhSignature: string;
  scope: string;
  timeTable: string;
  compensation: string;
  socContractorSignature: string;
  specialConditions: string;
  attachment4Contractor: string;
  exceed: string;
  rcuhTitle: string;
  socContractorTitle: string;
  rcuhName: string;
  rcuhTitle2: string;
  rcuhDepartment: string;
}

export interface POAgreementUhPayload {
  id: string;
  day: string;
  month: string;
  year: string;
  project: string;
  contractorName: string;
  business: string;
  stateOf: string;
  state: string;
  projectAuthoritySignature: string;
  contractorSignature: string;
  rcuhSignature: string;
  scope: string;
  timeTable: string;
  compensation: string;
  socContractorSignature: string;
  specialConditions: string;
  exceed: string;
  attachment4Contractor: string;
  rcuhTitle: string;
  socContractorTitle: string;
  rcuhName: string;
  rcuhTitle2: string;
  rcuhDepartment: string;
}

export interface FfataPayload {
  id: string;
  awardId: string;
  poNumber: string;
  poDate: string;
  subawardAmount: string;
  nameOrDba: string;
  subawardeeDuns: string;
  subawardeeDuns4Extension: string;
  exceeds300000: boolean;
  subawardTitleAndDesc: string;
  sameAddress: boolean;
  performanceSiteAddressStreet: string;
  performanceSiteAddressCity: string;
  performanceSiteAddressState: string;
  performanceSiteAddressCountry: string;
  performanceSiteAddressZip: string;
}