import { PATHS } from 'src/appConfig/paths';
import { MyProfile } from 'src/queries';
import { isCU, isFA, ROLE_NAME } from 'src/queries/Profile/helpers';
import {
  AdditionalPOForm,
  PODetailResponse,
  PO_DETAIL_STATUS,
  UpsertPOPayload,
} from 'src/queries/PurchaseOrders';
import { ErrorService, RoleService, Yup } from 'src/services';
import {
  DateFormat,
  getDateDisplay,
  getRoleInfoOfProfile,
  isoFormat,
  localTimeToHawaii,
} from 'src/utils';
import { isEmpty } from 'src/validations';
import { emptyUpsertPOFormValue, externalFormAttachments, initialLineItemValue } from './constants';
import { PO_ACTION, PO_ADDITIONAL_FORM_CODE, PO_ADDITIONAL_FORM_EXTERNAL_LINK } from './enums';
import { isVariousProject, SHIP_VIA_VALUE } from './GeneralInfo/helpers';
import { AdditionalPOFormValue, UpsertPOFormValue } from './types';

export const isPOSaveAction = (action: PO_ACTION) => {
  return action === PO_ACTION.SAVE;
};
export const isPOSubmitAction = (action: PO_ACTION) => {
  return action === PO_ACTION.SUBMIT;
};
export const isPOApprovedAction = (action: PO_ACTION) => {
  return action === PO_ACTION.APPROVE;
};
export const isPODisapproveAction = (action: PO_ACTION) => {
  return action === PO_ACTION.DISAPPROVE;
};
export const isPOAdditionalInfoAction = (action: PO_ACTION) => {
  return action === PO_ACTION.ADDITIONAL_INFO;
};

export const isPIPendingSubmittalPOStatus = (status: PO_DETAIL_STATUS) => {
  return status === PO_DETAIL_STATUS.PI_PENDING_SUBMITTAL;
};
export const isFAPendingApprovalPOStatus = (status: PO_DETAIL_STATUS) => {
  return status === PO_DETAIL_STATUS.FA_PENDING_APPROVAL;
};
export const isPIAdditionalInfoRequestedPOStatus = (status: PO_DETAIL_STATUS) => {
  return status === PO_DETAIL_STATUS.PI_ADDITIONAL_INFO_REQUESTED;
};
export const isPIDisapprovedPOStatus = (status: PO_DETAIL_STATUS) => {
  return status === PO_DETAIL_STATUS.PI_DISAPPROVED;
};
export const isFAAdditionalInfoRequestedPOStatus = (status: PO_DETAIL_STATUS) => {
  return status === PO_DETAIL_STATUS.FA_ADDITIONAL_INFO_REQUESTED_RCUH;
};
export const isRCUHPendingRCUHApprovalPOStatus = (status: PO_DETAIL_STATUS) => {
  return status === PO_DETAIL_STATUS.RCUH_PENDING_RCUH_APPROVAL;
};
export const isFinalPOStatus = (status: PO_DETAIL_STATUS) => {
  return status === PO_DETAIL_STATUS.FINAL;
};

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

export const getAvailableFormsFromResponse = (forms: AdditionalPOForm[]) => {
  return forms
    .filter((availableForm) => {
      const isExternalLink = [
        PO_ADDITIONAL_FORM_CODE.AGREEMENT_UH,
        PO_ADDITIONAL_FORM_CODE.AGREEMENT,
      ].includes(availableForm.code as PO_ADDITIONAL_FORM_CODE);

      return !isExternalLink;
    })
    .map((availableForm) => {
      return {
        ...availableForm,
        isExternalLink: false,
        href: `${PATHS.poAdditionalForm}/${availableForm.code}`,
      };
    });
};

export const getPOFormValidationSchema = ({ action }: { action: PO_ACTION }) => {
  const isSubmitAction = isPOSubmitAction(action);

  return Yup.object().shape(
    {
      projectTitle: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
      projectNumber: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
      vendorName: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
      vendorCode: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
      shipOther: Yup.string().when('shipVia', {
        is: SHIP_VIA_VALUE.OTHER,
        then: Yup.string().required().typeError(ErrorService.MESSAGES.required),
        otherwise: Yup.string().nullable(),
      }),
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
      lineItems: Yup.array().when(['lineItems', 'projectNumber'], (lineItems, projectNumber) => {
        if (isEmpty(lineItems) || lineItems.length < 2) {
          return Yup.array().test('min-length', 'At least one Project # is Required', (value) => {
            if (value.length < 2) {
              return false;
            }

            return true;
          });
        }

        return Yup.array().of<any>(
          Yup.lazy((_item, options: any) => {
            const isLastItem = options.parent?.length === options?.index + 1;

            if (!isLastItem) {
              return Yup.object().shape({
                itemProjectNumber: isVariousProject(projectNumber)
                  ? Yup.string()
                      .required(ErrorService.MESSAGES.shortRequired)
                      .typeError(ErrorService.MESSAGES.shortRequired)
                  : Yup.string().nullable(),
                budgetCategory: Yup.string()
                  .required(ErrorService.MESSAGES.shortRequired)
                  .typeError(ErrorService.MESSAGES.shortRequired),
                description: Yup.string().required().typeError(ErrorService.MESSAGES.required),
              });
            }

            return Yup.object().nullable();
          })
        );
      }),
    },
    [['lineItems', 'lineItems']]
  );
};

export const getInitialPOFormValue = ({ profile }: { profile: MyProfile }): UpsertPOFormValue => {
  const roleInfo = getRoleInfoOfProfile({ profile });

  const shipTo = roleInfo
    ? `${roleInfo.sendInvoiceTo && `${roleInfo.sendInvoiceTo}\n`}${
        roleInfo.department && `${roleInfo.department}\n`
      }${roleInfo.sendInvoiceToEmail && `${roleInfo.sendInvoiceToEmail}\n`}${
        roleInfo.addressStreet && `${roleInfo.addressStreet}\n`
      }${roleInfo.addressCity && `${roleInfo.addressCity} `}${
        roleInfo.addressState && `${roleInfo.addressState} `
      }${roleInfo.addressZip && `${roleInfo.addressZip} `}${
        roleInfo.addressZip4 && `${roleInfo.addressZip4} `
      }${roleInfo.addressCountry && `${roleInfo.addressCountry} `}
  `
    : '';

  return {
    ...emptyUpsertPOFormValue,
    loginName: profile.username,
    date: localTimeToHawaii(new Date(), DateFormat),
    shipTo: shipTo,
    action: null,
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

  if (checkIsFAReviewMode(response.status, currentRole)) {
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
  return {
    ...response,
    ...preFillSendInvoiceDataInFAReviewMode({ response, profile }),
    date: getDateDisplay(response.date),
    availableForms: getAvailableFormsFromResponse(response.availableForms),
    formAttachments: getAvailableFormsFromResponse(response.formAttachments),
    taxTotal: Number(response.taxTotal || 0),
    subtotal: Number(response.subtotal || 0),
    taxRate: Number(response.taxRate || 0),
    total: Number(response.total || 0),
    shippingTotal: Number(response.shippingTotal || 0),
    lineItems: [...response.lineItems, initialLineItemValue],
    action: null,
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
  const lineItemsFormValue = formValues.lineItems.slice(0, -1);
  const projectNumberPayload =
    typeof formValues.projectNumber === 'string'
      ? formValues.projectNumber
      : formValues.projectNumber.number;
  const ineItemsPayload = isVariousProject(formValues.projectNumber)
    ? lineItemsFormValue
    : lineItemsFormValue.map((lineItem) => ({
        ...lineItem,
        itemProjectNumber: projectNumberPayload,
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
    projectNumber: projectNumberPayload,
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

export const checkIsViewOnlyMode = (poStatus: PO_DETAIL_STATUS, currentRole: ROLE_NAME) => {
  if (!poStatus) return false;

  switch (currentRole) {
    case ROLE_NAME.SU:
    case ROLE_NAME.PI:
      return isFAPendingApprovalPOStatus(poStatus) || isRCUHPendingRCUHApprovalPOStatus(poStatus);
    case ROLE_NAME.FA:
      return (
        isPIPendingSubmittalPOStatus(poStatus) ||
        isRCUHPendingRCUHApprovalPOStatus(poStatus) ||
        isFAAdditionalInfoRequestedPOStatus(poStatus) ||
        isPIDisapprovedPOStatus(poStatus)
      );
    case ROLE_NAME.CU:
      return (
        isPIPendingSubmittalPOStatus(poStatus) ||
        isFAPendingApprovalPOStatus(poStatus) ||
        isFAAdditionalInfoRequestedPOStatus(poStatus) ||
        isPIDisapprovedPOStatus(poStatus)
      );

    default:
      return false;
  }
};

export const checkIsFinalMode = (poStatus: PO_DETAIL_STATUS) => {
  return isFinalPOStatus(poStatus);
};

export const checkIsFAReviewMode = (poStatus: PO_DETAIL_STATUS, currentRole: ROLE_NAME) => {
  return isFA(currentRole) && isFAPendingApprovalPOStatus(poStatus);
};

export const checkIsCUReviewMode = (poStatus: PO_DETAIL_STATUS, currentRole: ROLE_NAME) => {
  return isCU(currentRole) && isRCUHPendingRCUHApprovalPOStatus(poStatus);
};
