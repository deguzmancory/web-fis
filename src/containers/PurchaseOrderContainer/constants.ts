import { PATHS } from 'src/appConfig/paths';
import { PO_ADDITIONAL_FORM_CODE, PO_ADDITIONAL_FORM_EXTERNAL_LINK } from './enums';
import { AdditionalPOFormValue } from './types';

export const initialAvailableForms: AdditionalPOFormValue[] = [
  {
    name: 'Determination of Cost or Price Reasonableness',
    code: PO_ADDITIONAL_FORM_CODE.DETERMINATION,
    accessKey: '2',
    isExternalLink: false,
    href: `${PATHS.poAdditionalForm}/${PO_ADDITIONAL_FORM_CODE.DETERMINATION}`,
  },
  {
    name: 'Sole Source Justification',
    code: PO_ADDITIONAL_FORM_CODE.SOLE_SOURCE,
    accessKey: '3',
    isExternalLink: false,
    href: `${PATHS.poAdditionalForm}/${PO_ADDITIONAL_FORM_CODE.SOLE_SOURCE}`,
  },
  {
    name: 'Auth. to Purchase Equip. w/Fed. Contract or Grant Funds',
    code: PO_ADDITIONAL_FORM_CODE.AUTH_TO_PURCHASE,
    accessKey: '4',
    isExternalLink: false,
    href: `${PATHS.poAdditionalForm}/${PO_ADDITIONAL_FORM_CODE.AUTH_TO_PURCHASE}`,
  },
  {
    name: 'Equipment Inventory Form',
    code: PO_ADDITIONAL_FORM_CODE.EQUIPMENT_INVENTORY,
    accessKey: '5',
    isExternalLink: false,
    href: `${PATHS.poAdditionalForm}/${PO_ADDITIONAL_FORM_CODE.EQUIPMENT_INVENTORY}`,
  },
  {
    name: 'Subcontract Agreement',
    code: PO_ADDITIONAL_FORM_CODE.SUBCONTRACTOR,
    accessKey: '6',
    isExternalLink: false,
    href: `${PATHS.poAdditionalForm}/${PO_ADDITIONAL_FORM_CODE.SUBCONTRACTOR}`,
  },
  {
    name: 'Agreement for Services (UH Projects)',
    code: PO_ADDITIONAL_FORM_CODE.AGREEMENT_UH,
    accessKey: '7',
    isExternalLink: true,
    href: PO_ADDITIONAL_FORM_EXTERNAL_LINK.AGREEMENT_UH,
  },
  {
    name: 'Agreement for Services (Direct Projects)',
    code: PO_ADDITIONAL_FORM_CODE.AGREEMENT,
    accessKey: '8',
    isExternalLink: true,
    href: PO_ADDITIONAL_FORM_EXTERNAL_LINK.AGREEMENT,
  },
  {
    name: 'FFATA Data Collection for Subcontractor/Vendor',
    code: PO_ADDITIONAL_FORM_CODE.FFATA,
    accessKey: '9',
    isExternalLink: false,
    href: `${PATHS.poAdditionalForm}/${PO_ADDITIONAL_FORM_CODE.FFATA}`,
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
  ext: null,
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
  id: '',
  to: '',
  dDate: '',
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
  reason2Ref: null, //todo: update type
  reason3: null, //todo: update type
  reason3Ref: null, //todo: update type
  reason4: null, //todo: update type
  reason4Ref: null, //todo: update type
  reason5: null, //todo: update type
  reason5Ref: null, //todo: update type
  reason6: null, //todo: update type
  reason6Ref: null, //todo: update type
  reason6PoNumber: null, //todo: update type
  reason6ContractNumber: null, //todo: update type
  reason7: null, //todo: update type
  costJustification: '',
  departmentHead: '',
  departmentHeadDate: '',
  approvedDuo: null, //todo: update type
  approvedDuoDate: '',
  requestForQuotationsLessThanThree: null, //todo: update type
  requestForQuotationsInvitationForBidOnlyOne: null, //todo: update type
  requestForQuotationsInvitationForBidLowest: null, //todo: update type
};

export const initialSoleSourceValue = {
  to: '',
  ssDate: '',
  from: '',
  phone: '',
  department: '',
  priorReferenceNumber: '',
  statementReasons: '',
  serviceUnacceptableReasons: '',
  explanation: '',
  statementFrom: '',
  departmentHead: '',
  departmentHeadDate: '',
  approvedDuo: '',
  approvedDuoDate: '',
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
  responses: [],
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
  equipmentType: '',
  decal: '',
  partOfFabrication: '',
  finishedProductName: '',
  decal2: '',
  completedBy: '',
};

export const initialSubcontractorValue = {
  subcontractor: '',
  date: '',
  project: '',
  subcontractorName: '',
  businessAddressAndTaxIdNumber: '',
  contractNumber: '',
  grantNumber: '',
  startDate: '',
  endDate: '',
  expenditures: '',
  executedDate: '',
  principalInvestigator: '',
  subcontractorSignature: '',
  rcuhSignature: '',
  socSubcontractorName: '',
  socSubcontractorDate: '',
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

  documentType: '',
  majorVersion: '',
  minorVersion: null,
  formName: '',
  shortFormName: '',
  loginName: '',
  number: 'To be assigned',
  formNumber: '',
  projectTitle: '',
  projectNumber: '',
  piName: '',
  projectPeriod: '',
  faStaffReviewer: '',
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
  date: '',
  confirming: null,
  getExempt: null,
  taxRate: null,
  taxTotal: null,
  subtotal: null,
  total: null,
  shippingTotal: null,
  attachment31: null,
  fedAttachment: '',
  internalA: '',
  internalA1: '',
  internalB: '',
  internalC: '',
  presetInstructions: '',
  externalSpecialInstructions: '',
  sendInvoiceTo: '',
  sendInvoiceToClearFlag: null,
  sendInvoiceToFaEmail: '',
  invoiceDept: '',
  invoiceStreetAddress: '',
  invoiceCity: '',
  invoiceState: '',
  invoiceZip: '',
  invoiceZip4: '',
  invoiceCountry: '',
  signature: '',
  poComments: '',
  // amountChange: null, //todo: update type
  uhSubawardNumber: '',
  superquoteNumber: null,
  superquoteBidId: null,
  availableForms: initialAvailableForms,
  lineItems: [initialLineItemValue],
  fileAttachments: [],
  formAttachments: [],
  determination: initialDeterminationValue,
  soleSource: initialSoleSourceValue,
  authToPurchase: initialAuthToPurchaseValue,
  equipmentInventory: initialEquipmentInventoryValue,
  subcontractor: initialSubcontractorValue,
  agreement: initialAgreementValue,
  agreementUh: initialAgreementUhValue,
  ffata: initialFfataValue,

  //payload only
  address1: null,
  address2: null,
  address3: null,
};
