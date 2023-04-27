import { EXPENDITURE_ITEM_FORM_KEY } from '../enums';
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

export const initialPettyCashItinerary = {
  destination: '',
  departureDate: null,
  arrivalDate: null,

  calcDays: null,
  minusDays: null,
  businessDays: null,

  lodgingFar: null,
  lodgingRate: null,
  lodgingExcess: null,
  lodgingDaysClaim: null,
  lodgingCost: null,
  miscFar: null,
  miscRate: null,
  miscExcess: null,
  miscDaysClaim: null,
  miscCost: null,
  miscEstimated: null,
};

export const initialPettyCashExpenditure = {
  item: '',
  leg: '',
  paymentMethod: '',
  description: '',
  amount: 0,
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
  date: '',

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

  //comments
  internalComments: '',

  remittanceLineItems: [initialPettyCashRemittanceLineItem],
  remittance: initialPettyCashRemittance,
};

export const travelExpenditureColumnNames = [
  EXPENDITURE_ITEM_FORM_KEY.ITEM,
  EXPENDITURE_ITEM_FORM_KEY.LEG,
  EXPENDITURE_ITEM_FORM_KEY.PAYMENT_METHOD,
  EXPENDITURE_ITEM_FORM_KEY.DESCRIPTION,
  EXPENDITURE_ITEM_FORM_KEY.AMOUNT,
];
