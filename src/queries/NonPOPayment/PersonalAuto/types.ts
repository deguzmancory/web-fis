import { PO_ACTION, PO_DETAIL_STATUS } from '../../PurchaseOrders/enums';
import { NON_PO_PAYMENT_DOCUMENT_TYPE } from '../enums';
import { NonPOPaymentProjectLineItem, NonPOPaymentRemittanceLineItem } from '../types';

export interface GeneralInfo {
  loginName: string;
  date: string;
  requestNumber: string;
  vendorName: string;
  vendorCode: string;
  positionTitle: string;
  documentNumber: string;
  employeeStatus: string;
  employeeNumber: string;
  prNumber: string;
  buNumber: string;
  vendorAddress: string;
  travelerAddress: string;
  mileageClaimFlag: boolean;
  directInquiriesTo: string;
  phoneNumber: string;
  faStaffReviewer: string;
}

export interface TripInfoItem {
  lineNumber: number;
  serviceDate: string;
  tripFrom: string;
  tripTo: string;
  purpose: string;
  roundTripFlag: boolean;
  parking: number;
  miles: number;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemizedTripInformation {
  tripInfos: TripInfoItem[];
  milesParkingTotal: number;
  mileageRate: number;
  milesRateTotal: number;
  milesTotal: number;
  reportableRate: number;
  parkingTotal: number;
  company: string;
  policyNumber: string;
  expirationDate: string;
}

export interface ProjectLines {
  projectLineItems: NonPOPaymentProjectLineItem[];
  total: number;
}

export interface AuthorizationSignature {
  travelerSignature: string;
  piSignature: string;
  uhSignature: string;
}

export interface Remittance {
  remittanceTotal: number;
  questionName: string;
  questionPhoneNumber: string;
  returnRemittanceFlag: boolean;
  remittanceAttention: string;
  remittanceStreet: string;
  remittanceCity: string;
  remittanceState: string;
  zipCode: string;
  zipCodePlus4: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RemittanceInfo {
  remittanceLineItems: NonPOPaymentRemittanceLineItem[];
  remittance: Remittance;
}

export interface PersonalAutoAttachmentItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  path: string;
  uploadDate: string;
  size: string;
  description: string;
  isArtifact: boolean;
  afterFinalApprove: boolean;
  url: string;
}

export interface PersonalAutoAttachments {
  attachments: PersonalAutoAttachmentItem[];
}

export interface AuditTrailItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  user: string;
  action: string;
  username: string;
  userType: string;
}

export interface PersonalAutoAuditTrails {
  auditTrails?: AuditTrailItem[];
}

export interface PersonalAutomobileMileageVoucher
  extends GeneralInfo,
    ItemizedTripInformation,
    ProjectLines,
    AuthorizationSignature,
    RemittanceInfo,
    PersonalAutoAttachments,
    PersonalAutoAuditTrails {
  acceptedDate: string;
  username: string;

  internalComments: string;
  faCode: string;
  faName: string;
  faEmail: string;
  faApprover: string;
  faApprovedDate: string;
  rcuhApprover: string;
  rcuhApprovedDate: string;
  firstProjectNumber: string;
  listedProjectNumber: string;
  majorVersion: string;
  minorVersion: number;
  formName: string;
  shortFormName: string;
  hasFinalPdf: boolean;
  preparerEmail: string;
  checkNumber: string;
  checkDate: string;
  piName: string;
  updateVersionNumber: number;
  preferredPaymentMethod: string;
  preferredPaymentMethodTimestamp: string;
  paymentMethod: string;

  //get from response for logic and view purpose
  status?: PO_DETAIL_STATUS;
  documentType?: NON_PO_PAYMENT_DOCUMENT_TYPE;
}

export interface PersonalAutomobileResponse extends PersonalAutomobileMileageVoucher {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalAutomobilePayload extends PersonalAutomobileMileageVoucher {
  id?: string;
  action: PO_ACTION;
}
