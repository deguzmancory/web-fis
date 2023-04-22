import { Box, Typography } from '@mui/material';
import { ChangeEvent, FC, memo } from 'react';
import { Checkbox, EllipsisTooltipInputCurrency } from 'src/components/common';
import { PO_MODE } from 'src/queries';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { NON_EMPLOYEE_TRAVEL_FORM_KEY } from '../enums';
import { UpsertNonEmployeeTravelFormikProps } from '../types';

const ReceiptCertification: FC<Props> = ({ formikProps, disabled = false }) => {
  const { errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } = formikProps;

  const _getErrorMessage = (fieldName: NON_EMPLOYEE_TRAVEL_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Typography variant="body2">Lost/Unavailable Receipt Certification:</Typography>

      <Box mt={1}>
        <Checkbox.Item
          label={
            <>
              <div style={{ display: 'contents' }}>
                <div style={{ display: 'contents' }}>
                  I certify that each individual expense <b>under $75</b> listed above, for which no
                  receipt or other proof of payment is available was used for the conduct of
                  official business. The total amount of these expense is{' '}
                </div>
                <div style={{ display: 'inline-block' }}>
                  <EllipsisTooltipInputCurrency
                    errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.NO_RECEIPT_AMOUNT)}
                    {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.NO_RECEIPT_AMOUNT)}
                    disabled={disabled}
                    style={{ width: 150 }}
                  />
                </div>
              </div>
            </>
          }
          transitionCaseInput
          {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.NO_RECEIPT_SMALL_CORRECT_FLAG)}
          errorMessage={_getErrorMessage(
            NON_EMPLOYEE_TRAVEL_FORM_KEY.NO_RECEIPT_SMALL_CORRECT_FLAG
          )}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFieldValue(
              NON_EMPLOYEE_TRAVEL_FORM_KEY.NO_RECEIPT_SMALL_CORRECT_FLAG,
              e.target?.checked
            )
          }
          disabled={disabled}
        />
      </Box>
      <Box mt={1}>
        <Typography variant="body2">** NOTE: The above statement does not apply to:</Typography>
        <ul style={{ listStyle: 'inside' }}>
          <li>
            <Typography variant="body2" component={'span'}>
              Lodging expenditures (and itemized receipt is required regardless of the amount)
            </Typography>
          </li>
          <li>
            <Typography variant="body2" component={'span'}>
              Expenses $75 or greater (a receipt or other proof of payment is required)
            </Typography>
          </li>
        </ul>
      </Box>
    </Box>
  );
};

type Props = {
  formikProps: UpsertNonEmployeeTravelFormikProps;
  disabled?: boolean;
  currentMode: PO_MODE;
};

export default memo(ReceiptCertification, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    NON_EMPLOYEE_TRAVEL_FORM_KEY.NO_RECEIPT_AMOUNT,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.NO_RECEIPT_SMALL_CORRECT_FLAG,
  ];

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentMode === nextProps.currentMode &&
    isEqualPrevAndNextFormikValues({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
