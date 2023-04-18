import { PO_ACTION } from 'src/queries';
import {
  isPOApprovedAction,
  isPODocumentType,
  isPOSubmitAction,
} from 'src/queries/PurchaseOrders/helpers';
import { ErrorService, Yup } from 'src/services';
import { SHIP_VIA_VALUE, isVariousProject } from '../GeneralInfo/helpers';
import { FED_ATTACHMENT_VALUE } from '../PurchaseInfo/helpers';

export const getPOFormValidationSchema = ({ action }: { action: PO_ACTION }) => {
  const isSubmitAction = isPOSubmitAction(action);
  const isApproveAction = isPOApprovedAction(action);

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
          isSubmitAction ? 1 : 0,
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
            ext: Yup.number()
              .moreThan(0, 'Extension must be greater than $0.')
              .lessThan(100000000, 'Extension must be less than $100,000,000.00.')
              .typeError(ErrorService.MESSAGES.shortRequired),
          })
        );
    }),
    fedAttachment: isApproveAction
      ? Yup.string().when(['documentType'], {
          is: (documentType) => isPODocumentType(documentType),
          then: (schema) =>
            schema
              .required(
                'Please select a Federal attachment or check Non-Federal or UH Subaward when Approving.'
              )
              .typeError(
                'Please select a Federal attachment or check Non-Federal or UH Subaward when Approving.'
              ),
          otherwise: (schema) => schema.nullable(),
        })
      : Yup.string().nullable(),
    uhSubawardNumber: Yup.string().when(['fedAttachment', 'documentType'], {
      is: (fedAttachment, documentType) =>
        isPODocumentType(documentType) && fedAttachment === FED_ATTACHMENT_VALUE.UH_SUBAWARD,
      then: (schema) => schema.required().typeError(ErrorService.MESSAGES.required),
      otherwise: (schema) => schema.nullable(),
    }),
    sendInvoiceToFaEmail: Yup.string().notTrimmable().email().nullable().optional(),
  });
};
