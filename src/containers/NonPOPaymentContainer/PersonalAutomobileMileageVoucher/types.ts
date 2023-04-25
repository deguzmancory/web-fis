import { Vendor } from 'src/queries/Vendors';
import { CommonFormikProps } from 'src/utils/commonTypes';
import {
  ItemizedTripInformation,
  PersonalAutomobileMileageVoucher,
  TripInfoItem,
} from '../../../queries/NonPOPayment/PersonalAuto/types';
import { NonPOPaymentProjectItemFormValue } from '../AuthorizationForPayment/types';

export interface PersonalAutomobileTripItemFormValue extends Omit<TripInfoItem, 'serviceDate'> {
  serviceDate: Date;
}

export interface POPlaceholderFileAttachment {
  file: File;
  descriptions: string;
  size: string;
  isArtifact?: boolean;
}

export interface PersonalAutomobileFormValue
  extends Omit<
    PersonalAutomobileMileageVoucher,
    //override
    | 'vendorName'
    | 'vendorCode'
    | 'projectLineItems'
    | 'tripInfos'
    | 'fromServiceDate'
    | 'toServiceDate'
    | 'startDepartureDate'
    | 'endArrivalDate'
  > {
  vendorName: Vendor | string;
  vendorCode: Vendor | string;
  projectLineItems: NonPOPaymentProjectItemFormValue[];
  tripInfos: PersonalAutomobileTripItemFormValue[];
  id?: string;

  //form only
  placeholderFileAttachment: POPlaceholderFileAttachment;
}

export type PersonalAutomobileFormikProps = CommonFormikProps<PersonalAutomobileFormValue>;

export type TripItemAdditionalPrefixes = Omit<ItemizedTripInformation, 'tripInfos'>;
