import { PATHS } from 'src/appConfig/paths';
import {
  PO_ADDITIONAL_FORM_CODE,
  PO_ADDITIONAL_FORM_EXTERNAL_LINK,
  PO_LINE_ITEM_KEY,
} from '../enums';
import { AdditionalPOFormValue } from '../types';

export const initialAvailableForms: AdditionalPOFormValue[] = [
  {
    name: 'Determination of Cost or Price Reasonableness',
    code: PO_ADDITIONAL_FORM_CODE.DETERMINATION,
    accessKey: '2',
    isExternalUrl: false,
    href: `${PATHS.poAdditionalForm}/${PO_ADDITIONAL_FORM_CODE.DETERMINATION}`,
  },
  {
    name: 'Sole Source Justification',
    code: PO_ADDITIONAL_FORM_CODE.SOLE_SOURCE,
    accessKey: '3',
    isExternalUrl: false,
    href: `${PATHS.poAdditionalForm}/${PO_ADDITIONAL_FORM_CODE.SOLE_SOURCE}`,
  },
  {
    name: 'Auth. to Purchase Equip. w/Fed. Contract or Grant Funds',
    code: PO_ADDITIONAL_FORM_CODE.AUTH_TO_PURCHASE,
    accessKey: '4',
    isExternalUrl: false,
    href: `${PATHS.poAdditionalForm}/${PO_ADDITIONAL_FORM_CODE.AUTH_TO_PURCHASE}`,
  },
  {
    name: 'Equipment Inventory Form',
    code: PO_ADDITIONAL_FORM_CODE.EQUIPMENT_INVENTORY,
    accessKey: '5',
    isExternalUrl: false,
    href: `${PATHS.poAdditionalForm}/${PO_ADDITIONAL_FORM_CODE.EQUIPMENT_INVENTORY}`,
  },
  {
    name: 'Subcontract Agreement',
    code: PO_ADDITIONAL_FORM_CODE.SUBCONTRACTOR,
    accessKey: '6',
    isExternalUrl: false,
    href: `${PATHS.poAdditionalForm}/${PO_ADDITIONAL_FORM_CODE.SUBCONTRACTOR}`,
  },
  {
    name: 'FFATA Data Collection for Subcontractor/Vendor',
    code: PO_ADDITIONAL_FORM_CODE.FFATA,
    accessKey: '9',
    isExternalUrl: false,
    href: `${PATHS.poAdditionalForm}/${PO_ADDITIONAL_FORM_CODE.FFATA}`,
  },
];

export const externalFormAttachments = [
  {
    name: 'Agreement for Services (UH Projects)',
    code: PO_ADDITIONAL_FORM_CODE.AGREEMENT_UH,
    accessKey: '7',
    isExternalUrl: true,
    href: PO_ADDITIONAL_FORM_EXTERNAL_LINK.AGREEMENT_UH,
  },
  {
    name: 'Agreement for Services (Direct Projects)',
    code: PO_ADDITIONAL_FORM_CODE.AGREEMENT,
    accessKey: '8',
    isExternalUrl: true,
    href: PO_ADDITIONAL_FORM_EXTERNAL_LINK.AGREEMENT,
  },
];

export const initialAvailableFormValue = {
  name: '',
  code: '',
  accessKey: '',
};

export const initialLineItemValue = {
  itemProjectNumber: '',
  subProject: '',
  budgetCategory: '',
  subBudgetCategory: '',
  description: '',
  quantity: '',
  unit: '',
  unitPrice: null,
  ext: 0,
};

export const initialLineItemPOChangeValue = {
  itemProjectNumber: '',
  subProject: '',
  budgetCategory: '',
  subBudgetCategory: '',
  description: '',
  quantity: '',
  unit: '',
  unitPrice: null,
  ext: 0,
  isOriginal: false,
};

export const initialFileAttachmentValue = {
  id: '',
  name: '',
  uploadDate: '',
  size: '',
  description: '',
  isArtifact: null,
  afterFinalApprove: null,
  url: '',
};

export const initialFormAttachmentValue = {
  id: '',
  accessKey: '',
  code: '',
  name: '',
};

export const initialDeterminationValue = {
  to: '',
  dDate: new Date(),
  from: '',
  phone: '',
  department: '',
  soleSource: '',
  emergencyProcurement: '',
  competitiveBidding: '',
  requestForProposals: '',
  priceAdjustment: '',
  priceAdjPoNumber: '',
  priceAdjContractNumber: '',
  requestForQuotationsOneQuote: '',
  requestForQuotationsLowest: '',
  exemptProcurement: '',
  exemptionNumber: '',
  professionalSvcProcurement: '',
  extension: '',
  beneficialReason: '',
  other: '',
  expenditureConditionOther: '',
  reason1: '',
  reason1Ref: '',
  reason2: '',
  reason2Ref: '',
  reason3: '',
  reason3Ref: '',
  reason4: '',
  reason4Ref: '',
  reason5: '',
  reason5Ref: '',
  reason6: '',
  reason6Ref: '',
  reason6PoNumber: '',
  reason6ContractNumber: '',
  reason7: '',
  costJustification: '',
  departmentHead: '',
  departmentHeadDate: null,
  approvedDuo: '',
  approvedDuoDate: null,
  requestForQuotationsLessThanThree: null, //TODO: Tuyen Tran will remove it if not need
  requestForQuotationsInvitationForBidOnlyOne: '',
  requestForQuotationsInvitationForBidLowest: '',
};

export const initialSoleSourceValue = {
  to: '',
  ssDate: new Date(),
  from: '',
  phone: '',
  department: '',
  priorReferenceNumber: '',
  statementReasons: '',
  serviceUnacceptableReasons: '',
  explanation: '',
  statementFrom: '',
  departmentHead: '',
  departmentHeadDate: null,
  approvedDuo: '',
  approvedDuoDate: null,
};

export const initialAuthToPurchaseLineItemsValue = {
  attachmentName: '',
  attachmentResponse: '',
  attachmentDate: null,
};

export const initialAuthToPurchaseValue = {
  grantNumber: '',
  contractNumber: '',
  accountNumber: '',
  requiresPriorApproval: '',
  notRequirePriorApproval: '',
  notRequirePriorApprovalReason: '',
  equipmentTitleVested: '',
  fed: '',
  uni: '',
  costSharing: '',
  federalPercentage: '',
  statePercentage: '',
  ipe: '',
  dd: '',
  remarks: '',
  equipmentDescription: '',
  project: '',
  estimatedCost: '',
  availabilityNotExistsReason: '',
  formCompletedBy: '',
  multipleFederalSponsors: '',
  responses: [initialAuthToPurchaseLineItemsValue],
};

export const initialAuthToPurchaseResponseValue = {
  attachmentName: '',
  attachmentResponse: '',
  attachmentDate: '',
};

export const initialEquipmentInventoryValue = {
  buildingCode: '',
  equipmentDescription: '',
  equipmentLocation: '',
  equipmentType: [],
  decal: '',
  partOfFabrication: '',
  finishedProductName: '',
  decal2: '',
  completedBy: '',
};

export const initialSubcontractorValue = {
  subcontractor: '',
  date: new Date(),
  project: '',
  subcontractorName: '',
  businessAddressAndTaxIdNumber: '',
  contractNumber: '',
  grantNumber: '',
  startDate: null,
  endDate: null,
  expenditures: '',
  executedDate: null,
  principalInvestigator: '',
  subcontractorSignature: '',
  rcuhSignature: '',
  socSubcontractorName: '',
  socSubcontractorDate: null,
  socSubcontractorSignature: '',
  socSubcontractorTitle: '',
};

export const initialAgreementValue = {
  day: '',
  month: '',
  year: '',
  project: '',
  contractorName: '',
  business: '',
  stateOf: '',
  state: '',
  projectAuthoritySignature: '',
  contractorSignature: '',
  rcuhSignature: '',
  scope: '',
  timeTable: '',
  compensation: '',
  socContractorSignature: '',
  specialConditions: '',
  attachment4Contractor: '',
  exceed: '',
  rcuhTitle: '',
  socContractorTitle: '',
  rcuhName: '',
  rcuhTitle2: '',
  rcuhDepartment: '',
};

export const initialAgreementUhValue = {
  day: '',
  month: '',
  year: '',
  project: '',
  contractorName: '',
  business: '',
  stateOf: '',
  state: '',
  projectAuthoritySignature: '',
  contractorSignature: '',
  rcuhSignature: '',
  scope: '',
  timeTable: '',
  compensation: '',
  socContractorSignature: '',
  specialConditions: '',
  exceed: '',
  attachment4Contractor: '',
  rcuhTitle: '',
  socContractorTitle: '',
  rcuhName: '',
  rcuhTitle2: '',
  rcuhDepartment: '',
};

export const initialFfataValue = {
  awardId: '',
  poNumber: '',
  poDate: '',
  subawardAmount: '',
  nameOrDba: '',
  subawardeeDuns: '',
  subawardeeDuns4Extension: '',
  exceeds300000: null,
  subawardTitleAndDesc: '',
  sameAddress: null,
  performanceSiteAddressStreet: '',
  performanceSiteAddressCity: '',
  performanceSiteAddressState: '',
  performanceSiteAddressCountry: '',
  performanceSiteAddressZip: '',
};

export const emptyUpsertPOFormValue = {
  action: null,

  // general info
  loginName: '',
  date: '',
  number: 'To be assigned',
  projectTitle: '',
  projectNumber: '',
  piName: '',
  projectPeriod: '',
  superquoteNumber: '',
  superquoteBidId: null,
  vendorName: '',
  vendorAddress: '',
  vendorCode: '',
  shipTo: '',
  shipVia: '',
  shipOther: '',
  deliveryBy: '',
  discountTerms: '',
  quotationNumber: '',
  directInquiriesTo: '',
  phoneNumber: '',
  faStaffReviewer: '',

  // line items
  lineItems: [initialLineItemValue],

  // purchase info
  confirming: false,
  getExempt: false,
  attachment31: false,
  fedAttachment: null,
  uhSubawardNumber: '',
  taxRate: null,
  taxTotal: null,
  subtotal: 0,
  shippingTotal: null,
  total: 0,

  // additional forms
  availableForms: initialAvailableForms,
  formAttachments: [],

  // additional form keys
  determination: initialDeterminationValue,
  soleSource: initialSoleSourceValue,
  authToPurchase: initialAuthToPurchaseValue,
  equipmentInventory: initialEquipmentInventoryValue,
  subcontractor: initialSubcontractorValue,
  agreement: initialAgreementValue,
  agreementUh: initialAgreementUhValue,
  ffata: initialFfataValue,

  //Internal Special Instructions
  internalA: '',
  internalA1: '',
  internalB: '',
  internalC: '',

  // External Special Instructions
  presetInstructions: '',
  externalSpecialInstructions: '',

  // send invoice info
  sendInvoiceTo: '',
  sendInvoiceToClearFlag: false,
  sendInvoiceToFaEmail: '',
  invoiceDept: '',
  invoiceStreetAddress: '',
  invoiceCity: '',
  invoiceState: '',
  invoiceZip: '',
  invoiceZip4: '',
  invoiceCountry: '',

  //Authorized by
  signature: '',

  //Internal Comments
  poComments: '',
  // amountChange: null, //todo: update type

  //attachments
  fileAttachments: [],

  //payload only
  address1: null,
  address2: null,
  address3: null,
  placeholderFileAttachment: null,
  documentType: null,

  //poChange
  formNumber: null,

  //junk
  majorVersion: '',
  minorVersion: null,
  formName: '',
  shortFormName: '',
};

export const lineItemsColumnNames = [
  PO_LINE_ITEM_KEY.SUB_PROJECT,
  PO_LINE_ITEM_KEY.BUDGET_CATEGORY,
  PO_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY,
  PO_LINE_ITEM_KEY.DESCRIPTION,
  PO_LINE_ITEM_KEY.QUANTITY,
  PO_LINE_ITEM_KEY.UNIT,
  PO_LINE_ITEM_KEY.UNIT_PRICE,
  PO_LINE_ITEM_KEY.EXT,
];
