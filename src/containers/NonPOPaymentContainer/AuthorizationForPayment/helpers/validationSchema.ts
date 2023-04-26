import { isEmpty } from 'lodash';
import { isNotEmptyPaymentEquipmentInventory } from 'src/containers/PurchaseOrderContainer/POPayment/helpers';
import { PO_ACTION } from 'src/queries';
import { isSubmitAction } from 'src/queries/PurchaseOrders/helpers';
import { ErrorService, Yup } from 'src/services';
import { CustomShape } from 'src/services/yup';
import { UpsertAuthorizationFormValue } from '../types';

export const getAuthorizationPaymentFormValidationSchema = ({ action }: { action: PO_ACTION }) => {
  const isSubmitPOAction = isSubmitAction(action);

  return Yup.object().shape<
    CustomShape<
      Partial<
        Omit<
          UpsertAuthorizationFormValue,
          | 'vendorName'
          | 'vendorCode'
          | 'projectLineItems'
          | 'remittanceLineItems'
          | 'remittance'
          | 'equipmentInventories'
        >
      >
    > & {
      vendorName: any;
      vendorCode: any;
      projectLineItems: any;
      remittanceLineItems: any;
      remittance: any;
      equipmentInventories: any;
    }
  >(
    {
      //general info
      vendorName: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
      vendorCode: Yup.mixed().required().typeError(ErrorService.MESSAGES.required),
      directInquiriesTo: isSubmitPOAction
        ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
        : Yup.string().nullable(),
      faStaffReviewer: isSubmitPOAction
        ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
        : Yup.string().nullable(),

      // project line Item
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
            description: isSubmitPOAction
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
            .lessThan(100000000, 'The TOTAL must be less than $100,000,000.00.')
            .moreThan(0, 'The TOTAL must be greater than $0.')
            .required('The TOTAL must be greater than $0.')
            .typeError('The TOTAL must be greater than $0.')
        : Yup.number().nullable(),

      remittanceLineItems: isSubmitPOAction
        ? Yup.array()
            .min(1, 'At least one remittance line must be filled in.')
            .transform((fields: any[]) => fields.slice(0, -1))
            .of(
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
            )
        : Yup.array()
          .of(
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
          remittanceTotal: isSubmitPOAction
            ? Yup.number()
                .required('The remittance total does not match the payment total.')
                .typeError('The remittance total does not match the payment total.')
                .test(
                  'not-match-payment',
                  'The remittance total does not match the payment total.',
                  (value) => {
                    if (value !== remittanceOptions.parent?.paymentTotal) {
                      return false;
                    } else {
                      return true;
                    }
                  }
                )
            : Yup.number().nullable(),
        });
      }),

      equipmentInventories: Yup.array().when(
        ['equipmentInventoryManualFlag', 'equipmentInventories'],
        ([equipmentInventoryManualFlag, equipmentInventories], schema) => {
          if (equipmentInventoryManualFlag) return schema.optional().nullable();

          // if any inventory has been fill at least one field or have more than 1 inventory item
          if (!isEmpty(equipmentInventories)) {
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
    [['equipmentInventories', 'equipmentInventories']]
  );
};
