import { POAuditTrails } from 'src/queries/PurchaseOrders';
import { PO_ACTION, PO_DETAIL_STATUS } from '../../PurchaseOrders/enums';
import { NON_PO_PAYMENT_DOCUMENT_TYPE } from '../enums';

export interface SharedNonEmployeeTravelDetail {
  loginName: string;
  date: string;
  requestNumber: string;

  acceptedDate: string;
  positionTitle: string;
  organization: string;
  projectContact: string;
  projectContactPhone: string;
  homeAddress: string;
  purposeForTravel: string;
  faStaffReviewer: string;
  phoneNumber: string;
  directInquiriesTo: string;
  internalComments: string;
  payeeCategory: string;
  travelDetails: string;
  total: number;
  expenditureTotal: number;
  startDestination: string;
  startDepartureDate: string;
  endDestination: string;
  endArrivalDate: string;
  tripTotal: number;
  claimantSignature: string;
  piSignature: string;
  faSignature: string;
  completedBy: string;
  username: string;
  documentNumber: string;
  vendorAddress: string;
  vendorName: string;
  vendorCode: string;
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
  miscDescription: string;
  lodgingDescription: string;
  miscCostTotal: number;
  lodgingCostTotal: number;
  daysClaimTotal: string;
  piName: string;
  advancedDocumentNumber: string;
  amountAdvanced: number;
  toServiceDate: string;
  fromServiceDate: string;
  updateVersionNumber: number;
  noReceiptSmallCorrectFlag: boolean;
  noReceiptAmount: number;
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
  projectItems: NonEmployeeTravelProjectItem[];
  itineraries: NonEmployeeTravelItinerary[];
  expenditures: NonEmployeeTravelExpenditure[];
  remittanceLineItems: NonEmployeeTravelRemittanceLineItem[];
  remittance: NonEmployeeTravelRemittance;

  //get from response for logic and view purpose
  status?: PO_DETAIL_STATUS;
  auditTrails?: POAuditTrails[];
  documentType?: NON_PO_PAYMENT_DOCUMENT_TYPE;
}

export interface NonEmployeeTravelProjectItem {
  id?: string;
  nonEmployeeTravelId: string;
  lineNumber: number;
  projectNumber: string;
  subProject: string;
  budgetCategory: string;
  subBudgetCategory: string;
  serviceDate: string;
  amount: number;
  description: string;
}

export interface NonEmployeeTravelItinerary {
  id?: string;
  nonEmployeeTravelId: string;
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
  miscFar: number;
  miscRate: number;
  miscExcess: number;
  miscDaysClaim: number;
  miscCost: number;
  miscEstimated: number;
}

export interface NonEmployeeTravelExpenditure {
  id?: string;
  nonEmployeeTravelId: string;
  item: string;
  leg: string;
  paymentMethod: string;
  description: string;
  amount: number;
}

export interface NonEmployeeTravelRemittanceLineItem {
  id?: string;
  nonEmployeeTravelId: string;
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
