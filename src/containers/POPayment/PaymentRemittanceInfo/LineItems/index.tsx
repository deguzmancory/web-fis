import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, CellType } from 'src/components/CustomTable/types';
import { EllipsisTooltipInput, EllipsisTooltipInputCurrency } from 'src/components/common';
import { PO_FORM_KEY } from 'src/containers/PurchaseOrderContainer/enums';
import { POPaymentRemittanceLineItem, PO_MODE } from 'src/queries';
import { checkRowStateAndSetValue } from 'src/utils';
import { PO_PAYMENT_REMITTANCE_KEY, PO_PAYMENT_REMITTANCE_LINE_ITEM } from '../../enums';
import {
  initialPaymentRemittanceInfo,
  paymentLineItemsRemittanceColumnsNames,
} from '../../helpers';
import { UpdatePOPaymentFormikProps } from '../../types';

const TableLineItems: React.FC<Props> = ({ formikProps, disable }) => {
  const { values, setFieldValue, getFieldProps } = formikProps;

  const lineItemValue = React.useMemo(() => {
    return values.remittanceLineItems;
  }, [values.remittanceLineItems]);

  const paymentLineItemKey = PO_FORM_KEY.REMITTANCE_LINE_ITEMS;

  const removeRow = React.useCallback(
    (index: number) => {
      setFieldValue(
        `${paymentLineItemKey}`,
        lineItemValue.filter((_row, idx) => idx !== index)
      );
    },
    [lineItemValue, paymentLineItemKey, setFieldValue]
  );

  const addNewRow = React.useCallback(() => {
    setFieldValue(`${paymentLineItemKey}`, [
      ...lineItemValue,
      {
        ...initialPaymentRemittanceInfo,
      },
    ]);
  }, [lineItemValue, paymentLineItemKey, setFieldValue]);

  const updatePaymentAmountTotal = React.useCallback(
    ({ lineItemRow, index }: { lineItemRow: POPaymentRemittanceLineItem; index: number }) => {
      let updatedPaymentTotal = Number(values.remittance.remittanceTotal || 0);
      const currentLineItemAmount = Number(lineItemRow.amount || 0);

      updatedPaymentTotal = lineItemValue.reduce((total, currentLineItem, currentIndex) => {
        if (index === currentIndex) return total + currentLineItemAmount;

        return total + currentLineItem.amount;
      }, 0);
      setFieldValue(
        `${PO_FORM_KEY.PAYMENT_REMITTANCE}.${PO_PAYMENT_REMITTANCE_KEY.REMITTANCE_TOTAL}`,
        updatedPaymentTotal
      );
    },

    [lineItemValue, setFieldValue, values.remittance.remittanceTotal]
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
      lineItemRow: POPaymentRemittanceLineItem;
      key: PO_PAYMENT_REMITTANCE_LINE_ITEM;
      index: number;
    }) => {
      checkRowStateAndSetValue<POPaymentRemittanceLineItem>({
        name,
        value,
        index,
        records: lineItemValue,
        columnKeys: paymentLineItemsRemittanceColumnsNames,
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

  const handleInputChange = ({ name, value, index }) => {
    checkRowStateAndSetValue<POPaymentRemittanceLineItem>({
      name,
      value,
      index,
      records: lineItemValue,
      columnKeys: paymentLineItemsRemittanceColumnsNames,
      setFieldValue,
      onAddRow: addNewRow,
      onRemoveRow: removeRow,
    });
  };

  const lineItemRows: BodyBasicRows = lineItemValue.map((lineItemRow, index) => {
    const prefixLineItem = `${paymentLineItemKey}.${index}`;

    return {
      style: {
        verticalAlign: 'top',
      },
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
                `${prefixLineItem}.${PO_PAYMENT_REMITTANCE_LINE_ITEM.REFERENCE_NUMBER}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_PAYMENT_REMITTANCE_LINE_ITEM.REFERENCE_NUMBER}`,
                  value: event.target.value,
                })
              }
              maxLength={29}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Customer Account/Comment',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(
                `${prefixLineItem}.${PO_PAYMENT_REMITTANCE_LINE_ITEM.CUSTOMER_ACCOUNT_COMMENT}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_PAYMENT_REMITTANCE_LINE_ITEM.CUSTOMER_ACCOUNT_COMMENT}`,
                  value: event.target.value,
                })
              }
              maxLength={29}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Amount *',
          content: (
            <EllipsisTooltipInputCurrency
              {...getFieldProps(`${prefixLineItem}.${PO_PAYMENT_REMITTANCE_LINE_ITEM.AMOUNT}`)}
              onChange={(name, value) =>
                handleAmountChange({
                  name,
                  value,
                  lineItemRow,
                  index,
                  key: PO_PAYMENT_REMITTANCE_LINE_ITEM.AMOUNT,
                })
              }
            />
          ),
        },
      ],
    };
  });

  return (
    <Box>
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
              `${PO_FORM_KEY.PAYMENT_REMITTANCE}.${PO_PAYMENT_REMITTANCE_KEY.REMITTANCE_TOTAL}`
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
  formikProps: UpdatePOPaymentFormikProps;
  disable?: boolean;
  currentPOMode?: PO_MODE;
};

export default TableLineItems;
