import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, CellType } from 'src/components/CustomTable/types';
import { EllipsisTooltipInput, EllipsisTooltipInputCurrency } from 'src/components/common';
import { AuthorizationRemittanceLineItem } from 'src/queries/NonPOPayment/AuthorizationForPayment/types';
import { checkRowStateAndSetValue, getErrorMessage } from 'src/utils';
import {
  AUTHORIZATION_FOR_PAYMENT_KEY,
  AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY,
  AUTHORIZATION_REMITTANCE_KEY,
} from '../../enum';
import {
  authorizationLineItemsRemittanceColumnsNames,
  initialAuthorizationPaymentRemittance,
} from '../../helpers/contants';
import { UpsertAuthorizationPaymentFormikProps } from '../../types';

const LineItem: React.FC<Props> = ({ formikProps, disabled }) => {
  const { errors, values, touched, setFieldValue, getFieldProps } = formikProps;

  const lineItemValue = React.useMemo(() => {
    return values.remittanceLineItems || [];
  }, [values.remittanceLineItems]);

  const remittanceLineItemKey = AUTHORIZATION_FOR_PAYMENT_KEY.REMITTANCE_LINE_ITEMS;

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const addNewRow = React.useCallback(() => {
    setFieldValue(`${remittanceLineItemKey}`, [
      ...lineItemValue,
      {
        ...initialAuthorizationPaymentRemittance,
      },
    ]);
  }, [lineItemValue, remittanceLineItemKey, setFieldValue]);

  const removeRow = React.useCallback(
    (index: number) => {
      setFieldValue(
        `${remittanceLineItemKey}`,
        lineItemValue.filter((_row, idx) => idx !== index)
      );
    },
    [lineItemValue, remittanceLineItemKey, setFieldValue]
  );

  const handleInputChange = ({ name, value, index }) => {
    checkRowStateAndSetValue<AuthorizationRemittanceLineItem>({
      name,
      value,
      index,
      records: lineItemValue,
      columnKeys: authorizationLineItemsRemittanceColumnsNames,
      setFieldValue,
      onAddRow: addNewRow,
      onRemoveRow: removeRow,
    });
  };

  const updatePaymentAmountTotal = React.useCallback(
    ({ lineItemRow, index }: { lineItemRow: AuthorizationRemittanceLineItem; index: number }) => {
      let updatedPaymentTotal = Number(values.remittance?.remittanceTotal || 0);
      const currentLineItemAmount = Number(lineItemRow.amount || 0);

      updatedPaymentTotal = lineItemValue.reduce((total, currentLineItem, currentIndex) => {
        if (index === currentIndex) return total + currentLineItemAmount;

        return total + currentLineItem.amount;
      }, 0);
      setFieldValue(
        `${AUTHORIZATION_FOR_PAYMENT_KEY.REMITTANCE}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_TOTAL}`,
        updatedPaymentTotal
      );
    },

    [lineItemValue, setFieldValue, values.remittance?.remittanceTotal]
  );

  const handleAmountChange = React.useCallback(
    ({
      name,
      value,
      lineItemRow,
      key,
      index,
    }: {
      name: string;
      value: any;
      lineItemRow: AuthorizationRemittanceLineItem;
      key: AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY;
      index: number;
    }) => {
      checkRowStateAndSetValue<AuthorizationRemittanceLineItem>({
        name,
        value,
        index,
        records: lineItemValue,
        columnKeys: authorizationLineItemsRemittanceColumnsNames,
        setFieldValue,
        onAddRow: addNewRow,
        onRemoveRow: removeRow,
        callback: () => {
          updatePaymentAmountTotal({
            index,
            lineItemRow: {
              ...lineItemRow,
              [key]: value,
            },
          });
        },
      });
    },
    [addNewRow, lineItemValue, removeRow, setFieldValue, updatePaymentAmountTotal]
  );

  const lineItemRows: BodyBasicRows = lineItemValue.map((lineItemRow, index) => {
    const prefixLineItem = `${remittanceLineItemKey}.${index}`;

    return {
      style: {
        verticalAlign: 'top',
      },
      errorMessage: _getErrorMessage(
        `${prefixLineItem}.${AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY.REFERENCE_NUMBER}`
      ),
      columns: [
        {
          label: 'Line',
          content: `${index + 1}`,
        },
        {
          type: CellType.INPUT,
          label: 'Invoice/Reference Number *',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(
                `${prefixLineItem}.${AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY.REFERENCE_NUMBER}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY.REFERENCE_NUMBER}`,
                  value: event.target.value,
                })
              }
              maxLength={29}
              disabled={disabled}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Customer Account/Comment',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(
                `${prefixLineItem}.${AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY.CUSTOMER_ACCOUNT_COMMENT}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY.CUSTOMER_ACCOUNT_COMMENT}`,
                  value: event.target.value,
                })
              }
              maxLength={29}
              disabled={disabled}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Amount *',
          content: (
            <EllipsisTooltipInputCurrency
              {...getFieldProps(
                `${prefixLineItem}.${AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY.AMOUNT}`
              )}
              onChange={(name, value) =>
                handleAmountChange({
                  name,
                  value,
                  lineItemRow,
                  index,
                  key: AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY.AMOUNT,
                })
              }
              disabled={disabled}
            />
          ),
        },
      ],
    };
  });

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Remittance Information:
      </Typography>
      {/* Hidden input for scroll to error purpose */}
      <input name={remittanceLineItemKey} hidden />
      <Typography variant="body2">Remittance Advice</Typography>
      <CustomTable.Basic bodyList={lineItemRows} />

      <Grid container className="justify-flex-end" mt={2}>
        <Grid item xs={1.5}>
          <Typography variant="h6" fontWeight={'bold'}>
            TOTAL
          </Typography>
        </Grid>
        <Grid item>
          <EllipsisTooltipInputCurrency
            {...getFieldProps(
              `${AUTHORIZATION_FOR_PAYMENT_KEY.REMITTANCE}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_TOTAL}`
            )}
            errorMessage={_getErrorMessage(
              `${AUTHORIZATION_FOR_PAYMENT_KEY.REMITTANCE}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_TOTAL}`
            )}
            textAlign="right"
            disabled
            lengthShowTooltip={8}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpsertAuthorizationPaymentFormikProps;
  disabled?: boolean;
};

export default LineItem;
