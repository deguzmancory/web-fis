import { FormikErrors } from 'formik';
import { get } from 'lodash';
import { PATHS } from 'src/appConfig/paths';
import { MyProfile } from 'src/queries';
import { AdditionalPOForm } from 'src/queries/PurchaseOrders';
import { Callback } from 'src/redux/types';
import { DateFormat, localTimeToHawaii } from 'src/utils';
import { emptyUpsertPOFormValue } from './constants';
import { PO_ADDITIONAL_FORM_CODE, PO_ADDITIONAL_FORM_EXTERNAL_LINK } from './enums';
import { UpsertPOFormValue } from './types';

export const getExternalLinkFromFormCode = (formCode: PO_ADDITIONAL_FORM_CODE) => {
  switch (formCode) {
    case PO_ADDITIONAL_FORM_CODE.AGREEMENT:
      return PO_ADDITIONAL_FORM_EXTERNAL_LINK.AGREEMENT;

    case PO_ADDITIONAL_FORM_CODE.AGREEMENT_UH:
      return PO_ADDITIONAL_FORM_EXTERNAL_LINK.AGREEMENT_UH;

    default:
      break;
  }
};

export const getAdditionalPOFormValue = (forms: AdditionalPOForm[]) => {
  return forms.map((availableForm) => {
    const isExternalLink = [
      PO_ADDITIONAL_FORM_CODE.AGREEMENT_UH,
      PO_ADDITIONAL_FORM_CODE.AGREEMENT,
    ].includes(availableForm.code as PO_ADDITIONAL_FORM_CODE);

    return {
      ...availableForm,
      isExternalLink,
      href: isExternalLink
        ? getExternalLinkFromFormCode(availableForm.code as PO_ADDITIONAL_FORM_CODE)
        : `${PATHS.additionalForm}/${availableForm.code}`,
    };
  });
};

export const getInitialPOFormValue = ({ profile }: { profile: MyProfile }): UpsertPOFormValue => {
  return {
    ...emptyUpsertPOFormValue,
    loginName: profile.username,
    date: localTimeToHawaii(new Date(), DateFormat),
  };
};

export const checkRowStateAndSetValue = <TRecord = any, TValue = any>({
  value,
  name,
  index,
  records,
  setFieldValue,
  onRemoveRow,
  onAddRow,
  callback,
}: {
  name: string;
  value: TValue;
  index: number;
  records: TRecord[];
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<any>>;
  onRemoveRow: (index: number) => void;
  onAddRow: Callback;
  callback?: Callback;
}) => {
  const currentRow = get(records, index);

  // if !value and other cell of current row do not have value => remove row
  if (
    !value &&
    !Object.entries(currentRow).some(([key, value]) => {
      // exclude the current field cause "currentRow" references to the previous data now
      if (name.includes(key)) return false;
      return !!value;
    })
  ) {
    // not remove the last field
    if (index === records.length - 1) return;

    onRemoveRow(index);
  }
  // add new row if the current row is the last row
  else {
    const rowAbove = get(records, `${index + 1}`);
    if (!rowAbove) {
      onAddRow();
    }

    setFieldValue(name, value);

    if (callback) {
      callback();
    }
  }
};
