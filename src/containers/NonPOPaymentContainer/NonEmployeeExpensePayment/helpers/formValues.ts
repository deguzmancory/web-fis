import { MyProfile } from 'src/queries';
import {
  NonEmployeeTravelDetailResponse,
  UpsertNonEmployeeTravelPayload,
} from 'src/queries/NonPOPayment/NonEmployeeTravel/types';
import { PO_ACTION } from 'src/queries/PurchaseOrders';
import {
  DateFormat,
  convertNumberOrNull,
  getDate,
  getDateDisplay,
  isString,
  isoFormat,
  localTimeToHawaii,
} from 'src/utils';
import { UpsertNonEmployeeTravelFormValue } from '../types';
import {
  emptyUpsertNonEmployeeTravelFormValue,
  initialNonEmployeeTravelItinerary,
  initialNonEmployeeTravelProjectItem,
  initialNonEmployeeTravelRemittanceLineItem,
} from './constants';

export const getInitialNonEmployeeTravelFormValue = ({
  profile,
}: {
  profile: MyProfile;
}): UpsertNonEmployeeTravelFormValue => {
  return {
    ...emptyUpsertNonEmployeeTravelFormValue,
    loginName: profile.username,
    date: localTimeToHawaii(new Date(), DateFormat),
  };
};

export const getNonEmployeeTravelFormValueFromResponse = ({
  response,
  profile,
}: {
  response: NonEmployeeTravelDetailResponse;
  profile: MyProfile;
}): UpsertNonEmployeeTravelFormValue => {
  const {
    projectItems,
    remittanceLineItems,
    date,
    itineraries,
    fromServiceDate,
    toServiceDate,
    ...formValue
  } = response;

  const transformedProjectItems =
    projectItems?.map((lineItem) => ({
      ...lineItem,
      serviceDate: getDate(lineItem.serviceDate),
      amount: Number(lineItem.amount || 0),
    })) || [];

  const transformedRemittanceLineItems =
    remittanceLineItems?.map((remittanceLineItem) => ({
      ...remittanceLineItem,
      amount: Number(remittanceLineItem.amount || 0),
    })) || [];

  const transformedItineraries = itineraries?.map((itinerary) => ({
    ...itinerary,
    calcDays: convertNumberOrNull(itinerary.calcDays),
    businessDays: convertNumberOrNull(itinerary.businessDays),
    minusDays: convertNumberOrNull(itinerary.minusDays),
    lodgingFar: convertNumberOrNull(itinerary.lodgingFar),
    lodgingRate: convertNumberOrNull(itinerary.lodgingRate),
    lodgingExcess: convertNumberOrNull(itinerary.lodgingExcess),
    lodgingDaysClaim: convertNumberOrNull(itinerary.lodgingDaysClaim),
    lodgingCost: convertNumberOrNull(itinerary.lodgingCost),
    miscFar: convertNumberOrNull(itinerary.miscFar),
    miscRate: convertNumberOrNull(itinerary.miscRate),
    miscExcess: convertNumberOrNull(itinerary.miscExcess),
    miscDaysClaim: convertNumberOrNull(itinerary.miscDaysClaim),
    miscCost: convertNumberOrNull(itinerary.miscCost),
    miscEstimated: convertNumberOrNull(itinerary.miscEstimated),
  }));

  return {
    ...formValue,
    action: null,
    placeholderFileAttachment: null,

    date: getDateDisplay(date),
    fromServiceDate: getDate(fromServiceDate),
    toServiceDate: getDate(toServiceDate),

    projectItems: [...transformedProjectItems, initialNonEmployeeTravelProjectItem],
    remittanceLineItems: [
      ...transformedRemittanceLineItems,
      initialNonEmployeeTravelRemittanceLineItem,
    ],
    itineraries: [...transformedItineraries, initialNonEmployeeTravelItinerary],
  };
};

export const getUpsertNonEmployeeTravelPayload = ({
  formValues,
  action,
}: {
  formValues: UpsertNonEmployeeTravelFormValue;
  action: PO_ACTION;
}): UpsertNonEmployeeTravelPayload => {
  const {
    id,
    placeholderFileAttachment,
    vendorName,
    vendorCode,
    date,
    remittanceLineItems,
    projectItems,
    itineraries,
    fromServiceDate,
    toServiceDate,
    ...payloadProps
  } = formValues;

  const isEdit = !!id;

  //ignore last row of line items
  const projectItemsFormValue = projectItems.slice(0, -1) || [];

  const projectItemsPayload =
    projectItemsFormValue.map((projectItem, index) => ({
      ...projectItem,
      lineNumber: index + 1,
      projectNumber: isString(projectItem.projectNumber)
        ? projectItem.projectNumber
        : projectItem.projectNumber.number,
      serviceDate: getDateDisplay(projectItem.serviceDate),
    })) || [];

  const remittanceLineItemsPayload = remittanceLineItems.slice(0, 1) || [];
  const itinerariesPayload = itineraries.slice(0, 1) || [];

  return {
    ...payloadProps,
    action: action,

    date: isEdit ? date : localTimeToHawaii(new Date(), isoFormat),

    vendorName: isString(vendorName) ? vendorName : vendorName.name,
    vendorCode: isString(vendorCode) ? vendorCode : vendorCode.code,
    fromServiceDate: getDateDisplay(fromServiceDate),
    toServiceDate: getDateDisplay(toServiceDate),

    projectItems: projectItemsPayload,
    remittanceLineItems: remittanceLineItemsPayload,
    itineraries: itinerariesPayload,
  };
};
