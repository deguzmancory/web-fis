import { MyProfile } from 'src/queries';
import { DateFormat, getDate, getDateDisplay, localTimeToHawaii } from 'src/utils';
import { PersonalAutomobileResponse } from '../../../../queries/NonPOPayment/PersonalAuto/types';
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
    date: localTimeToHawaii(new Date(), DateFormat),
  };
};

export const getPersonalAutomobileFormValueFromResponse = ({
  response,
  profile,
}: {
  response: PersonalAutomobileResponse;
  profile: MyProfile;
}): PersonalAutomobileFormValue => {
  const { id, projectLineItems, remittanceLineItems, date, ...formValue } = response;

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
    id,
    date: getDateDisplay(date),
    projectLineItems: [...transformedProjectItems, initialPersonalAutomobileProjectItem],
    tripInfos: [initialPersonalAutomobileTripInfoItem],
    remittanceLineItems: [
      ...transformedRemittanceLineItems,
      initialPersonalAutomobileRemittanceLineItem,
    ],
    placeholderFileAttachment: null,
  };
};
