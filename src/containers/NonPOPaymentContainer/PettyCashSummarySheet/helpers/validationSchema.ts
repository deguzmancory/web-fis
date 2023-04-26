import { PO_ACTION } from 'src/queries';
import { isSubmitAction } from 'src/queries/PurchaseOrders/helpers';
import { ErrorService, Yup } from 'src/services';
import { CustomShape } from 'src/services/yup';
import { UpsertPettyCashFormValue } from '../types';

export const getPettyCashFormValidationSchema = ({ action }: { action: PO_ACTION }) => {
  const isSubmitPOAction = isSubmitAction(action);

  return Yup.object().shape<
    CustomShape<
      Partial<Omit<UpsertPettyCashFormValue, 'vendorName' | 'vendorCode' | 'projectLineItems'>>
    > & {
      vendorName: any;
      vendorCode: any;
      projectLineItems: any;
    }
  >({
    //general info
    vendorName: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    vendorCode: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    faStaffReviewer: isSubmitPOAction
      ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),

    //project items
    projectLineItems: Yup.array()
      .min(1, 'At least one Project # is required.')
      .transform((fields: any[]) => fields.slice(0, -1))
      .of(
        Yup.object().shape({
          projectNumber: Yup.mixed().required(ErrorService.MESSAGES.shortRequired),
          budgetCategory: isSubmitPOAction
            ? Yup.string()
                .required(ErrorService.MESSAGES.shortRequired)
                .typeError(ErrorService.MESSAGES.shortRequired)
            : Yup.string().nullable(),
          amount: isSubmitPOAction
            ? Yup.number()
                .required(ErrorService.MESSAGES.shortRequired)
                .typeError(ErrorService.MESSAGES.shortRequired)
            : Yup.number().nullable(),
        })
      ),
    paymentTotal: isSubmitPOAction
      ? Yup.number()
          .moreThan(0, 'The TOTAL must be greater than $0.')
          .lessThan(100000000, 'The TOTAL must be less than $100,000,000.00.')
          .typeError('The TOTAL must be greater than $0.')
          .test(
            'not-match-claim-due',
            'The TOTAL must match the CLAIM DUE (A-B) from the Expenditures section.',
            (value, context) => {
              const { expenditureTotal, amountAdvanced } = context.parent;

              if (Number(value) !== Number(expenditureTotal) - Number(amountAdvanced)) {
                return false;
              }

              return true;
            }
          )
      : Yup.number().nullable(),

    custodianSignature: isSubmitPOAction
      ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),
    piSignature: isSubmitPOAction
      ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),
    faSignature: isSubmitPOAction
      ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),
  });
};
