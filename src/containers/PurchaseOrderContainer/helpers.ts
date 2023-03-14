import dayjs from 'dayjs';
import { FormikErrors } from 'formik';
import { get } from 'lodash';
import { PATHS } from 'src/appConfig/paths';
import { MyProfile } from 'src/queries';
import { AdditionalPOForm, UpsertPOPayload } from 'src/queries/PurchaseOrders';
import { Callback } from 'src/redux/types';
import { ErrorService, Yup } from 'src/services';
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

export const getPOFormValidationSchema = ({ action }: { action: PO_ACTION }) => {
  // const isSave = isSavePOAction(action);

  return Yup.object().shape({
    projectTitle: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    projectNumber: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    vendorName: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    vendorCode: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    shipTo: Yup.string().required().typeError(ErrorService.MESSAGES.required),
    directInquiriesTo: Yup.string().required().typeError(ErrorService.MESSAGES.required),
    faStaffReviewer: Yup.string().required().typeError(ErrorService.MESSAGES.required),
  });
};

export const getInitialPOFormValue = ({ profile }: { profile: MyProfile }): UpsertPOFormValue => {
  return {
    action: PO_ACTION.SAVE,
    documentType: '',
    majorVersion: '',
    minorVersion: null,
    formName: '',
    shortFormName: '',
    loginName: 'huy_dang',
    number: 'To be assigned',
    formNumber: '',
    projectTitle: 'INTEREST INCOME: CARES ACT PART 1,',
    projectNumber: '6109236',
    piName: 'BRANDVOLD, KELLI',
    projectPeriod: '05/01/2020 - 06/30/2022',
    faStaffReviewer: '3123 3213123',
    vendorName: 'MANGAUIL, JOSHUA L.',
    vendorAddress: '46-3591 MAUNAKEA RD\nHONOKAA, HI\n324',
    vendorCode: 'L6732',
    shipTo: ' 34 234 234 234 ',
    shipVia: 'Best Way',
    shipOther: '324',
    deliveryBy: '',
    discountTerms: '',
    quotationNumber: '',
    directInquiriesTo: 'qưeqwe',
    phoneNumber: '+12312213',
    date: '2023-03-14T10:16:35.733Z',
    confirming: null,
    getExempt: true,
    taxRate: 10,
    taxTotal: 0.5,
    subtotal: 5,
    total: 6.5,
    shippingTotal: 1,
    attachment31: true,
    fedAttachment: 'UH Subaward',
    internalA: '',
    internalA1: '4234',
    internalB: ' 123 12321 ',
    internalC: '12 3 123 12 312 3',
    presetInstructions: '',
    externalSpecialInstructions: '',
    sendInvoiceTo: '3432 ',
    sendInvoiceToClearFlag: null,
    sendInvoiceToFaEmail: '',
    invoiceDept: '',
    invoiceStreetAddress: '',
    invoiceCity: 'Schenectady',
    invoiceState: 'NY',
    invoiceZip: '12345',
    invoiceZip4: '',
    invoiceCountry: '',
    signature: '23432',
    poComments: '12312 321',
    uhSubawardNumber: '324324',
    superquoteNumber: null,
    superquoteBidId: null,
    availableForms: [
      {
        name: 'Determination of Cost or Price Reasonableness',
        code: 'determination_of_cost_or_price',
        accessKey: '2',
        href: '',
        isExternalLink: false,
      },
      {
        name: 'Sole Source Justification',
        code: 'sole_source_justification',
        accessKey: '3',
        href: '',
        isExternalLink: false,
      },
      {
        name: 'Auth. to Purchase Equip. w/Fed. Contract or Grant Funds',
        code: 'auth_to_purch_equip_with_federal_funds',
        accessKey: '4',
        href: '',
        isExternalLink: false,
      },
      {
        name: 'Equipment Inventory Form',
        code: 'equip_inventory_form',
        accessKey: '5',
        href: '',
        isExternalLink: false,
      },
      {
        name: 'Subcontract Agreement',
        code: 'subcontract_agreement',
        accessKey: '6',
        href: '',
        isExternalLink: false,
      },
      {
        name: 'Agreement for Services (UH Projects)',
        code: 'agreement_for_services_uh',
        accessKey: '7',
        href: '',
        isExternalLink: false,
      },
      {
        name: 'Agreement for Services (Direct Projects)',
        code: 'agreement_for_services',
        accessKey: '8',
        href: '',
        isExternalLink: false,
      },
      {
        name: 'FFATA Data Collection for Subcontractor/Vendor',
        code: 'ffaia_data_collection',
        accessKey: '9',
        href: '/purchase-orders/additional-form/ffaia_data_collection',
        isExternalLink: false,
      },
    ],
    lineItems: [
      {
        itemProjectNumber: '',
        subProject: '321',
        budgetCategory: '3213',
        subBudgetCategory: '123',
        description: '',
        quantity: '1',
        unit: '',
        unitPrice: 1,
        ext: 1,
      },
      {
        itemProjectNumber: '',
        subProject: '12321',
        budgetCategory: '123',
        subBudgetCategory: '312',
        description: '',
        quantity: '2',
        unit: '',
        unitPrice: 2,
        ext: 4,
      },
      {
        itemProjectNumber: '',
        subProject: '',
        budgetCategory: '',
        subBudgetCategory: '',
        description: '',
        quantity: '',
        unit: '',
        unitPrice: null,
        ext: null,
      },
    ],
    fileAttachments: [],
    formAttachments: [],
    determination: null,
    soleSource: null,
    authToPurchase: null,
    equipmentInventory: null,
    subcontractor: null,
    agreement: null,
    agreementUh: null,
    ffata: null,
    address1: '46-3591 MAUNAKEA RD',
    address2: 'HONOKAA, HI',
    address3: '',
  };
  // return {
  //   ...emptyUpsertPOFormValue,
  //   loginName: profile.username,
  //   date: localTimeToHawaii(new Date(), DateFormat),
  //   action: null,
  // };
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
    date: dayjs().toISOString(),
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
