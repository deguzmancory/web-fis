import { GetPresignedPayload } from '../File';
import { PO_CHANGE_FORM_NUMBER } from '../POChange/enums';
import { PO_ACTION, PO_DETAIL_STATUS, PO_DOCUMENT_TYPE } from './enums';

export interface SharedPODetail {
  //general info
  loginName: string;
  date: string;
  number: string;
  projectTitle: string;
  projectNumber: string;
  piName: string;
  projectPeriod: string;
  superquoteNumber: string;
  superquoteBidId: string;
  vendorName: string;
  vendorAddress: string;
  vendorCode: string;
  shipVia: string;
  shipTo: string;
  shipOther: string;
  deliveryBy: string;
  discountTerms: string;
  quotationNumber: string;
  directInquiriesTo: string;
  phoneNumber: string;
  faStaffReviewer: string;

  //purchase info
  confirming: boolean;
  getExempt: boolean;
  attachment31: boolean;
  fedAttachment: string;
  uhSubawardNumber: string;
  subtotal: number;
  taxRate: number;
  taxTotal: number;
  total: number;
  shippingTotal: number;

  //original purchase info
  originalShippingTotal?: string;
  originalSubtotal?: string;
  originalTaxTotal?: string;
  originalTotal?: string;

  //Internal Special Instructions
  internalA: string;
  internalA1: string;
  internalB: string;
  internalC: string;

  // External Special Instructions
  presetInstructions: string;
  externalSpecialInstructions: string;

  // send invoice info
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

  //Internal Comments
  poComments: string;

  //Authorized by
  signature: string;

  //for payload only
  address1: string;
  address2: string;
  address3: string;

  //get from response for logic and view purpose
  status?: PO_DETAIL_STATUS;
  auditTrails?: POAuditTrails[];
  documentType?: PO_DOCUMENT_TYPE;
  balance?: number;

  //poChange
  formNumber?: PO_CHANGE_FORM_NUMBER;
  originalPoNumber?: number;
  poChangeNumber?: number;
  reasonForChange?: string;
  amountChange?: number;

  //unknown //TODO: huy_dang check unused key
  majorVersion?: string;
  minorVersion: number;
  formName?: string;
  shortFormName?: string;
  zipcode?: string;
}

export interface UpsertPOPayload extends SharedPODetail {
  id?: string;
  action: PO_ACTION;

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
  modifiedDate: string;
  userType: string;
  printedDate: string;
  hasChangeDocument: boolean;
  hasFinalPdf: boolean;
  isHistorical: boolean;
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

export interface POAuditTrails {
  id?: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  user: string;
  action: string;
  username: string;
  userType: string;
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
  id?: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  uploadDate: string;
  size: string;
  description: string;
  isArtifact?: boolean;
  afterFinalApprove: boolean;
  url: string;
}

export interface PODeterminationPayload {
  id?: string;
  to: string;
  dDate: Date | string;
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
  reason2Ref: string;
  reason3: string;
  reason3Ref: string;
  reason4: string;
  reason4Ref: string;
  reason5: string;
  reason5Ref: string;
  reason6: string;
  reason6Ref: string;
  reason6PoNumber: string;
  reason6ContractNumber: string;
  reason7: string;
  costJustification: string;
  departmentHead: string;
  departmentHeadDate: Date | string;
  approvedDuo: string;
  approvedDuoDate: Date | string;
  requestForQuotationsLessThanThree: any; //TODO: Tuyen Tran will remove it
  requestForQuotationsInvitationForBidOnlyOne: string;
  requestForQuotationsInvitationForBidLowest: string;
}

export interface POSoleSourcePayload {
  id?: string;
  to: string;
  ssDate: string | Date;
  from: string;
  phone: string;
  department: string;
  priorReferenceNumber: string;
  statementReasons: string;
  serviceUnacceptableReasons: string;
  explanation: string;
  statementFrom: string;
  departmentHead: string;
  departmentHeadDate: Date | string;
  approvedDuo: string;
  approvedDuoDate: Date | string;
}

export interface POAuthToPurchasePayload {
  id?: string;
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
  id?: string;
  attachmentName: string;
  attachmentResponse: string;
  attachmentDate: Date | string;
}

export interface POEquipmentInventoryPayload {
  id?: string;
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
  id?: string;
  subcontractor: string;
  date: string | Date;
  project: string;
  subcontractorName: string;
  businessAddressAndTaxIdNumber: string;
  contractNumber: string;
  grantNumber: string;
  startDate: Date | string;
  endDate: Date | string;
  expenditures: string;
  executedDate: Date;
  principalInvestigator: string;
  subcontractorSignature: string;
  rcuhSignature: string;
  socSubcontractorName: string;
  socSubcontractorDate: Date;
  socSubcontractorSignature: string;
  socSubcontractorTitle: string;
}

export interface POAgreementPayload {
  id?: string;
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
  id?: string;
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
  id?: string;
  awardId: string;
  poNumber: string; // TODO: tuyen_tran: will remove if not need
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

export interface GetPresignedPOPayload extends GetPresignedPayload {
  id?: string;
}

export interface AddPoAttachmentPayload {
  id: string;
  name: string;
  size: string;
  description: string;
  isArtifact: boolean;
  url: string;
}

export interface DeletePoAttachmentPayload {
  id: string;
  attachmentId: string;
}

export interface GetPresignedPoAttachmentDownloadUrl extends DeletePoAttachmentPayload {}
