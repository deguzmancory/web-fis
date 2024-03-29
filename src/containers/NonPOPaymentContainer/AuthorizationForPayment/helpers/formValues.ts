import { isEmpty } from 'lodash';
import { DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS } from 'src/containers/PurchaseOrderContainer/POPayment/EquipmentInventoriesV2/helpers';
import { getNumberOfEquipmentInventories } from 'src/containers/PurchaseOrderContainer/POPayment/helpers';
import { MyProfile, NON_PO_FORM_NAME, NON_PO_SHORT_FORM_NAME, PO_ACTION } from 'src/queries';
import {
  AuthorizationPaymentResponse,
  UpsertAuthorizationPayload,
} from 'src/queries/NonPOPayment/AuthorizationForPayment/types';
import {
  DateFormat,
  formatDateApi,
  getDate,
  getDateDisplay,
  isString,
  isoFormat,
  localTimeToHawaii,
} from 'src/utils';
import { UpsertAuthorizationFormValue } from '../types';
import {
  emptyUpsertAuthorizationFormValue,
  getInitialPaymentEquipmentInventories,
} from './constants';

export const getInitialAuthorizationFormValue = ({
  profile,
}: {
  profile: MyProfile;
}): UpsertAuthorizationFormValue => {
  return {
    ...emptyUpsertAuthorizationFormValue,
    loginName: profile.username,
    createdDate: localTimeToHawaii(new Date(), DateFormat),
  };
};

export const getUpsertAuthorizationPaymentPayload = ({
  formValues,
  action,
}: {
  formValues: UpsertAuthorizationFormValue;
  action: PO_ACTION;
}): UpsertAuthorizationPayload => {
  const {
    id,
    placeholderFileAttachment,
    vendorName,
    vendorCode,
    createdDate,
    projectLineItems,
    remittanceLineItems,
    equipmentInventories,
    paymentNumberOfEquipmentInventories,
    ...payloadProps
  } = formValues;
  const isEdit = !!id;

  const projectLineItemsFormValue = projectLineItems.slice(0, -1) || [];
  const projectLineItemsPayload =
    projectLineItemsFormValue.map((projectItem, index) => ({
      ...projectItem,
      lineNumber: index + 1,
      projectNumber: isString(projectItem.projectNumber)
        ? projectItem.projectNumber
        : projectItem.projectNumber.number,
      serviceDate: formatDateApi(projectItem.serviceDate) || null,
    })) || [];

  const remittanceLineItemsPayload = remittanceLineItems.slice(0, -1) || [];

  return {
    ...payloadProps,
    id,
    action: action,

    formName: NON_PO_FORM_NAME.AUTHORIZATION_PAYMENT,
    shortFormName: NON_PO_SHORT_FORM_NAME.AUTHORIZATION_PAYMENT,
    createdDate: isEdit ? createdDate : localTimeToHawaii(new Date(), isoFormat),

    vendorName: isString(vendorName) ? vendorName : vendorName.name,
    vendorCode: isString(vendorCode) ? vendorCode : vendorCode.code,
    projectLineItems: projectLineItemsPayload,
    remittanceLineItems: remittanceLineItemsPayload,
    equipmentInventories: equipmentInventories
      .slice(0, paymentNumberOfEquipmentInventories)
      .map((inventory, index) => ({
        ...inventory,
        lineNumber: index + 1,
      })),
  };
};

export const getAuthorizationPaymentFormValueFromResponse = ({
  response,
  profile,
}: {
  response: AuthorizationPaymentResponse;
  profile: MyProfile;
}): UpsertAuthorizationFormValue => {
  const { projectLineItems, remittanceLineItems, equipmentInventories, ...formValue } = response;

  const transformedProjectLineItems =
    projectLineItems?.map((lineItem) => ({
      ...lineItem,
      serviceDate: getDate(lineItem.serviceDate),
      amount: Number(lineItem.amount || 0),
    })) || [];

  const transformedRemittanceLineItems =
    remittanceLineItems?.map((remittanceLineItem) => ({
      ...remittanceLineItem,
      amount: Number(remittanceLineItem.amount || 0),
    })) || [];

  const transformedEquipmentInventories = !isEmpty(equipmentInventories)
    ? equipmentInventories?.map((equipmentInventory) => ({
        ...equipmentInventory,
        receiveDate: getDate(equipmentInventory.receiveDate),
      })) || []
    : getInitialPaymentEquipmentInventories(DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS);

  // TODO: Tuyen Tran update response
  return {
    ...formValue,
    action: null,
    placeholderFileAttachment: null,

    createdDate: getDateDisplay(response.createdDate),
    paymentTotal: Number(response.paymentTotal || 0),
    total: Number(response.total || 0),

    projectLineItems: transformedProjectLineItems,
    remittanceLineItems: transformedRemittanceLineItems,
    equipmentInventories: transformedEquipmentInventories,
    paymentNumberOfEquipmentInventories: getNumberOfEquipmentInventories(
      transformedEquipmentInventories
    ),
  };
};
