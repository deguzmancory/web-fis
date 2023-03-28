import { ErrorService, Yup } from 'src/services';
import { PO_ACTION } from '../enums';
import { isVariousProject, SHIP_VIA_VALUE } from '../GeneralInfo/helpers';
import { FED_ATTACHMENT_VALUE } from '../PurchaseInfo/helpers';
import { isPOSubmitAction } from './utils';

export const getPOFormValidationSchema = ({ action }: { action: PO_ACTION }) => {
  const isSubmitAction = isPOSubmitAction(action);

  return Yup.object().shape({
    projectTitle: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    projectNumber: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    vendorName: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    vendorCode: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    shipOther: Yup.string().when('shipVia', {
      is: SHIP_VIA_VALUE.OTHER,
      then: (schema) => schema.required().typeError(ErrorService.MESSAGES.required),
      otherwise: (schema) => schema.nullable(),
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
    lineItems: Yup.array().when(['projectNumber'], ([projectNumber], schema) => {
      return schema
        .min(
          // currently min error will not work cause lineItems will return string or object => can't pass into jsx
          1,
          isVariousProject(projectNumber)
            ? 'At least one Project # is Required'
            : 'Budget Category is required. Description is required.'
        )
        .transform((fields: any[]) => fields.slice(0, -1))
        .of(
          Yup.object().shape({
            itemProjectNumber: isVariousProject(projectNumber)
              ? Yup.mixed().required(ErrorService.MESSAGES.shortRequired)
              : Yup.string().nullable(),
            budgetCategory: Yup.string()
              .required(ErrorService.MESSAGES.shortRequired)
              .typeError(ErrorService.MESSAGES.shortRequired),
            description: Yup.string().required().typeError(ErrorService.MESSAGES.required),
          })
        );
    }),

    uhSubawardNumber: Yup.string().when('fedAttachment', {
      is: FED_ATTACHMENT_VALUE.UH_SUBAWARD,
      then: (schema) => schema.required().typeError(ErrorService.MESSAGES.required),
      otherwise: (schema) => schema.nullable(),
    }),
    sendInvoiceToFaEmail: Yup.string().notTrimmable().email().nullable().optional(),
  });
};
