import { GetPresignedPayload } from '../File';
import { PO_CHANGE_FORM_NUMBER } from '../POChange/enums';
import { PO_ACTION, PO_DETAIL_STATUS, PO_DOCUMENT_TYPE } from './enums';

export interface POGeneralInfo {
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
}

export interface POPurchaseInfo {
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
}

export interface POOriginalPurchaseInfo {
  originalShippingTotal?: string;
  originalSubtotal?: string;
  originalTaxTotal?: string;
  originalTotal?: string;
}

export interface POExternalSpecialInstruction {
  presetInstructions: string;
  externalSpecialInstructions: string;
}

export interface POInternalSpecialInstruction {
  internalA: string;
  internalA1: string;
  internalB: string;
  internalC: string;
}

export interface POSendInvoiceInfo {
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
}

export interface SharedPODetail
  extends POGeneralInfo,
    POPurchaseInfo,
    POOriginalPurchaseInfo,
    POInternalSpecialInstruction,
    POExternalSpecialInstruction,
    POSendInvoiceInfo {
  // general info

  // purchase info

  // original purchase info

  // Internal Special Instructions

  // External Special Instructions

  // send invoice info

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

// PO & PO change
export interface UpsertPOPayload extends SharedPODetail {
  id?: string;
  action: PO_ACTION;

  availableForms: AdditionalPOForm[];
  lineItems: POLineItem[];
  fileAttachments: POFileAttachment[];
  formAttachments: AdditionalPOForm[];
  determination: PODetermination;
  soleSource: POSoleSource;
  authToPurchase: POAuthToPurchase;
  equipmentInventory: POEquipmentInventory;
  subcontractor: Subcontractor;
  agreement: POAgreement;
  agreementUh: POAgreementUh;
  ffata: POFfata;
}

export interface PODetailResponse extends SharedPODetail {
  id?: string;
  createdAt: string;
  updatedAt: string;

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

export interface POAgreementResponse extends POAgreement, POCommonResponse {}

export interface POAgreementUhResponse extends POAgreementUh, POCommonResponse {}

export interface POFileAttachmentResponse extends POFileAttachment {
  purchaseOrderId: string;
}

export interface POAdditionalFormResponse extends AdditionalPOForm, POCommonResponse {}

export interface PODeterminationResponse extends PODetermination, POCommonResponse {}

export interface POLineItemResponse extends POLineItem, POCommonResponse {}

export interface POSoleSourceResponse extends POSoleSource, POCommonResponse {}

export interface POAuthToPurchaseResponse extends POAuthToPurchase, POCommonResponse {}

export interface POEquipmentInventoryResponse extends POEquipmentInventory, POCommonResponse {}

export interface SubcontractorResponse extends Subcontractor, POCommonResponse {}

export interface FfataReponse extends POFfata, POCommonResponse {}

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

export interface POLineItem {
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

export interface POFileAttachment {
  id?: string;
  createdAt?: string;
  updatedAt?: string;

  name: string;
  uploadDate: string;
  size: string;
  description: string;
  isArtifact?: boolean;
  afterFinalApprove: boolean;
  url: string;
}

export interface PODetermination {
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

export interface POSoleSource {
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

export interface POAuthToPurchase {
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
  responses: AuthToPurchase[];
}

export interface AuthToPurchase {
  id?: string;
  attachmentName: string;
  attachmentResponse: string;
  attachmentDate: Date | string;
}

export interface POEquipmentInventory {
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

export interface Subcontractor {
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

export interface POAgreement {
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

export interface POAgreementUh {
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

export interface POFfata {
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
