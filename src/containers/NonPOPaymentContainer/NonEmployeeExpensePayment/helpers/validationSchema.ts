import { PO_ACTION } from 'src/queries';
import {
  isInGroup1Payee,
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
        >
      >
    > & {
      vendorName: any;
      vendorCode: any;
      fromServiceDate: any;
      toServiceDate: any;
      startDepartureDate: any;
      endArrivalDate: any;
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
    employer: isSubmitPOAction
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
      ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),
    startDepartureDate: isSubmitPOAction
      ? Yup.date().required().typeError(ErrorService.MESSAGES.required)
      : Yup.date().nullable(),
    endDestination: isSubmitPOAction
      ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),
    endArrivalDate: isSubmitPOAction
      ? Yup.date().required().typeError(ErrorService.MESSAGES.required)
      : Yup.date().nullable(),
  });
};
