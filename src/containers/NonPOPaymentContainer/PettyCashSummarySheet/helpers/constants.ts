import { UpsertPettyCashFormValue } from '../types';

export const initialPettyCashProjectItem = {
  lineNumber: null,
  projectNumber: '',
  subProject: '',
  budgetCategory: '',
  subBudgetCategory: '',
  serviceDate: null,
  amount: 0,
  description: '',
};

export const initialPettyCashRemittanceLineItem = {
  referenceNumber: '',
  amount: 0,
  lineNumber: null,
  customerAccountComment: '',
};

export const initialPettyCashRemittance = {
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

export const emptyUpsertPettyCashFormValue: UpsertPettyCashFormValue = {
  // form only
  action: null,
  placeholderFileAttachment: null,

  //general info
  requestNumber: 'To be assigned',
  loginName: null,
  createdDate: '',

  beginDate: null,
  endDate: null,
  projectName: '',
  projectAddress: '',
  documentNumber: '',

  advancedCash: null,
  cashOnHand: null,
  expenses: null,
  cashInTransit: null,
  totalPettyCash: 0,

  vendorName: '',
  vendorCode: null,
  vendorAddress: '',
  directInquiriesTo: '',
  phoneNumber: '',
  faStaffReviewer: '',

  // project Items
  projectLineItems: [initialPettyCashProjectItem],
  paymentTotal: 0,

  //signatures
  piSignature: '',
  faSignature: '',
  custodianSignature: '',

  //file attachments
  attachments: [],
  auditTrails: [],

  //comments
  internalComments: '',

  remittanceLineItems: [initialPettyCashRemittanceLineItem],
  remittance: initialPettyCashRemittance,
};
