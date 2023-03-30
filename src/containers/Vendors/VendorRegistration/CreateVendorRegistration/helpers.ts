import { VendorRegistrationPayload } from 'src/queries';
import { VENDOR_OPTION_VALUE } from './enums';
import { VendorRegistrationFormValue } from './types';

export const isVendorRequiredTIN = (selectedVendorClass: VENDOR_OPTION_VALUE) => {
  return [
    VENDOR_OPTION_VALUE.INDIVIDUAL_SOLE_PROPRIETOR_OR_SINGLE_MEMBER_LLC,
    VENDOR_OPTION_VALUE.C_CORPORATION,
    VENDOR_OPTION_VALUE.S_CORPORATION,
    VENDOR_OPTION_VALUE.LLC_C_CORPORATION,
    VENDOR_OPTION_VALUE.LLC_S_CORPORATION,
    VENDOR_OPTION_VALUE.LLC_PARTNERSHIP,
    VENDOR_OPTION_VALUE.PARTNERSHIP,
    VENDOR_OPTION_VALUE.TRUST_OR_ESTATE,
    VENDOR_OPTION_VALUE.OTHER,
  ].includes(selectedVendorClass);
};

export const isVendorRequiredRcuhNumber = (selectedVendorClass: VENDOR_OPTION_VALUE) => {
  return [VENDOR_OPTION_VALUE.RCUH_STUDENT_EMPLOYEE, VENDOR_OPTION_VALUE.RCUH_EMPLOYEE].includes(
    selectedVendorClass
  );
};

export const isVendorRequiredUhNumber = (selectedVendorClass: VENDOR_OPTION_VALUE) => {
  return [
    VENDOR_OPTION_VALUE.UH_GRADUATE_ASSISTANT_EMPLOYEE,
    VENDOR_OPTION_VALUE.UH_STUDENT_EMPLOYEE,
    VENDOR_OPTION_VALUE.UH_EMERITUS_FACULTY,
    VENDOR_OPTION_VALUE.UH_NON_COMPENSATED_APPOINTEE,
    VENDOR_OPTION_VALUE.UH_EMPLOYEE,
  ].includes(selectedVendorClass);
};

export const isVendorRequiredEinNumber = (selectedVendorClass: VENDOR_OPTION_VALUE) => {
  return [VENDOR_OPTION_VALUE.US_GOVERNMENT_ENTITY].includes(selectedVendorClass);
};

export const getVendorRegistrationPayload = ({
  values,
  vendorRegistrationId,
}: {
  values: VendorRegistrationFormValue;
  vendorRegistrationId: string;
}): VendorRegistrationPayload => {
  const splittedSSN = values.ssn ? values.ssn.split('-') : null;
  const splittedEIN = values.ein ? values.ein.split('-') : null;

  return {
    ...values,
    id: vendorRegistrationId,
    ssn1: splittedSSN ? splittedSSN[0] || '' : '',
    ssn2: splittedSSN ? splittedSSN[1] || '' : '',
    ssn3: splittedSSN ? splittedSSN[2] || '' : '',
    ein1: splittedEIN ? splittedEIN[0] || '' : '',
    ein2: splittedEIN ? splittedEIN[1] || '' : '',
  };
};
