import { UpsertNonEmployeeTravelFormValue } from '../types';

export const initialNonEmployeeTravelProjectItem = {
  nonEmployeeTravelId: '',
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
  nonEmployeeTravelId: '',
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
  nonEmployeeTravelId: '',
  item: '',
  leg: '',
  paymentMethod: '',
  description: '',
  amount: 0,
};

export const initialNonEmployeeTravelRemittanceLineItem = {
  nonEmployeeTravelId: '',
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

  acceptedDate: '',
  organization: '',

  homeAddress: '',
  purposeForTravel: '',
  phoneNumber: '',
  directInquiriesTo: '',
  internalComments: '',
  travelDetails: '',
  total: null,
  expenditureTotal: null,
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
  miscCostTotal: null,
  lodgingCostTotal: null,
  daysClaimTotal: '',
  piName: '',
  advancedDocumentNumber: '',
  amountAdvanced: null,
  updateVersionNumber: null,
  noReceiptSmallCorrectFlag: null,
  noReceiptAmount: null,
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
  projectItems: [initialNonEmployeeTravelProjectItem],
  expenditures: [initialNonEmployeeTravelExpenditure],
  remittanceLineItems: [initialNonEmployeeTravelRemittanceLineItem],
  remittance: initialNonEmployeeTravelRemittance,
};
