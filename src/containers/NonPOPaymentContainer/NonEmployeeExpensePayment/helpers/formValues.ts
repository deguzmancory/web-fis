import { MyProfile } from 'src/queries';
import {
  NonEmployeeTravelDetailResponse,
  UpsertNonEmployeeTravelPayload,
} from 'src/queries/NonPOPayment/NonEmployeeTravel/types';
import { PO_ACTION } from 'src/queries/PurchaseOrders';
import {
  DateFormat,
  convertNumberOrNull,
  formatDateApi,
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
  initialNonEmployeeTravelProjectLineItem,
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
    projectLineItems,
    remittanceLineItems,
    date,
    itineraries,
    fromServiceDate,
    toServiceDate,
    tripTotal,
    startDepartureDate,
    endArrivalDate,
    ...formValue
  } = response;

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

    startDepartureDate: getDate(startDepartureDate),
    endArrivalDate: getDate(endArrivalDate),
    itineraries: [...transformedItineraries, initialNonEmployeeTravelItinerary],
    tripTotal: Number(tripTotal || 0),

    projectLineItems: [...transformedProjectLineItems, initialNonEmployeeTravelProjectLineItem],
    remittanceLineItems: [
      ...transformedRemittanceLineItems,
      initialNonEmployeeTravelRemittanceLineItem,
    ],
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
    projectLineItems,
    itineraries,
    fromServiceDate,
    toServiceDate,
    startDepartureDate,
    endArrivalDate,
    ...payloadProps
  } = formValues;

  const isEdit = !!id;

  //ignore last row of line items
  const projectLineItemsFormValue = projectLineItems.slice(0, -1) || [];

  const projectLineItemsPayload =
    projectLineItemsFormValue.map((projectLineItem, index) => ({
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
  const itinerariesPayload = itineraries.slice(0, -1) || [];

  return {
    ...payloadProps,
    id,
    action: action,

    date: isEdit ? date : localTimeToHawaii(new Date(), isoFormat),

    vendorName: isString(vendorName) ? vendorName : vendorName.name,
    vendorCode: isString(vendorCode) ? vendorCode : vendorCode.code,
    fromServiceDate: formatDateApi(fromServiceDate, isoFormat),
    toServiceDate: formatDateApi(toServiceDate, isoFormat),

    startDepartureDate: formatDateApi(startDepartureDate, isoFormat),
    endArrivalDate: formatDateApi(endArrivalDate, isoFormat),

    projectLineItems: projectLineItemsPayload,
    remittanceLineItems: remittanceLineItemsPayload,
    itineraries: itinerariesPayload,
  };
};
