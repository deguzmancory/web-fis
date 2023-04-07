import { PATHS } from 'src/appConfig/paths';
import { MyProfile } from 'src/queries';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import {
  AdditionalPOForm,
  PODetailResponse,
  PO_ACTION,
  UpsertPOPayload,
} from 'src/queries/PurchaseOrders';
import { PIDetail, SUDetail } from 'src/queries/Users';
import { RoleService } from 'src/services';
import {
  DateFormat,
  getDate,
  getDateDisplay,
  getRoleInfoOfProfile,
  isoFormat,
  localTimeToHawaii,
} from 'src/utils';
import { isEmpty } from 'src/validations';
import { isVariousProject } from '../GeneralInfo/helpers';
import {
  emptyUpsertPOFormValue,
  externalFormAttachments,
  initialLineItemValue,
} from '../constants';
import { PO_ADDITIONAL_FORM_CODE, PO_ADDITIONAL_FORM_EXTERNAL_LINK } from '../enums';
import { AdditionalPOFormValue, UpsertPOFormValue } from '../types';
import { checkIsFAReviewMode } from './utils';

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
    const isExternalUrl = [
      PO_ADDITIONAL_FORM_CODE.AGREEMENT_UH,
      PO_ADDITIONAL_FORM_CODE.AGREEMENT,
    ].includes(availableForm.code as PO_ADDITIONAL_FORM_CODE);

    return {
      ...availableForm,
      isExternalUrl,
      href: isExternalUrl
        ? getExternalLinkFromFormCode(availableForm.code as PO_ADDITIONAL_FORM_CODE)
        : `${PATHS.poAdditionalForm}/${availableForm.code}`,
    };
  });
};

export const getAvailableFormsFromResponse = (forms: AdditionalPOForm[]) => {
  return forms
    .filter((availableForm) => {
      const isExternalUrl = [
        PO_ADDITIONAL_FORM_CODE.AGREEMENT_UH,
        PO_ADDITIONAL_FORM_CODE.AGREEMENT,
      ].includes(availableForm.code as PO_ADDITIONAL_FORM_CODE);

      return !isExternalUrl;
    })
    .map((availableForm) => {
      return {
        ...availableForm,
        isExternalUrl: false,
        href: `${PATHS.poAdditionalForm}/${availableForm.code}`,
      };
    });
};

export const getInitialPOFormValue = ({ profile }: { profile: MyProfile }): UpsertPOFormValue => {
  const roleInfo = getRoleInfoOfProfile({ profile }) as SUDetail | PIDetail;

  const shipTo = roleInfo
    ? `${roleInfo.sendInvoiceTo && `${roleInfo.sendInvoiceTo}\n`}${
        roleInfo.department && `${roleInfo.department}\n`
      }${roleInfo.addressStreet && `${roleInfo.addressStreet}\n`}${
        roleInfo.addressCity && `${roleInfo.addressCity} `
      }${roleInfo.addressState && `${roleInfo.addressState} `}${
        roleInfo.addressZip && `${roleInfo.addressZip} `
      }${roleInfo.addressZip4 && `${roleInfo.addressZip4} `}${
        roleInfo.addressCountry && `${roleInfo.addressCountry} `
      }
      `
    : '';

  return {
    ...emptyUpsertPOFormValue,
    loginName: profile.username,
    date: localTimeToHawaii(new Date(), DateFormat),
    shipTo: shipTo,
    directInquiriesTo: roleInfo?.directInquiriesTo || '',
    phoneNumber: roleInfo?.phoneNumber || '',
    faStaffReviewer: roleInfo?.faStaffToReview || '',
  };
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

// apply for FA Review mode
export const preFillSendInvoiceDataInFAReviewMode = ({
  response,
  profile,
}: {
  response: PODetailResponse;
  profile: MyProfile;
}) => {
  if (!response) return;
  const currentRole = RoleService.getCurrentRole() as ROLE_NAME;

  if (checkIsFAReviewMode({ poStatus: response.status, currentRole })) {
    return {
      sendInvoiceToClearFlag: false,
      sendInvoiceTo: profile.fisFaInfo.sendInvoiceTo || '',
      sendInvoiceToFAEmail: profile.fisFaInfo.sendInvoiceToEmail || '',
      invoiceDept: profile.fisFaInfo.department || '',
      invoiceState: profile.fisFaInfo.addressState || '',
      invoiceStreetAddress: profile.fisFaInfo.addressStreet || '',
      invoiceCity: profile.fisFaInfo.addressCity || '',
      invoiceZip: profile.fisFaInfo.addressZip || '',
      invoiceZip4: profile.fisFaInfo.addressZip4 || '',
      invoiceCountry: profile.fisFaInfo.addressCountry || '',
    };
  }

  return;
};

export const getPOFormValueFromResponse = ({
  response,
  profile,
}: {
  response: PODetailResponse;
  profile: MyProfile;
}): UpsertPOFormValue => {
  const transformedLineItems = response.lineItems.map((lineItem) => ({
    ...lineItem,
    unitPrice: lineItem.unitPrice ? Number(lineItem.unitPrice || 0) : null,
    ext: Number(lineItem.unitPrice || 0),
  }));

  return {
    ...response,
    ...preFillSendInvoiceDataInFAReviewMode({ response, profile }),
    action: null,
    placeholderFileAttachment: null,
    date: getDateDisplay(response.date),
    availableForms: getAvailableFormsFromResponse(response.availableForms),
    formAttachments: getAvailableFormsFromResponse(response.formAttachments),
    taxTotal: Number(response.taxTotal || 0),
    subtotal: Number(response.subtotal || 0),
    taxRate: Number(response.taxRate || 0),
    total: Number(response.total || 0),
    shippingTotal: Number(response.shippingTotal || 0),
    lineItems: [...transformedLineItems, initialLineItemValue],
    determination: response.determination
      ? {
          ...response.determination,
          dDate: getDate(response.determination?.dDate),
          departmentHeadDate: getDate(response.determination?.departmentHeadDate),
          approvedDuoDate: getDate(response.determination?.approvedDuoDate),
        }
      : null,
    soleSource: response.soleSource
      ? {
          ...response.soleSource,
          ssDate: getDate(response.soleSource?.ssDate),
          departmentHeadDate: getDate(response.soleSource?.departmentHeadDate),
          approvedDuoDate: getDate(response.soleSource?.approvedDuoDate),
        }
      : null,
    subcontractor: response.subcontractor
      ? {
          ...response.subcontractor,
          date: getDate(response.subcontractor?.date),
          startDate: getDate(response.subcontractor?.startDate),
          endDate: getDate(response.subcontractor?.endDate),
          executedDate: getDate(response.subcontractor?.executedDate),
          socSubcontractorDate: getDate(response.subcontractor?.socSubcontractorDate),
        }
      : null,
    authToPurchase: response.authToPurchase
      ? {
          ...response.authToPurchase,
          responses: response.authToPurchase?.responses.map((authToPurchaseResponse) => ({
            ...authToPurchaseResponse,
            attachmentDate: getDate(authToPurchaseResponse?.attachmentDate),
          })),
        }
      : null,
    equipmentInventory: response.equipmentInventory
      ? {
          ...response.equipmentInventory,
          equipmentType: response.equipmentInventory.equipmentType
            ? response.equipmentInventory.equipmentType.split(',')
            : [],
        }
      : null,
  };
};

export const getUpsertPOPayload = ({
  formValues,
  action,
}: {
  formValues: UpsertPOFormValue;
  action: PO_ACTION;
}): UpsertPOPayload => {
  const isEdit = !!formValues?.id;

  //ignore last row of line items
  const lineItemsFormValue = formValues.lineItems.slice(0, -1);
  //get project number value
  const notVariousProjectNumberPayload =
    typeof formValues.projectNumber === 'string'
      ? formValues.projectNumber
      : formValues.projectNumber.number;
  const ineItemsPayload =
    //various project can have multiple project number's line items
    isVariousProject(formValues.projectNumber)
      ? lineItemsFormValue.map((lineItem) => ({
          ...lineItem,
          itemProjectNumber:
            typeof lineItem.itemProjectNumber === 'string'
              ? lineItem.itemProjectNumber
              : lineItem.itemProjectNumber.number,
          quantity: lineItem.quantity ? lineItem.quantity.toString() : '',
        }))
      : //non-various project only have one project number for all line items
        lineItemsFormValue.map((lineItem) => ({
          ...lineItem,
          itemProjectNumber: notVariousProjectNumberPayload,
          quantity: lineItem.quantity ? lineItem.quantity.toString() : '',
        }));

  return {
    ...formValues,

    action: action,
    date: isEdit ? formValues.date : localTimeToHawaii(new Date(), isoFormat),
    lineItems: ineItemsPayload,
    agreement: null,
    agreementUh: null,
    projectTitle:
      typeof formValues.projectTitle === 'string'
        ? formValues.projectTitle
        : formValues.projectTitle.name,
    projectNumber: notVariousProjectNumberPayload,
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
    formAttachments: formValues.formAttachments
      .map((formAttachment) => ({
        id: formAttachment?.id,
        name: formAttachment.name,
        code: formAttachment.code,
        accessKey: formAttachment.accessKey,
      }))
      .concat(
        externalFormAttachments.map((externalFormAttachment) => ({
          id: undefined,
          name: externalFormAttachment.name,
          code: externalFormAttachment.code,
          accessKey: externalFormAttachment.accessKey,
        }))
      ),
    determination: hasIncludeAdditionalForm({
      formAttachments: formValues.formAttachments,
      formCode: PO_ADDITIONAL_FORM_CODE.DETERMINATION,
    })
      ? !isEmpty(formValues.determination)
        ? formValues.determination
        : null
      : null,
    authToPurchase: hasIncludeAdditionalForm({
      formAttachments: formValues.formAttachments,
      formCode: PO_ADDITIONAL_FORM_CODE.AUTH_TO_PURCHASE,
    })
      ? !isEmpty(formValues.authToPurchase)
        ? formValues.authToPurchase
        : null
      : null,
    equipmentInventory: hasIncludeAdditionalForm({
      formAttachments: formValues.formAttachments,
      formCode: PO_ADDITIONAL_FORM_CODE.EQUIPMENT_INVENTORY,
    })
      ? !isEmpty(formValues.equipmentInventory)
        ? {
            ...formValues.equipmentInventory,
            equipmentType: formValues?.equipmentInventory?.equipmentType?.join(','),
          }
        : null
      : null,
    ffata: hasIncludeAdditionalForm({
      formAttachments: formValues.formAttachments,
      formCode: PO_ADDITIONAL_FORM_CODE.FFATA,
    })
      ? !isEmpty(formValues.ffata)
        ? formValues.ffata
        : null
      : null,
    soleSource: hasIncludeAdditionalForm({
      formAttachments: formValues.formAttachments,
      formCode: PO_ADDITIONAL_FORM_CODE.SOLE_SOURCE,
    })
      ? !isEmpty(formValues.soleSource)
        ? formValues.soleSource
        : null
      : null,
    subcontractor: hasIncludeAdditionalForm({
      formAttachments: formValues.formAttachments,
      formCode: PO_ADDITIONAL_FORM_CODE.SUBCONTRACTOR,
    })
      ? !isEmpty(formValues.subcontractor)
        ? formValues.subcontractor
        : null
      : null,
  };
};
