import { MyProfile, NON_PO_FORM_NAME, NON_PO_SHORT_FORM_NAME } from 'src/queries';
import {
  PettyCashDetailResponse,
  UpsertPettyCashPayload,
} from 'src/queries/NonPOPayment/PettyCash/types';
import { PO_ACTION } from 'src/queries/PurchaseOrders';
import {
  DateFormat,
  formatDateApi,
  getDate,
  getDateDisplay,
  isString,
  isoFormat,
  localTimeToHawaii,
} from 'src/utils';
import { UpsertPettyCashFormValue } from '../types';
import {
  emptyUpsertPettyCashFormValue,
  initialPettyCashProjectItem,
  initialPettyCashRemittanceLineItem,
} from './constants';

export const getInitialPettyCashFormValue = ({
  profile,
}: {
  profile: MyProfile;
}): UpsertPettyCashFormValue => {
  return {
    ...emptyUpsertPettyCashFormValue,
    loginName: profile.username,
    createdDate: localTimeToHawaii(new Date(), DateFormat),
  };
};

export const getPettyCashFormValueFromResponse = ({
  response,
  profile,
}: {
  response: PettyCashDetailResponse;
  profile: MyProfile;
}): UpsertPettyCashFormValue => {
  const { projectLineItems, remittanceLineItems, createdDate, beginDate, endDate, ...formValue } =
    response;

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

  return {
    ...formValue,
    action: null,
    placeholderFileAttachment: null,

    createdDate: getDateDisplay(createdDate),
    beginDate: getDate(beginDate),
    endDate: getDate(endDate),

    projectLineItems: [...transformedProjectLineItems, initialPettyCashProjectItem],
    remittanceLineItems: [...transformedRemittanceLineItems, initialPettyCashRemittanceLineItem],
  };
};

export const getUpsertPettyCashPayload = ({
  formValues,
  action,
}: {
  formValues: UpsertPettyCashFormValue;
  action: PO_ACTION;
}): UpsertPettyCashPayload => {
  const {
    id,
    placeholderFileAttachment,
    vendorName,
    vendorCode,
    createdDate,
    remittanceLineItems,
    projectLineItems,
    beginDate,
    endDate,

    ...payloadProps
  } = formValues;

  const isEdit = !!id;

  //ignore last row of line items
  const projectLineItemsFormValue = projectLineItems.slice(0, -1) || [];

  const projectLineItemsPayload =
    projectLineItemsFormValue.map((projectItem, index) => ({
      ...projectItem,
      lineNumber: index + 1,
      projectNumber: isString(projectItem.projectNumber)
        ? projectItem.projectNumber
        : projectItem.projectNumber.number,
      serviceDate: formatDateApi(projectItem.serviceDate),
    })) || [];

  const remittanceLineItemsPayload =
    remittanceLineItems.slice(0, -1).map((remittanceItem, index) => ({
      ...remittanceItem,
      lineNumber: index + 1,
    })) || [];

  return {
    ...payloadProps,
    id,
    action: action,

    formName: NON_PO_FORM_NAME.PETTY_CASH_PAYMENT,
    shortFormName: NON_PO_SHORT_FORM_NAME.PETTY_CASH_PAYMENT,

    createdDate: isEdit ? createdDate : localTimeToHawaii(new Date(), isoFormat),

    beginDate: formatDateApi(beginDate),
    endDate: formatDateApi(endDate),

    vendorName: isString(vendorName) ? vendorName : vendorName.name,
    vendorCode: isString(vendorCode) ? vendorCode : vendorCode.code,

    projectLineItems: projectLineItemsPayload,
    remittanceLineItems: remittanceLineItemsPayload,
  };
};
