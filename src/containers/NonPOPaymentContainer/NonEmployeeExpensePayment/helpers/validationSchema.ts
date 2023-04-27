import { PO_ACTION } from 'src/queries';
import {
  isInGroup1Payee,
  isInGroup2Payee,
  isServiceProviderPayeeCategory,
} from 'src/queries/NonPOPayment/NonEmployeeTravel/helpers';
import { isSubmitAction } from 'src/queries/PurchaseOrders/helpers';
import { ErrorService, Yup } from 'src/services';
import { CustomShape } from 'src/services/yup';
import { UpsertNonEmployeeTravelFormValue } from '../types';

export const getNonEmployeeTravelFormValidationSchema = ({ action }: { action: PO_ACTION }) => {
  const isSubmitPOAction = isSubmitAction(action);

  return Yup.object().shape<
    CustomShape<
      Partial<
        Omit<
          UpsertNonEmployeeTravelFormValue,
          | 'vendorName'
          | 'vendorCode'
          | 'fromServiceDate'
          | 'toServiceDate'
          | 'startDepartureDate'
          | 'endArrivalDate'
          | 'projectLineItems'
        >
      >
    > & {
      vendorName: any;
      vendorCode: any;
      fromServiceDate: any;
      toServiceDate: any;
      startDepartureDate: any;
      endArrivalDate: any;
      projectLineItems: any;
    }
  >({
    // SelectPayeeCategory
    payeeCategory: isSubmitPOAction
      ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),

    //general info
    vendorName: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    vendorCode: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
    positionTitle: isSubmitPOAction
      ? Yup.string().when(['payeeCategory'], ([payeeCategory], schema) => {
          if (isServiceProviderPayeeCategory(payeeCategory)) {
            return schema.required().typeError(ErrorService.MESSAGES.required);
          }

          return schema.nullable();
        })
      : Yup.string().nullable(),
    organization: isSubmitPOAction
      ? Yup.string().when(['payeeCategory'], ([payeeCategory], schema) => {
          if (isServiceProviderPayeeCategory(payeeCategory)) {
            return schema.required().typeError(ErrorService.MESSAGES.required);
          }

          return schema.nullable();
        })
      : Yup.string().nullable(),
    faStaffReviewer: isSubmitPOAction
      ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),
    projectContact: isSubmitPOAction
      ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),
    projectContactPhone: isSubmitPOAction
      ? Yup.string().usPhone().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),
    fromServiceDate: isSubmitPOAction
      ? Yup.date().when(['payeeCategory'], ([payeeCategory], schema) => {
          if (isInGroup1Payee(payeeCategory)) {
            return schema.required().typeError(ErrorService.MESSAGES.required);
          }

          return schema.nullable();
        })
      : Yup.date().nullable(),
    toServiceDate: isSubmitPOAction
      ? Yup.date().when(['payeeCategory'], ([payeeCategory], schema) => {
          if (isInGroup1Payee(payeeCategory)) {
            return schema.required().typeError(ErrorService.MESSAGES.required);
          }

          return schema.nullable();
        })
      : Yup.date().nullable(),

    // trip itineraries
    startDestination: isSubmitPOAction
      ? Yup.string().when(['payeeCategory'], ([payeeCategory], schema) => {
          if (isInGroup1Payee(payeeCategory)) {
            return schema.required().typeError(ErrorService.MESSAGES.required);
          }

          return schema.nullable();
        })
      : Yup.string().nullable(),
    startDepartureDate: isSubmitPOAction
      ? Yup.date().when(['payeeCategory'], ([payeeCategory], schema) => {
          if (isInGroup1Payee(payeeCategory)) {
            return schema.required().typeError(ErrorService.MESSAGES.required);
          }

          return schema.nullable();
        })
      : Yup.date().nullable(),
    endDestination: isSubmitPOAction
      ? Yup.string().when(['payeeCategory'], ([payeeCategory], schema) => {
          if (isInGroup1Payee(payeeCategory)) {
            return schema.required().typeError(ErrorService.MESSAGES.required);
          }

          return schema.nullable();
        })
      : Yup.string().nullable(),
    endArrivalDate: isSubmitPOAction
      ? Yup.date().when(['payeeCategory'], ([payeeCategory], schema) => {
          if (isInGroup1Payee(payeeCategory)) {
            return schema.required().typeError(ErrorService.MESSAGES.required);
          }

          return schema.nullable();
        })
      : Yup.date().nullable(),

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
              const { expenditureTotal, amountAdvanced, payeeCategory } = context.parent;

              if (isInGroup2Payee(payeeCategory)) return true;

              if (Number(value) !== Number(expenditureTotal) - Number(amountAdvanced)) {
                return false;
              }

              return true;
            }
          )
      : Yup.number().nullable(),

    // Business Purpose Details
    travelDetails: isSubmitPOAction
      ? Yup.string()
          .required('Purpose/NSFA Details are required for your Payee Category')
          .typeError('Purpose/NSFA Details are required for your Payee Category')
      : Yup.string().nullable(),
    claimantSignature: isSubmitPOAction
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
