import { EmployeeStatus, PO_ACTION, UHBUNumber, UHPRNumber } from 'src/queries';
import { isServiceProviderPayeeCategory } from 'src/queries/NonPOPayment/NonEmployeeTravel/helpers';
import { isSubmitAction } from 'src/queries/PurchaseOrders/helpers';
import { ErrorService, Yup } from 'src/services';
import { CustomShape } from 'src/services/yup';
import { PersonalAutomobileFormValue } from '../types';

export const getPersonalAutomobileFormValidationSchema = ({ action }: { action: PO_ACTION }) => {
  const isSubmitPOAction = isSubmitAction(action);

  return Yup.object().shape<
    CustomShape<
      Partial<Omit<PersonalAutomobileFormValue, 'vendorName' | 'vendorCode' | 'projectItems'>>
    > & {
      vendorName: any;
      vendorCode: any;
      projectItems: any;
    }
  >({
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
    faStaffReviewer: isSubmitPOAction
      ? Yup.string().required().typeError(ErrorService.MESSAGES.required)
      : Yup.string().nullable(),

    employeeStatus: Yup.string()
      .nullable()
      .required()
      .when(['employeeNumber'], ([employeeNumber], schema) => {
        return !employeeNumber
          ? schema.test({
              name: 'test-employee-number',
              test: (value: EmployeeStatus, { path, createError }) => {
                if (!value) return true;
                return createError({
                  path,
                  message: `Employee has no ${
                    value === EmployeeStatus.RCUH ? 'RCUH' : 'UH'
                  } Employee Number on File. Email RCUH Disbursing at rcuhdisb@rcuh.com.`,
                });
              },
            })
          : schema;
      }),
    buNumber: Yup.string().when(['employeeStatus'], ([employeeStatus], schema) =>
      employeeStatus === EmployeeStatus.UH
        ? schema.required().typeError('A BU Number is required for UH employees.')
        : schema.nullable()
    ),
    prNumber: Yup.string().when(
      ['employeeStatus', 'buNumber'],
      ([employeeStatus, buNumber], schema) => {
        if (employeeStatus === EmployeeStatus.UH) {
          return buNumber === UHBUNumber._00
            ? schema
                .required()
                .test(
                  'test-bu-number',
                  'If the UH PR number is set to FF1, FF2, or FF3, then the UH BU number must be set to 00.',
                  (value: UHPRNumber) =>
                    [UHPRNumber.FF1, UHPRNumber.FF2, UHPRNumber.FF3].includes(value)
                )
            : schema.required().typeError('A PR Number is required for UH employees.');
        } else {
          return schema.nullable();
        }
      }
    ),

    //project items
    projectItems: Yup.array()
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
  });
};
