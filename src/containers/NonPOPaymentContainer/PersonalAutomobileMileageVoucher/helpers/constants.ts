import { PERSONAL_AUTO_TRIP_ITEM_FORM_KEY } from '../enums';
import { PersonalAutomobileFormValue } from '../types';

export const initialPersonalAutomobileProjectItem = {
  lineNumber: 0,
  projectNumber: '',
  subProject: '',
  budgetCategory: '',
  subBudgetCategory: '',
  serviceDate: null,
  amount: 0,
  description: '',
};

export const initialPersonalAutomobileTripInfoItem = {
  lineNumber: null,
  serviceDate: null,
  tripFrom: '',
  tripTo: '',
  purpose: '',
  roundTripFlag: false,
  parking: null,
  miles: null,
};

export const initialPersonalAutomobileRemittanceLineItem = {
  lineNumber: null,
  referenceNumber: '',
  amount: 0,
  customerAccountComment: '',
};

export const initialPersonalAutomobileRemittance = {
  remittanceTotal: 0,
  questionName: '',
  questionPhoneNumber: '',
  returnRemittanceFlag: false,
  remittanceAttention: '',
  remittanceStreet: '',
  remittanceCity: '',
  remittanceState: '',
  zipCode: '',
  zipCodePlus4: '',
};

export const personalAutomobileFormInitialValue: PersonalAutomobileFormValue = {
  // form only
  action: null,
  placeholderFileAttachment: null,

  // General Information
  loginName: '',
  date: '',
  requestNumber: 'To be assigned',
  vendorName: null,
  vendorCode: null,
  positionTitle: '',
  documentNumber: '',
  employeeStatus: '',
  employeeNumber: '',
  buNumber: '',
  prNumber: '',
  vendorAddress: '',
  travelerAddress: '',
  mileageClaimFlag: false,
  directInquiriesTo: '',
  phoneNumber: '',
  faStaffReviewer: '',

  // Itemized Trip Information
  tripInfos: [initialPersonalAutomobileTripInfoItem],
  milesParkingTotal: null,
  mileageRate: null,
  milesRateTotal: null,
  milesTotal: null,
  reportableRate: null,
  parkingTotal: null,
  company: '',
  policyNumber: '',
  expirationDate: null,

  // Project(s) to be Charged
  projectLineItems: [initialPersonalAutomobileProjectItem],
  total: null,

  // Authorization Signatures
  travelerSignature: '',
  piSignature: '',
  uhSignature: '',

  // Remittance Information
  remittanceLineItems: [initialPersonalAutomobileRemittanceLineItem],
  remittance: initialPersonalAutomobileRemittance,

  // Personal Automobile Attachments
  attachments: [],
  auditTrails: [],

  acceptedDate: '',
  internalComments: '',
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
  piName: '',
  updateVersionNumber: null,
  preferredPaymentMethod: '',
  preferredPaymentMethodTimestamp: '',
  paymentMethod: '',
};

export const personalAutomobileTripItemColumnNames = [
  PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_LINE_NUMBER,
  PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_SERVICE_DATE,
  PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_FROM,
  PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_TO,
  PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_PURPOSE,
  PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_ROUND_FLAG,
  PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_PARKING,
  PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_MILES,
];
