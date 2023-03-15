import { FormikErrors } from 'formik';
import { get } from 'lodash';
import { PATHS } from 'src/appConfig/paths';
import { MyProfile } from 'src/queries';
import { AdditionalPOForm, UpsertPOPayload } from 'src/queries/PurchaseOrders';
import { Callback } from 'src/redux/types';
import { ErrorService, Yup } from 'src/services';
import { DateFormat, isoFormat, localTimeToHawaii } from 'src/utils';
import { emptyUpsertPOFormValue } from './constants';
import { PO_ACTION, PO_ADDITIONAL_FORM_CODE, PO_ADDITIONAL_FORM_EXTERNAL_LINK } from './enums';
import { AdditionalPOFormValue, UpsertPOFormValue } from './types';

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
        : `${PATHS.poAdditionalForm}/${availableForm.code}`,
    };
  });
};

export const isSavePOAction = (action: PO_ACTION) => {
  return action === PO_ACTION.SAVE;
};
export const isSubmitToFaPOAction = (action: PO_ACTION) => {
  return action === PO_ACTION.SUBMIT;
};

export const getPOFormValidationSchema = ({ action }: { action: PO_ACTION }) => {
  const isSubmitAction = isSubmitToFaPOAction(action);

  return Yup.object().shape({
    projectTitle: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    projectNumber: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    vendorName: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    vendorCode: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    vendorAddress: isSubmitAction
      ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),
    shipTo: isSubmitAction
      ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),
    directInquiriesTo: isSubmitAction
      ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),
    faStaffReviewer: isSubmitAction
      ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),
    lineItems: Yup.array().min(2, 'At least one Project # is Required'),
  });
};

export const getInitialPOFormValue = ({ profile }: { profile: MyProfile }): UpsertPOFormValue => {
  return {
    ...emptyUpsertPOFormValue,
    loginName: profile.username,
    date: localTimeToHawaii(new Date(), DateFormat),
    action: null,
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

export const hasIncludeAdditionalForm = ({
  formAttachments,
  formCode,
}: {
  formCode: PO_ADDITIONAL_FORM_CODE;
  formAttachments: AdditionalPOFormValue[];
}) => {
  return formAttachments.some((formAttachment) => formAttachment.code === formCode);
};

export const getCreatePOPayload = ({
  formValues,
  action,
}: {
  formValues: UpsertPOFormValue;
  action: PO_ACTION;
}): UpsertPOPayload => {
  return {
    ...formValues,
    action: action,
    date: localTimeToHawaii(new Date(), isoFormat),
    projectTitle:
      typeof formValues.projectTitle === 'string'
        ? formValues.projectTitle
        : formValues.projectTitle.name,
    projectNumber:
      typeof formValues.projectNumber === 'string'
        ? formValues.projectNumber
        : formValues.projectNumber.number,
    vendorName:
      typeof formValues.vendorName === 'string'
        ? formValues.vendorName
        : formValues.vendorName.name,
    vendorCode:
      typeof formValues.vendorCode === 'string'
        ? formValues.vendorCode
        : formValues.vendorCode.code,
    availableForms: formValues.availableForms.map((availableForm) => ({
      name: availableForm.name,
      code: availableForm.code,
      accessKey: availableForm.accessKey,
    })),
    formAttachments: formValues.formAttachments.map((formAttachment) => ({
      id: formAttachment?.id,
      name: formAttachment.name,
      code: formAttachment.code,
      accessKey: formAttachment.accessKey,
    })),
    determination: hasIncludeAdditionalForm({
      formAttachments: formValues.formAttachments,
      formCode: PO_ADDITIONAL_FORM_CODE.DETERMINATION,
    })
      ? formValues.determination
      : null,
    authToPurchase: hasIncludeAdditionalForm({
      formAttachments: formValues.formAttachments,
      formCode: PO_ADDITIONAL_FORM_CODE.AUTH_TO_PURCHASE,
    })
      ? formValues.authToPurchase
      : null,
    equipmentInventory: hasIncludeAdditionalForm({
      formAttachments: formValues.formAttachments,
      formCode: PO_ADDITIONAL_FORM_CODE.EQUIPMENT_INVENTORY,
    })
      ? formValues.equipmentInventory
      : null,
    agreement: hasIncludeAdditionalForm({
      formAttachments: formValues.formAttachments,
      formCode: PO_ADDITIONAL_FORM_CODE.AGREEMENT,
    })
      ? formValues.agreement
      : null,
    agreementUh: hasIncludeAdditionalForm({
      formAttachments: formValues.formAttachments,
      formCode: PO_ADDITIONAL_FORM_CODE.AGREEMENT_UH,
    })
      ? formValues.agreementUh
      : null,
    ffata: hasIncludeAdditionalForm({
      formAttachments: formValues.formAttachments,
      formCode: PO_ADDITIONAL_FORM_CODE.FFATA,
    })
      ? formValues.ffata
      : null,
    soleSource: hasIncludeAdditionalForm({
      formAttachments: formValues.formAttachments,
      formCode: PO_ADDITIONAL_FORM_CODE.SOLE_SOURCE,
    })
      ? formValues.soleSource
      : null,
    subcontractor: hasIncludeAdditionalForm({
      formAttachments: formValues.formAttachments,
      formCode: PO_ADDITIONAL_FORM_CODE.SUBCONTRACTOR,
    })
      ? formValues.subcontractor
      : null,
  };
};
