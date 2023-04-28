import { MyProfile, PO_ACTION, PO_DETAIL_STATUS } from 'src/queries';
import {
  DateFormat,
  formatDateApi,
  getDate,
  getDateDisplay,
  isString,
  isoFormat,
  localTimeToHawaii,
} from 'src/utils';
import {
  PersonalAutomobilePayload,
  PersonalAutomobileResponse,
} from '../../../../queries/NonPOPayment/PersonalAuto/types';
import { PersonalAutomobileFormValue } from '../types';
import {
  initialPersonalAutomobileProjectItem,
  initialPersonalAutomobileRemittanceLineItem,
  initialPersonalAutomobileTripInfoItem,
  personalAutomobileFormInitialValue,
} from './constants';

export const getInitialPersonalAutomobileFormValue = ({
  profile,
}: {
  profile: MyProfile;
}): PersonalAutomobileFormValue => {
  return {
    ...personalAutomobileFormInitialValue,
    loginName: profile.username,
    createdDate: localTimeToHawaii(new Date(), DateFormat),
  };
};

export const getPersonalAutomobileFormValueFromResponse = ({
  response,
  profile,
}: {
  response: PersonalAutomobileResponse;
  profile: MyProfile;
}): PersonalAutomobileFormValue => {
  const {
    projectLineItems,
    remittanceLineItems,
    createdDate,
    expirationDate = null,
    ...formValue
  } = response;

  const transformedProjectItems =
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
    projectLineItems: [...transformedProjectItems, initialPersonalAutomobileProjectItem],
    tripInfos: [initialPersonalAutomobileTripInfoItem],
    remittanceLineItems: [
      ...transformedRemittanceLineItems,
      initialPersonalAutomobileRemittanceLineItem,
    ],
    expirationDate: expirationDate && new Date(expirationDate),
  };
};

export const getUpsertPersonalAutomobileMileageVoucherPayload = ({
  formValues,
  action,
}: {
  formValues: PersonalAutomobileFormValue;
  action: PO_ACTION;
}): PersonalAutomobilePayload => {
  const {
    id,
    placeholderFileAttachment,
    vendorName,
    vendorCode,
    remittanceLineItems,
    projectLineItems,
    tripInfos,
    createdDate,

    ...payloadProps
  } = formValues;

  const isEdit = !!id;

  const projectLineItemsPayload =
    projectLineItems.slice(0, -1).map((projectLineItem, index) => ({
      ...projectLineItem,
      lineNumber: index + 1,
      projectNumber: isString(projectLineItem.projectNumber)
        ? projectLineItem.projectNumber
        : projectLineItem.projectNumber.number,
      serviceDate: formatDateApi(projectLineItem.serviceDate),
    })) || [];

  const remittanceLineItemsPayload =
    remittanceLineItems.slice(0, -1).map((remittanceItem, index) => ({
      ...remittanceItem,
      lineNumber: index + 1,
    })) || [];

  const tripInfosPayload =
    tripInfos.slice(0, -1).map((tripInfoItem, index) => ({
      ...tripInfoItem,
      serviceDate: formatDateApi(tripInfoItem.serviceDate),
      lineNumber: index + 1,
    })) || [];

  return {
    ...payloadProps,
    id,
    action: action,
    status: !isEdit ? PO_DETAIL_STATUS.PI_PENDING_SUBMITTAL : undefined,

    createdDate: isEdit ? createdDate : localTimeToHawaii(new Date(), isoFormat),
    vendorName: isString(vendorName) ? vendorName : vendorName.name,
    vendorCode: isString(vendorCode) ? vendorCode : vendorCode.code,

    projectLineItems: projectLineItemsPayload,
    remittanceLineItems: remittanceLineItemsPayload,
    tripInfos: tripInfosPayload,
  };
};
