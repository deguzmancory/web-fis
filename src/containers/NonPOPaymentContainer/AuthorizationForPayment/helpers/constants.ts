import { AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY } from '../enum';

export const initialAuthorizationPaymentProjectItem = {
  lineNumber: null,
  projectNumber: '',
  subProject: '',
  budgetCategory: '',
  subBudgetCategory: '',
  serviceDate: null,
  amount: null,
  description: '',
};

export const initialAuthorizationPaymentRemittance = {
  questionName: '',
  questionPhoneNumber: null,
  returnRemittanceFlag: null,
  remittanceAttention: '',
  remittanceStreet: '',
  remittanceCity: '',
  remittanceState: '',
  zipCode: '',
  zipCodePlus4: '',
  remittanceTotal: 0,
};

export const initialAuthorizationPaymentEquipmentInventory = {
  lineNumber: null,
  ownership: '',
  description: '',
  brandName: '',
  serialNumber: '',
  itemCost: null,
  preparerName: '',
  preparerPhone: '',
  locationOfEquipment: '',
  component: '',
  fabricatedA: '',
  fabricatedB: '',
  receiveDate: null,
};

export const initialAuthorizationPaymentRemittanceItem = {
  referenceNumber: '',
  customerAccountComment: '',
  amount: 0,
};

export const emptyUpsertAuthorizationFormValue = {
  // form only
  action: null,
  placeholderFileAttachment: null,

  // General Info
  loginName: '',
  date: '',
  requestNumber: 'To be assigned',
  vendorName: '',
  vendorCode: '',
  vendorAddress: '',
  documentNumber: '',
  directInquiriesTo: '',
  phoneNumber: '',
  faStaffReviewer: '',

  // Signature
  reasonForPayment: '',
  piSignature: '',
  faSignature: '',

  majorVersion: '',
  formName: '',
  shortFormName: '',
  docType: '',
  preferredPaymentMethod: '',
  preferredPaymentMethodTimestamp: '',
  minorVersion: null,
  total: 0,
  internalComments: '',
  paymentTotal: null,
  equipmentInventoryManualFlag: null,
  fileAttachments: [],
  formAttachments: [],

  projectLineItems: [initialAuthorizationPaymentProjectItem],
  remittance: initialAuthorizationPaymentRemittance,
  equipmentInventories: [initialAuthorizationPaymentEquipmentInventory],
  remittanceLineItems: [initialAuthorizationPaymentRemittanceItem],
};

export const authorizationLineItemsRemittanceColumnsNames = [
  AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY.REFERENCE_NUMBER,
  AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY.CUSTOMER_ACCOUNT_COMMENT,
  AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY.AMOUNT,
];
