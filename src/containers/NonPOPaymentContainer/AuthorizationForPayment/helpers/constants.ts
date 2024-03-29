import { DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS } from 'src/containers/PurchaseOrderContainer/POPayment/EquipmentInventoriesV2/helpers';
import { POPaymentEquipmentInventory } from 'src/queries';
import { AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY } from '../enum';

export const initialAuthorizationPaymentProjectItem = {
  lineNumber: null,
  projectNumber: '',
  subProject: '',
  budgetCategory: '',
  subBudgetCategory: '',
  serviceDate: null,
  amount: 0,
  description: '',
};

export const initialAuthorizationPaymentRemittance = {
  questionName: '',
  questionPhoneNumber: null,
  returnRemittanceFlag: null,
  remittanceAttention: '',
  remittanceStreet: '',
  remittanceCity: '',
  remittanceState: '',
  zipCode: '',
  zipCodePlus4: '',
  remittanceTotal: 0,
};

//  TODO: Tuyen Tran will remove if not need
export const initialAuthorizationPaymentEquipmentInventory = {
  lineNumber: null,
  ownership: '',
  description: '',
  brandName: '',
  serialNumber: '',
  itemCost: null,
  preparerName: '',
  preparerPhone: '',
  locationOfEquipment: '',
  component: '',
  fabricatedA: '',
  fabricatedB: '',
  receiveDate: null,
};

export const getInitialPaymentEquipmentInventories = (
  numberOfITems = DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS
) =>
  Array<POPaymentEquipmentInventory>(numberOfITems).fill(
    initialAuthorizationPaymentEquipmentInventory
  );

export const initialAuthorizationPaymentRemittanceItem = {
  referenceNumber: '',
  customerAccountComment: '',
  amount: 0,
};

export const emptyUpsertAuthorizationFormValue = {
  // form only
  action: null,
  placeholderFileAttachment: null,

  // General Info
  loginName: '',
  date: '',
  requestNumber: 'To be assigned',
  vendorName: '',
  vendorCode: '',
  vendorAddress: '',
  documentNumber: '',
  directInquiriesTo: '',
  phoneNumber: '',
  faStaffReviewer: '',

  //project items
  projectLineItems: [initialAuthorizationPaymentProjectItem],
  paymentTotal: 0,

  // Signature
  reasonForPayment: '',
  piSignature: '',
  faSignature: '',

  majorVersion: '',
  formName: '',
  shortFormName: '',
  docType: '',
  preferredPaymentMethod: '',
  preferredPaymentMethodTimestamp: '',
  minorVersion: null,
  total: 0,
  internalComments: '',

  // File Attachments
  fileAttachments: [],
  formAttachments: [],

  // Remittance
  remittance: initialAuthorizationPaymentRemittance,
  remittanceLineItems: [initialAuthorizationPaymentRemittanceItem],

  // Equipment Inventories
  equipmentInventories: getInitialPaymentEquipmentInventories(
    DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS
  ),
  equipmentInventoryManualFlag: null,
  paymentNumberOfEquipmentInventories: DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS,
};

export const authorizationLineItemsRemittanceColumnsNames = [
  AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY.REFERENCE_NUMBER,
  AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY.CUSTOMER_ACCOUNT_COMMENT,
  AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY.AMOUNT,
];
