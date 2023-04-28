import { POAuditTrails, POFileAttachment } from 'src/queries/PurchaseOrders';
import { PO_ACTION, PO_DETAIL_STATUS } from '../../PurchaseOrders/enums';
import { NON_PO_PAYMENT_DOCUMENT_TYPE } from '../enums';
import {
  NonPOPaymentProjectLineItem,
  NonPOPaymentRemittance,
  NonPOPaymentRemittanceLineItem,
} from '../types';

interface GeneralInfo {
  loginName: string;
  createdDate: string;
  requestNumber: string;

  beginDate: string;
  endDate: string;
  projectName: string;
  projectAddress: string;
  documentNumber: string;

  advancedCash: number;
  cashOnHand: number;
  expenses: number;
  cashInTransit: number;
  totalPettyCash: number;

  vendorName: string;
  directInquiriesTo: string;
  phoneNumber: string;
  faStaffReviewer: string;
}

interface ProjectLineItems {
  projectLineItems: NonPOPaymentProjectLineItem[];
  paymentTotal: number;
}

interface Signatures {
  custodianSignature: string;
  piSignature: string;
  faSignature: string;
}

interface Remittance {
  remittanceLineItems: NonPOPaymentRemittanceLineItem[];
  remittance: NonPOPaymentRemittance;
}

export interface SharedPettyCashDetail
  extends GeneralInfo,
    ProjectLineItems,
    Signatures,
    Remittance {
  vendorAddress: string;
  vendorCode: string;

  attachments: POFileAttachment[];
  internalComments: string;
  formName?: string;
  shortFormName?: string;

  //get from response for logic and view purpose
  preferredPaymentMethod?: string;
  preferredPaymentMethodTimestamp?: string;
  status?: PO_DETAIL_STATUS;
  auditTrails?: POAuditTrails[];
  documentType?: NON_PO_PAYMENT_DOCUMENT_TYPE;

  total?: number;
  paymentMethod?: string;
}

export interface UpsertPettyCashPayload extends SharedPettyCashDetail {
  id?: string;
  action: PO_ACTION;
}

export interface PettyCashDetailResponse extends SharedPettyCashDetail {
  id?: string;
  createdAt: string;
  updatedAt: string;

  acceptedDate: string;
  faCode: string;
  faName: string;
  faEmail: string;
  faApprover: string;
  faApprovedDate: string;
  rcuhApprover: string;
  rcuhApprovedDate: string;
  majorVersion: string;
  minorVersion: number;

  firstProjectNumber: string;
  listedProjectNumber: string;
  hasFinalPdf: boolean;
  preparerEmail: string;
  checkNumber: string;
  checkDate: string;
  piName: string;
  updateVersionNumber: number;
}
