import { Box, Grid, Typography } from '@mui/material';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, CellType } from 'src/components/CustomTable/types';
import { EllipsisTooltipInput, EllipsisTooltipInputCurrency } from 'src/components/common';
import {
  checkRowStateAndSetValue,
  getErrorMessage,
  isEqualPrevAndNextFormikValues,
} from 'src/utils';

import { memo, useCallback, useMemo } from 'react';

import { initialPaymentRemittanceInfo } from 'src/containers/PurchaseOrderContainer/POPayment/helpers';
import { CommonFormikProps } from 'src/utils/commonTypes';
import {
  NON_PO_PAYMENT_REMITTANCE_KEY,
  NON_PO_PAYMENT_REMITTANCE_LINE_ITEM_KEY,
  NON_PO_PAYMENT_REMITTANCE_QUESTIONS_KEY,
  nonPoPaymentLineItemsRemittanceColumnsNames,
} from '../enum';
import { NonPOPaymentRemittanceLineItem } from 'src/queries/NonPOPayment/types';

const remittanceLineItemKey = NON_PO_PAYMENT_REMITTANCE_KEY.REMITTANCE_LINE_ITEMS;

const RemittanceTableLineItems: React.FC<Props> = ({
  formikProps,
  prefixRemittanceLineItem,
  disableReferenceNumber = false,
  disabled = false,
}) => {
  const { errors, values, touched, setFieldValue, getFieldProps } = formikProps;

  const lineItemValue = useMemo(() => {
    return values.remittanceLineItems || [];
  }, [values.remittanceLineItems]);

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const addNewRow = useCallback(() => {
    setFieldValue(`${remittanceLineItemKey}`, [
      ...lineItemValue,
      {
        ...initialPaymentRemittanceInfo,
      },
    ]);
  }, [lineItemValue, setFieldValue]);

  const removeRow = useCallback(
    (index: number) => {
      setFieldValue(
        `${remittanceLineItemKey}`,
        lineItemValue.filter((_row, idx) => idx !== index)
      );
    },
    [lineItemValue, setFieldValue]
  );

  const handleInputChange = ({ name, value, index }) => {
    checkRowStateAndSetValue<NonPOPaymentRemittanceLineItem>({
      name,
      value,
      index,
      records: lineItemValue,
      columnKeys: nonPoPaymentLineItemsRemittanceColumnsNames,
      setFieldValue,
      onAddRow: addNewRow,
      onRemoveRow: removeRow,
    });
  };

  const updatePaymentAmountTotal = useCallback(
    ({ lineItemRow, index }: { lineItemRow: NonPOPaymentRemittanceLineItem; index: number }) => {
      let updatedPaymentTotal = Number(values.remittance?.remittanceTotal || 0);
      const currentLineItemAmount = Number(lineItemRow.amount || 0);

      updatedPaymentTotal = lineItemValue.reduce((total, currentLineItem, currentIndex) => {
        if (index === currentIndex) return total + currentLineItemAmount;

        return total + currentLineItem.amount;
      }, 0);
      setFieldValue(
        `${NON_PO_PAYMENT_REMITTANCE_KEY.REMITTANCE}.${NON_PO_PAYMENT_REMITTANCE_QUESTIONS_KEY.REMITTANCE_TOTAL}`,
        updatedPaymentTotal
      );
    },

    [lineItemValue, setFieldValue, values.remittance?.remittanceTotal]
  );

  const handleAmountChange = useCallback(
    ({
      name,
      value,
      lineItemRow,
      key,
      index,
    }: {
      name: string;
      value: any;
      lineItemRow: NonPOPaymentRemittanceLineItem;
      key: NON_PO_PAYMENT_REMITTANCE_LINE_ITEM_KEY;
      index: number;
    }) => {
      checkRowStateAndSetValue<NonPOPaymentRemittanceLineItem>({
        name,
        value,
        index,
        records: lineItemValue,
        columnKeys: nonPoPaymentLineItemsRemittanceColumnsNames,
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
        `${prefixLineItem}.${NON_PO_PAYMENT_REMITTANCE_LINE_ITEM_KEY.REFERENCE_NUMBER}`
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
                `${prefixLineItem}.${NON_PO_PAYMENT_REMITTANCE_LINE_ITEM_KEY.REFERENCE_NUMBER}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${NON_PO_PAYMENT_REMITTANCE_LINE_ITEM_KEY.REFERENCE_NUMBER}`,
                  value: event.target.value,
                })
              }
              maxLength={29}
              disabled={disabled || disableReferenceNumber}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Customer Account/Comment',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(
                `${prefixLineItem}.${NON_PO_PAYMENT_REMITTANCE_LINE_ITEM_KEY.CUSTOMER_ACCOUNT_COMMENT}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${NON_PO_PAYMENT_REMITTANCE_LINE_ITEM_KEY.CUSTOMER_ACCOUNT_COMMENT}`,
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
                `${prefixLineItem}.${NON_PO_PAYMENT_REMITTANCE_LINE_ITEM_KEY.AMOUNT}`
              )}
              onChange={(name, value) =>
                handleAmountChange({
                  name,
                  value,
                  lineItemRow,
                  index,
                  key: NON_PO_PAYMENT_REMITTANCE_LINE_ITEM_KEY.AMOUNT,
                })
              }
              disabled={disabled}
            />
          ),
        },
      ],
    };
  });

  const remittanceItemsErrors =
    touched.remittanceLineItems &&
    errors.remittanceLineItems &&
    values.remittanceLineItems?.length === 1
      ? 'At least one remittance line must be filled in.'
      : '';

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Remittance Information:
      </Typography>
      {/* Hidden input for scroll to error purpose */}
      <input name={remittanceLineItemKey} hidden />
      <Typography variant="body2">Remittance Advice</Typography>
      <CustomTable.Basic bodyList={lineItemRows} errorMessage={remittanceItemsErrors} />

      <Grid container className="justify-flex-end" mt={2}>
        <Grid item xs={1.5}>
          <Typography variant="h6" fontWeight={'bold'}>
            TOTAL
          </Typography>
        </Grid>
        <Grid item>
          <EllipsisTooltipInputCurrency
            {...getFieldProps(
              `${NON_PO_PAYMENT_REMITTANCE_KEY.REMITTANCE}.${NON_PO_PAYMENT_REMITTANCE_QUESTIONS_KEY.REMITTANCE_TOTAL}`
            )}
            errorMessage={_getErrorMessage(
              `${NON_PO_PAYMENT_REMITTANCE_KEY.REMITTANCE}.${NON_PO_PAYMENT_REMITTANCE_QUESTIONS_KEY.REMITTANCE_TOTAL}`
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
  formikProps: CommonFormikProps<any>;
  prefixRemittanceLineItem?: string;
  disableReferenceNumber?: boolean;
  disabled?: boolean;
};

export default memo(RemittanceTableLineItems, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender: [remittanceLineItemKey],
    })
  );
});
