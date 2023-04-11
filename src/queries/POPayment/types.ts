import { PO_CHANGE_FORM_NUMBER } from '../POChange';
import {
  POAuditTrails,
  POFileAttachment,
  POLineItem,
  PO_ACTION,
  PO_DETAIL_STATUS,
  SharedPODetail,
} from '../PurchaseOrders';
import { PO_PAYMENT_TYPE } from './enums';

export interface POPaymentGeneralInfo {
  paymentLoginName: string;
  paymentDate: string;
  paymentRequestNumber: string;
  paymentDirectInquiriesTo: string;
  paymentPhoneNumber: string;
  paymentFaStaffReviewer: string;
}

export interface POPaymentReceiptAndPaymentType {
  paymentReceiptAcknowledgement: string;
  paymentType: PO_PAYMENT_TYPE;
}

export interface POPaymentSummary {
  paymentLineItems: POPaymentLineItem[];
  paymentTotal: number;
}

export interface POPaymentRemittanceInfo {
  remittanceLineItems: POPaymentRemittanceLineItem[];
  remittance: POPaymentRemittance;
  paymentEquipmentInventoryManualFlag: boolean;
  preferredPaymentMethod: string;
  preferredPaymentMethodTimestamp: string;
}

// PO Payment
export interface UpdatePOPaymentPayload
  extends POPaymentGeneralInfo,
    POPaymentReceiptAndPaymentType,
    POPaymentSummary,
    POPaymentRemittanceInfo {
  id?: string;
  action: PO_ACTION;

  // payment general info

  // po general info

  // po line items

  // po purchase info

  // Receipt Acknowledgment and Payment Authorization Exception

  // Payment Authorized By
  paymentAuthorizedBy: string;

  // Payment summary

  // Remittance Information

  // Equipment Inventory
  paymentEquipmentInventories: POPaymentEquipmentInventory[];

  // file attachment
  fileAttachments: POFileAttachment[];

  // internal comment
  poComments: string;

  // audit info
  auditTrails?: POAuditTrails[];

  // check view mode purpose
  status?: PO_DETAIL_STATUS;
  formNumber?: PO_CHANGE_FORM_NUMBER;

  // total?: number;
  paymentMethod?: string;
}

export interface POPaymentResponse
  extends SharedPODetail,
    POPaymentGeneralInfo,
    POPaymentRemittanceInfo,
    POPaymentSummary,
    POPaymentReceiptAndPaymentType {
  id: string;
  createdAt: string;
  updatedAt: string;

  externalId: number;
  previousPoNumber: string;
  routeToFa: string;
  preparerEmail: string;
  faReviewer: string;
  faEmail: string;
  faName: string;
  faCode: string;
  faApprover: string;
  faApprovedDate: string;
  rcuhApprover: string;
  rcuhApprovedDate: string;
  finalApprovedDate: string;
  approved: string;
  vendorName2: string;
  modifiedDate: string;
  userType: string;
  printedDate: string;
  hasChangeDocument: boolean;
  hasFinalPdf: boolean;
  isHistorical: boolean;
  updateVersionNumber: number;
  totalAmount: number;
  checkNumber: string;
  checkDate: string;
  remittanceVendorAddress: string;
  paymentMethod: string;
  paymentAuthorizedBy: string;

  lineItems: POLineItemPOPaymentResponse[];
  paymentEquipmentInventories: POPaymentEquipmentInventory[];
  fileAttachments: POFileAttachment[];
}

export interface POPaymentLineItem {
  id?: string;
  itemProjectNumber: string;
  subProject: string;
  budgetCategory: string;
  subBudgetCategory: string;
  serviceDate: string | Date;
  amount: number;

  externalId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface POPaymentEquipmentInventory {
  id?: string;
  lineNumber: number;
  description: string;
  brandName: string;
  serialNumber: string;
  itemCost: number;
  locationOfEquipment: string;
  ownership: string;
  preparerName: string;
  preparerPhone: string;
  component: string;
  fabricatedA: string;
  fabricatedB: string;
  receiveDate: string;

  externalId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface POPaymentRemittanceLineItem {
  id?: string;
  referenceNumber: string;
  amount: number;
  customerAccountComment: string;

  externalId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface POPaymentRemittance {
  id?: string;
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

  externalId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface POPaymentCommonResponse {}

export interface POLineItemPOPaymentResponse extends POLineItem, POPaymentCommonResponse {}
