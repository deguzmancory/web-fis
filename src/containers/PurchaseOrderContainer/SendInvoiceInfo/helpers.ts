import { PO_FORM_KEY } from '../enums';

export enum PRESET_INSTRUCTIONS {
  TRAVEL_AGENCY_REFUND_NOTICE = 'Travel Agency Refund Notice',
  OTHER = 'Other (Specify)',
}

export const presetInstructionOptions = [
  {
    label: PRESET_INSTRUCTIONS.TRAVEL_AGENCY_REFUND_NOTICE,
    value: PRESET_INSTRUCTIONS.TRAVEL_AGENCY_REFUND_NOTICE,
  },
  {
    label: PRESET_INSTRUCTIONS.OTHER,
    value: PRESET_INSTRUCTIONS.OTHER,
  },
];

export const resetAllField = ({ setFieldValue, setFieldTouched }) => {
  setFieldValue(PO_FORM_KEY.SEND_INVOICE_TO, '');
  setFieldValue(PO_FORM_KEY.SEND_INVOICE_TO_FA_EMAIL, '');
  setFieldValue(PO_FORM_KEY.INVOICE_DEPT, '');
  setFieldValue(PO_FORM_KEY.INVOICE_STREET_ADDRESS, '');
  setFieldValue(PO_FORM_KEY.INVOICE_CITY, '');
  setFieldValue(PO_FORM_KEY.INVOICE_STATE, '');
  setFieldValue(PO_FORM_KEY.INVOICE_ZIP, '');
  setFieldValue(PO_FORM_KEY.INVOICE_ZIP4, '');
  setFieldValue(PO_FORM_KEY.INVOICE_COUNTRY, '');
  setFieldTouched(PO_FORM_KEY.SEND_INVOICE_TO, false);
  setFieldTouched(PO_FORM_KEY.SEND_INVOICE_TO_FA_EMAIL, false);
  setFieldTouched(PO_FORM_KEY.INVOICE_DEPT, false);
  setFieldTouched(PO_FORM_KEY.INVOICE_STREET_ADDRESS, false);
  setFieldTouched(PO_FORM_KEY.INVOICE_CITY, false);
  setFieldTouched(PO_FORM_KEY.INVOICE_STATE, false);
  setFieldTouched(PO_FORM_KEY.INVOICE_ZIP, false);
  setFieldTouched(PO_FORM_KEY.INVOICE_ZIP4, false);
  setFieldTouched(PO_FORM_KEY.INVOICE_COUNTRY, false);
};
