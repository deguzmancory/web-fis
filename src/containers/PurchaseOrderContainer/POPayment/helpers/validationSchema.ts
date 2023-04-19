import { PO_ACTION } from 'src/queries';
import { isAdvancePOPayment, isPartialPOPayment } from 'src/queries/POPayment/helpers';
import { isSubmitAction } from 'src/queries/PurchaseOrders/helpers';
import { ErrorService, Yup } from 'src/services';
import { isEmpty } from 'src/validations';
import { isVariousProject } from '../../PO/GeneralInfo/helpers';
import { UpdatePOPaymentFormValue } from '../types';
import { isNotEmptyPaymentEquipmentInventory } from './utils';

export const getPOPaymentFormValidationSchema = ({ action }: { action: PO_ACTION }) => {
  const isSubmitPOAction = isSubmitAction(action);

  return Yup.object().shape(
    {
      paymentDirectInquiriesTo: isSubmitPOAction
        ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
        : Yup.string().nullable(),
      paymentFaStaffReviewer: isSubmitPOAction
        ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
        : Yup.string().nullable(),
      paymentType: isSubmitPOAction
        ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
        : Yup.string().nullable(),
      partialOrFinalPaymentLineItem: Yup.array().when(
        ['projectNumber', 'paymentType'],
        ([projectNumber, paymentType], schema) => {
          if (isAdvancePOPayment(paymentType)) return schema.nullable().optional();

          return schema
            .min(
              // currently min error will not work cause lineItems will return string or object => can't pass into jsx
              isSubmitPOAction ? 1 : 0,
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
      totalAmount: Yup.mixed().test(
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

      remittanceLineItems: Yup.array().of(
        Yup.object().shape({
          referenceNumber: Yup.string().when(
            ['amount', 'customerAccountComment'],
            ([amount, customerAccountComment], schema) => {
              if (amount !== 0 && customerAccountComment)
                return schema
                  .required(ErrorService.MESSAGES.requiredInvoiceRemittance)
                  .typeError(ErrorService.MESSAGES.requiredInvoiceRemittance);
            }
          ),
        })
      ),
      remittance: Yup.lazy((_remittanceValue, remittanceOptions) => {
        return Yup.object().shape({
          remittanceTotal: Yup.number()
            .required('The remittance total does not match the payment total.')
            .typeError('The remittance total does not match the payment total.')
            .test(
              'not-match-payment',
              'The remittance total does not match the payment total.',
              (value) => {
                if (value !== remittanceOptions.parent?.totalAmount) {
                  return false;
                } else {
                  return true;
                }
              }
            ),
        });
      }),

      paymentEquipmentInventories: Yup.array().when(
        ['paymentEquipmentInventoryManualFlag', 'paymentEquipmentInventories'],
        ([paymentEquipmentInventoryManualFlag, paymentEquipmentInventories], schema) => {
          if (paymentEquipmentInventoryManualFlag) return schema.optional().nullable();

          // if any inventory has been fill at least one field or have more than 1 inventory item
          if (!isEmpty(paymentEquipmentInventories)) {
            return schema.of(
              Yup.lazy((inventory) => {
                if (!inventory || !isNotEmptyPaymentEquipmentInventory(inventory)) {
                  return Yup.object().optional().nullable();
                }

                return Yup.object().shape({
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
                    .usPhone()
                    .required()
                    .typeError(ErrorService.MESSAGES.required),
                  component: Yup.string().required().typeError(ErrorService.MESSAGES.required),
                  fabricatedA: Yup.string().required().typeError(ErrorService.MESSAGES.required),
                  fabricatedB: Yup.string().required().typeError(ErrorService.MESSAGES.required),
                  receiveDate: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
                });
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
