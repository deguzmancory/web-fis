import { initialLineItemValue } from 'src/containers/PurchaseOrderContainer/helpers';
import { PO_PAYMENT_LINE_ITEM_KEY, PO_PAYMENT_REMITTANCE_LINE_ITEM } from '../enums';
import { UpdatePOPaymentFormValue } from './../types';

export const ADVANCE_PAYMENT_ITEM_PROJECT_NUMBER = '0000005';
export const ADVANCE_PAYMENT_BUDGET_CATEGORY = '0060';

export const initialPaymentLineItemValue = {
  itemProjectNumber: '',
  subProject: '',
  budgetCategory: '',
  subBudgetCategory: '',
  serviceDate: null,
  amount: 0,
};

export const initialPaymentRemittanceInfo = {
  referenceNumber: '',
  amount: 0,
  customerAccountComment: '',
};

export const initialPaymentEquipmentInventory = {
  lineNumber: 0,
  description: '',
  brandName: '',
  serialNumber: '',
  itemCost: 0,
  locationOfEquipment: '',
  ownership: '',
  preparerName: '',
  preparerPhone: '',
  component: '',
  fabricatedA: '',
  fabricatedB: '',
  receiveDate: null,
};

export const emptyUpdatePOPaymentFormValue: UpdatePOPaymentFormValue = {
  action: null,

  // payment general info
  paymentLoginName: '',
  paymentDate: '',
  paymentRequestNumber: '',
  paymentDirectInquiriesTo: '',
  paymentPhoneNumber: '',
  paymentFaStaffReviewer: '',

  // general info
  loginName: '',
  date: '',
  number: 'To be assigned',
  projectTitle: '',
  projectNumber: '',
  piName: '',
  projectPeriod: '',
  superquoteNumber: '',
  superquoteBidId: null,
  vendorName: '',
  vendorAddress: '',
  vendorCode: '',
  shipTo: '',
  shipVia: '',
  shipOther: '',
  deliveryBy: '',
  discountTerms: '',
  quotationNumber: '',
  directInquiriesTo: '',
  phoneNumber: '',
  faStaffReviewer: '',

  // line items
  lineItems: [initialLineItemValue],

  // purchase info
  confirming: false,
  getExempt: false,
  attachment31: false,
  fedAttachment: null,
  uhSubawardNumber: '',
  taxRate: null,
  taxTotal: null,
  subtotal: 0,
  shippingTotal: null,
  total: 0,

  // Receipt Acknowledgment and Payment Authorization Exception
  paymentReceiptAcknowledgement: '',
  paymentType: null,

  // Payment Authorized By
  paymentAuthorizedBy: '',

  // Payment summary
  // paymentLineItems: [initialPaymentLineItemValue],
  advancePaymentLineItem: [initialPaymentLineItemValue],
  partialOrFinalPaymentLineItem: [initialPaymentLineItemValue],
  paymentTotal: 0,

  // Remittance Information
  remittanceLineItems: [initialPaymentRemittanceInfo],
  preferredPaymentMethod: '',
  preferredPaymentMethodTimestamp: '',
  paymentEquipmentInventoryManualFlag: null,
  remittance: {
    questionName: '',
    questionPhoneNumber: '',
    remittanceTotal: 0,
    remittanceAttention: '',
    returnRemittanceFlag: null,
    remittanceStreet: '',
    remittanceCity: '',
    remittanceState: '',
    zipCode: '',
    zipCodePlus4: '',
  },

  // Equipment Inventory
  paymentEquipmentInventories: [initialPaymentEquipmentInventory],

  // file attachment
  fileAttachments: [],
  placeholderFileAttachment: null,

  // internal comment
  poComments: '',
};

export const paymentLineItemsColumnNames = [
  PO_PAYMENT_LINE_ITEM_KEY.SUB_PROJECT,
  PO_PAYMENT_LINE_ITEM_KEY.BUDGET_CATEGORY,
  PO_PAYMENT_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY,
  PO_PAYMENT_LINE_ITEM_KEY.SERVICE_DATE,
  PO_PAYMENT_LINE_ITEM_KEY.AMOUNT,
];

export const paymentLineItemsRemittanceColumnsNames = [
  PO_PAYMENT_REMITTANCE_LINE_ITEM.REFERENCE_NUMBER,
  PO_PAYMENT_REMITTANCE_LINE_ITEM.CUSTOMER_ACCOUNT_COMMENT,
  PO_PAYMENT_REMITTANCE_LINE_ITEM.AMOUNT,
];
