import { VendorRegistrationPayload } from 'src/queries';
import { CommonFormikProps } from 'src/utils/commonTypes';

export interface VendorRegistrationFormValue
  extends Omit<VendorRegistrationPayload, 'ssn1' | 'ssn2' | 'ssn3' | 'ein1' | 'ein2'> {
  //additional for vendor info
  hasIndividualOrBusinessName: boolean;

  //additional for as AssigneeInfo
  ssn: string;
  ein: string;
  hasSsnOrEin: boolean;
}

export type VendorRegistrationFormikProps = CommonFormikProps<VendorRegistrationFormValue>;

export type VendorRegistrationValidationSchema = Partial<VendorRegistrationFormValue>;