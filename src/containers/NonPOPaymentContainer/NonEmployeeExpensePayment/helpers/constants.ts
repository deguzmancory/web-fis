import { EXPENDITURE_ITEM_FORM_KEY } from '../enums';
import { UpsertNonEmployeeTravelFormValue } from '../types';

export const initialNonEmployeeTravelProjectItem = {
  lineNumber: null,
  projectNumber: '',
  subProject: '',
  budgetCategory: '',
  subBudgetCategory: '',
  serviceDate: null,
  amount: 0,
  description: '',
};

export const initialNonEmployeeTravelItinerary = {
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

export const initialNonEmployeeTravelExpenditure = {
  item: '',
  leg: '',
  paymentMethod: '',
  description: '',
  amount: 0,
};

export const initialNonEmployeeTravelRemittanceLineItem = {
  number: '',
  amount: 0,
  lineNumber: null,
  customerAccountComment: '',
};

export const initialNonEmployeeTravelRemittance = {
  remittanceTotal: 0,
  questionName: '',
  questionPhoneNumber: '',
  returnRemittanceFlag: null,
};

export const emptyUpsertNonEmployeeTravelFormValue: UpsertNonEmployeeTravelFormValue = {
  // form only
  action: null,
  placeholderFileAttachment: null,

  // SelectPayeeCategory
  loginName: '',
  date: '',
  requestNumber: 'To be assigned',
  payeeCategory: null,

  //general info
  vendorName: null,
  vendorCode: null,
  positionTitle: '',
  employer: '', //todo: check
  vendorAddress: '',
  documentNumber: '',
  faStaffReviewer: '',
  projectContact: '',
  projectContactPhone: '',
  toServiceDate: null,
  fromServiceDate: null,

  // trip itinerary
  startDestination: 'Honolulu, HI',
  startDepartureDate: null,
  itineraries: [initialNonEmployeeTravelItinerary],
  endDestination: 'Honolulu, HI',
  endArrivalDate: null,
  tripTotal: 0,

  // travel expenditure
  expenditures: [initialNonEmployeeTravelExpenditure],
  advancedDocumentNumber: '',
  expenditureTotal: 0,
  amountAdvanced: 0,
  miscCostTotal: null,
  lodgingCostTotal: null,
  lodgingDaysClaimTotal: null,
  miscDaysClaimTotal: null,

  // project Items
  projectItems: [initialNonEmployeeTravelProjectItem],
  paymentTotal: 0,

  // Receipt Certification
  noReceiptSmallCorrectFlag: null,
  noReceiptAmount: null,

  acceptedDate: '',
  organization: '',
  homeAddress: '',
  purposeForTravel: '',
  phoneNumber: '',
  directInquiriesTo: '',
  internalComments: '',
  travelDetails: '',
  total: null,
  claimantSignature: '',
  piSignature: '',
  faSignature: '',
  completedBy: '',
  username: '',
  faCode: '',
  faName: '',
  faEmail: '',
  faApprover: '',
  faApprovedDate: '',
  rcuhApprover: '',
  rcuhApprovedDate: '',
  majorVersion: '',
  minorVersion: null,
  formName: '',
  shortFormName: '',
  firstProjectNumber: '',
  listedProjectNumber: '',
  hasFinalPdf: null,
  preparerEmail: '',
  checkNumber: '',
  checkDate: '',
  miscPaymentMethod: '',
  lodgingPaymentMethod: '',
  miscDescription: '',
  lodgingDescription: '',

  // daysClaimTotal: '',
  piName: '',
  updateVersionNumber: null,
  noReceiptCorrectFlag: null,
  noReceiptFormFlag: null,
  preferredPaymentMethod: '',
  preferredPaymentMethodTimestamp: '',
  paymentMethod: '',
  piUserId: '',
  faUserId: '',
  cuUserId: '',
  piOriginalUserId: '',
  faOriginalUserId: '',
  cuOriginalUserId: '',
  remittanceLineItems: [initialNonEmployeeTravelRemittanceLineItem],
  remittance: initialNonEmployeeTravelRemittance,
};

export const travelExpenditureColumnNames = [
  EXPENDITURE_ITEM_FORM_KEY.ITEM,
  EXPENDITURE_ITEM_FORM_KEY.LEG,
  EXPENDITURE_ITEM_FORM_KEY.PAYMENT_METHOD,
  EXPENDITURE_ITEM_FORM_KEY.DESCRIPTION,
  EXPENDITURE_ITEM_FORM_KEY.AMOUNT,
];
