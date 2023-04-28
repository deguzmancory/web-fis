import {
  AdditionalPOForm,
  POAdditionalFormResponse,
  POAuditTrails,
  POFileAttachment,
  POFileAttachmentResponse,
  PO_ACTION,
  PO_DETAIL_STATUS,
} from 'src/queries/PurchaseOrders';
import {
  NonPOPaymentProjectLineItem,
  NonPOPaymentRemittance,
  NonPOPaymentRemittanceLineItem,
} from '../types';

export interface AuthorizationGeneralInfo {
  loginName: string;
  createdDate: string;
  requestNumber: string;
  vendorName: string;
  vendorCode: string;
  vendorAddress: string;
  documentNumber: string;
  directInquiriesTo: string;
  phoneNumber: string;
  faStaffReviewer: string;
}

export interface AuthorizationSignature {
  reasonForPayment: string;
  piSignature: string;
  faSignature: string;
}

export interface AuthorizationEquipmentInventory {
  id?: string;
  lineNumber: number;
  ownership: string;
  description: string;
  brandName: string;
  serialNumber: string;
  itemCost: number;
  preparerName: string;
  preparerPhone: string;
  locationOfEquipment: string;
  component: string;
  fabricatedA: string;
  fabricatedB: string;
  receiveDate: string | Date;
}

export interface AuthorizationEquipmentInventories {
  equipmentInventories: AuthorizationEquipmentInventory[];
  equipmentInventoryManualFlag: boolean;
}

export interface SharedAuthorizationDetail
  extends AuthorizationGeneralInfo,
    AuthorizationSignature,
    AuthorizationEquipmentInventories {
  status?: PO_DETAIL_STATUS;
  docType: string;
  preferredPaymentMethod: string;
  preferredPaymentMethodTimestamp: string;
  paymentTotal: number;
  total: number;
  internalComments: string;
  remittance: NonPOPaymentRemittance;
  projectLineItems: NonPOPaymentProjectLineItem[];
  remittanceLineItems: NonPOPaymentRemittanceLineItem[];
  auditTrails?: POAuditTrails[];

  // TODO: Tuyen Tran will remove if don't use
  majorVersion?: string;
  minorVersion: number;
  formName?: string;
  shortFormName?: string;
}

export interface UpsertAuthorizationPayload extends SharedAuthorizationDetail {
  id?: string;
  action: PO_ACTION;
  fileAttachments: POFileAttachment[];
  formAttachments: AdditionalPOForm[];
}

export interface AuthorizationPaymentResponse extends SharedAuthorizationDetail {
  id?: string;
  createdAt: string;
  updatedAt: string;

  // TODO: Tuyen Tran check type response when BE fixed bug
  fileAttachments: POFileAttachmentResponse[];
  formAttachments: POAdditionalFormResponse[];
}
