import { isVariousProject } from 'src/containers/PurchaseOrderContainer/GeneralInfo/helpers';
import { PO_ACTION } from 'src/queries';
import { isAdvancePOPayment, isPartialPOPayment } from 'src/queries/POPayment/helpers';
import { isPOSubmitAction } from 'src/queries/PurchaseOrders/helpers';
import { ErrorService, Yup } from 'src/services';
import { isEmpty } from 'src/validations';
import { UpdatePOPaymentFormValue } from '../types';

export const getPOPaymentFormValidationSchema = ({ action }: { action: PO_ACTION }) => {
  const isSubmitAction = isPOSubmitAction(action);

  return Yup.object().shape(
    {
      paymentDirectInquiriesTo: isSubmitAction
        ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
        : Yup.string().nullable(),
      paymentFaStaffReviewer: isSubmitAction
        ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
        : Yup.string().nullable(),
      paymentType: isSubmitAction
        ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
        : Yup.string().nullable(),
      partialOrFinalPaymentLineItem: Yup.array().when(
        ['projectNumber', 'paymentType'],
        ([projectNumber, paymentType], schema) => {
          if (isAdvancePOPayment(paymentType)) return schema.nullable().optional();

          return schema
            .min(
              // currently min error will not work cause lineItems will return string or object => can't pass into jsx
              isSubmitAction ? 1 : 0,
              'Payment section cannot be left blank.'
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
                amount: Yup.number()
                  .moreThan(0, 'Amount must be greater than $0.')
                  .lessThan(100000000, 'Amount must be less than $100,000,000.00.')
                  .typeError('Amount must be greater than $0 and less than $100,000,000.00.'),
              })
            );
        }
      ),
      advancePaymentLineItem: Yup.array().when(['paymentType'], ([paymentType], schema) => {
        if (!isAdvancePOPayment(paymentType)) return schema.nullable().optional();

        return schema.of(
          Yup.object().shape({
            amount: Yup.number()
              .moreThan(0, 'Amount must be greater than $0.')
              .lessThan(100000000, 'Amount must be less than $100,000,000.00.')
              .typeError('Amount must be greater than $0 and less than $100,000,000.00.'),
          })
        );
      }),
      paymentTotal: Yup.mixed().test(
        'invalid-partial-payment-total',
        'Partial payment total exceeds the open sum balance. A PO Change is needed before a partial payment can be made.',
        (value, context) => {
          const { remainingBalance, paymentType } = context.parent as UpdatePOPaymentFormValue;

          if (isPartialPOPayment(paymentType)) {
            return Number(value) < Number(remainingBalance);
          }

          return true;
        }
      ),

      paymentEquipmentInventories: Yup.array().when(
        ['paymentEquipmentInventoryManualFlag', 'paymentEquipmentInventories'],
        ([paymentEquipmentInventoryManualFlag, paymentEquipmentInventories], schema) => {
          if (paymentEquipmentInventoryManualFlag) return schema.optional().nullable();

          // if any inventory has been fill at least one field or have more than 1 inventory item
          if (
            !isEmpty(paymentEquipmentInventories) &&
            (paymentEquipmentInventories.length > 1 ||
              paymentEquipmentInventories.some((inventory) =>
                Object.values(inventory).some((value) => !!value)
              ))
          ) {
            return schema.of(
              Yup.object().shape({
                description: Yup.string().required().typeError(ErrorService.MESSAGES.required),
                brandName: Yup.string().required().typeError(ErrorService.MESSAGES.required),
                serialNumber: Yup.string().required().typeError(ErrorService.MESSAGES.required),
                itemCost: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
                locationOfEquipment: Yup.string()
                  .required()
                  .typeError(ErrorService.MESSAGES.required),
                ownership: Yup.string().required().typeError(ErrorService.MESSAGES.required),
                preparerName: Yup.string().required().typeError(ErrorService.MESSAGES.required),
                preparerPhone: Yup.string()
                  .phone()
                  .required()
                  .typeError(ErrorService.MESSAGES.required),
                component: Yup.string().required().typeError(ErrorService.MESSAGES.required),
                fabricatedA: Yup.string().required().typeError(ErrorService.MESSAGES.required),
                fabricatedB: Yup.string().required().typeError(ErrorService.MESSAGES.required),
                receiveDate: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
              })
            );
          }

          return schema.optional().nullable();
        }
      ),
    },
    [['paymentEquipmentInventories', 'paymentEquipmentInventories']]
  );
};
