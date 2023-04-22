import { POAuditTrails } from 'src/queries/PurchaseOrders';
import { PO_ACTION, PO_DETAIL_STATUS } from '../../PurchaseOrders/enums';
import { NON_PO_PAYMENT_DOCUMENT_TYPE } from '../enums';
import { NonPOPaymentProjectLineItem } from '../types';
import { NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY } from './enums';

export interface SelectPayeeCategory {
  loginName: string;
  date: string; //miss api
  requestNumber: string;
  payeeCategory: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY;
}

export interface GeneralInfo {
  vendorName: string;
  vendorCode: string;
  positionTitle: string;
  employer: string; //miss api
  vendorAddress: string;
  documentNumber: string;
  faStaffReviewer: string;
  projectContact: string;
  projectContactPhone: string;
  toServiceDate: string;
  fromServiceDate: string;
}

export interface TripItinerary {
  startDestination: string;
  startDepartureDate: string;
  itineraries: NonEmployeeTravelItinerary[];
  endDestination: string;
  endArrivalDate: string;
  tripTotal: number;
}

export interface TravelExpenditure {
  expenditures: NonEmployeeTravelExpenditure[];
  advancedDocumentNumber: string;
  expenditureTotal: number;
  amountAdvanced: number;
  miscCostTotal: number;
  lodgingCostTotal: number;
  miscDescription: string;
  lodgingDescription: string;
  miscDaysClaimTotal: number; //miss api
  lodgingDaysClaimTotal: number; //miss api
}

export interface NonEmployeeTravelProjectItems {
  projectItems: NonPOPaymentProjectLineItem[];
  paymentTotal: number; //miss api
}

export interface ReceiptCertification {
  noReceiptSmallCorrectFlag: boolean;
  noReceiptAmount: number;
}

export interface BusinessPurposeDetails {
  travelDetails: string;
  claimantSignature: string;
  piSignature: string;
  faSignature: string;
}

export interface SharedNonEmployeeTravelDetail
  extends SelectPayeeCategory,
    GeneralInfo,
    TripItinerary,
    TravelExpenditure,
    NonEmployeeTravelProjectItems,
    ReceiptCertification,
    BusinessPurposeDetails {
  acceptedDate: string;
  organization: string;
  homeAddress: string;
  purposeForTravel: string;
  phoneNumber: string;
  directInquiriesTo: string;
  internalComments: string;
  total: number;

  completedBy: string;
  username: string;
  faCode: string;
  faName: string;
  faEmail: string;
  faApprover: string;
  faApprovedDate: string;
  rcuhApprover: string;
  rcuhApprovedDate: string;
  majorVersion: string;
  minorVersion: number;
  formName: string;
  shortFormName: string;
  firstProjectNumber: string;
  listedProjectNumber: string;
  hasFinalPdf: boolean;
  preparerEmail: string;
  checkNumber: string;
  checkDate: string;
  miscPaymentMethod: string;
  lodgingPaymentMethod: string;

  // daysClaimTotal: string;
  piName: string;

  updateVersionNumber: number;
  noReceiptCorrectFlag: boolean;
  noReceiptFormFlag: boolean;
  preferredPaymentMethod: string;
  preferredPaymentMethodTimestamp: string;
  paymentMethod: string;
  piUserId: string;
  faUserId: string;
  cuUserId: string;
  piOriginalUserId: string;
  faOriginalUserId: string;
  cuOriginalUserId: string;
  remittanceLineItems: NonEmployeeTravelRemittanceLineItem[];
  remittance: NonEmployeeTravelRemittance;

  //get from response for logic and view purpose
  status?: PO_DETAIL_STATUS;
  auditTrails?: POAuditTrails[];
  documentType?: NON_PO_PAYMENT_DOCUMENT_TYPE;
}

export interface NonEmployeeTravelItinerary {
  id?: string;
  nonEmployeeTravelId?: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  calcDays: number;
  businessDays: number;
  minusDays: number;
  lodgingFar: number;
  lodgingRate: number;
  lodgingExcess: number;
  lodgingDaysClaim: number;
  lodgingCost: number;
  lodgingEstimated?: number; //miss api
  miscFar: number;
  miscRate: number;
  miscExcess: number;
  miscDaysClaim: number;
  miscCost: number;
  miscEstimated: number;
}

export interface NonEmployeeTravelExpenditure {
  id?: string;
  nonEmployeeTravelId?: string;
  item: string;
  leg: string;
  paymentMethod: string;
  description: string;
  amount: number;
}

export interface NonEmployeeTravelRemittanceLineItem {
  id?: string;
  nonEmployeeTravelId?: string;
  number: string;
  amount: number;
  lineNumber: number;
  customerAccountComment: string;
}

export interface NonEmployeeTravelRemittance {
  id?: string;
  remittanceTotal: number;
  questionName: string;
  questionPhoneNumber: string;
  returnRemittanceFlag: boolean;
}

export interface UpsertNonEmployeeTravelPayload extends SharedNonEmployeeTravelDetail {
  id?: string;
  action: PO_ACTION;
}

export interface NonEmployeeTravelDetailResponse extends SharedNonEmployeeTravelDetail {
  id?: string;
  createdAt: string;
  updatedAt: string;
}
