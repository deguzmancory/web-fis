import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, CellType } from 'src/components/CustomTable/types';
import {
  DatePicker,
  EllipsisTooltipInput,
  EllipsisTooltipInputCurrency,
  Input,
} from 'src/components/common';
import { isVariousProject } from 'src/containers/PurchaseOrderContainer/GeneralInfo/helpers';
import { PO_FORM_KEY } from 'src/containers/PurchaseOrderContainer/enums';
import SearchProjectNumber from 'src/containers/shared/SearchProjectNumber';
import { POPaymentLineItem, PO_MODE } from 'src/queries';
import {
  checkRowStateAndSetValue,
  getErrorMessage,
  isEqualPrevAndNextFormikValues,
} from 'src/utils';
import { PO_PAYMENT_LINE_ITEM_KEY } from '../enums';
import { initialPaymentLineItemValue, paymentLineItemsColumnNames } from '../helpers';
import { UpdatePOPaymentFormValue, UpdatePOPaymentFormikProps } from '../types';

const TablePaymentLineItems: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { values, errors, touched, setFieldValue, getFieldProps, setFieldTouched } = formikProps;

  const paymentLineItemsValue = React.useMemo(() => {
    return values.paymentLineItems;
  }, [values.paymentLineItems]);

  const isVariousProjectNumber = React.useMemo(
    () => isVariousProject(values.projectNumber),
    [values.projectNumber]
  );

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const removeRow = React.useCallback(
    (index: number) => {
      setFieldValue(
        `${PO_FORM_KEY.PAYMENT_LINE_ITEMS}`,
        paymentLineItemsValue.filter((_row, idx) => idx !== index)
      );
    },
    [paymentLineItemsValue, setFieldValue]
  );

  const addNewRow = React.useCallback(() => {
    setFieldValue(`${PO_FORM_KEY.PAYMENT_LINE_ITEMS}`, [
      ...paymentLineItemsValue,
      {
        ...initialPaymentLineItemValue,
        itemProjectNumber: isVariousProjectNumber ? '' : values.projectNumber,
      },
    ]);
  }, [isVariousProjectNumber, paymentLineItemsValue, setFieldValue, values.projectNumber]);

  const updatePaymentTotal = React.useCallback(
    ({
      lineItemRow,
      index,
    }: {
      lineItemRow: POPaymentLineItem;
      prefixLineItem: string;
      index: number;
      isEditQuantity: boolean;
    }) => {
      let updatedPaymentTotal = Number(values.paymentTotal || 0);
      const currentLineItemAmount = Number(lineItemRow.amount || 0);

      // calculate subtotal
      updatedPaymentTotal = paymentLineItemsValue.reduce((total, currentLineItem, currentIndex) => {
        if (index === currentIndex) return total + currentLineItemAmount;

        return total + currentLineItem.amount;
      }, 0);

      setFieldValue(PO_FORM_KEY.PAYMENT_TOTAL, updatedPaymentTotal);
    },
    [setFieldValue, paymentLineItemsValue, values]
  );

  const handleAmountChange = React.useCallback(
    ({
      name,
      value,
      lineItemRow,
      prefixLineItem,
      key,
      index,
      isEditQuantity,
    }: {
      name: string;
      value: any;
      lineItemRow: POPaymentLineItem;
      prefixLineItem: string;
      key: PO_PAYMENT_LINE_ITEM_KEY;
      index: number;
      isEditQuantity: boolean;
    }) => {
      checkRowStateAndSetValue<POPaymentLineItem>({
        name,
        value,
        index,
        records: paymentLineItemsValue,
        columnKeys: paymentLineItemsColumnNames,
        setFieldValue,
        onAddRow: addNewRow,
        onRemoveRow: removeRow,
        callback: () => {
          updatePaymentTotal({
            index,
            prefixLineItem,
            isEditQuantity,
            lineItemRow: {
              ...lineItemRow,
              [key]: value,
            },
          });
        },
      });
    },
    [paymentLineItemsValue, setFieldValue, addNewRow, removeRow, updatePaymentTotal]
  );

  const handleInputChange = ({ name, value, index }) => {
    checkRowStateAndSetValue<POPaymentLineItem>({
      name,
      value,
      index,
      records: paymentLineItemsValue,
      columnKeys: paymentLineItemsColumnNames,
      setFieldValue,
      onAddRow: addNewRow,
      onRemoveRow: removeRow,
    });
  };

  const lineItemRows: BodyBasicRows = paymentLineItemsValue.map((lineItemRow, index) => {
    const prefixLineItem = `${PO_FORM_KEY.PAYMENT_LINE_ITEMS}.${index}`;

    return {
      style: {
        verticalAlign: 'top',
      },
      columns: [
        {
          label: 'Line',
          content: `${index + 1}`,
          headerStyle: {
            paddingRight: 0,
            paddingLeft: '4px',
          },
          style: {
            paddingTop: '12px',
            paddingRight: 0,
          },
        },
        {
          type: CellType.INPUT,
          label: 'Project #',
          content: (
            <SearchProjectNumber
              fieldProps={{
                ...getFieldProps(
                  `${prefixLineItem}.${PO_PAYMENT_LINE_ITEM_KEY.ITEM_PROJECT_NUMBER}`
                ),
              }}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${PO_PAYMENT_LINE_ITEM_KEY.ITEM_PROJECT_NUMBER}`
              )}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              sx={{ width: 90 }}
              isClearable={false}
              disabled={disabled || !isVariousProjectNumber}
              onChange={(name, value) => {
                handleInputChange({
                  index,
                  name,
                  value,
                });
              }}
            />
          ),
          width: 90,
          headerStyle: {
            paddingRight: 0,
            paddingLeft: '6px',
          },
          style: {
            paddingRight: 0,
          },
        },
        {
          type: CellType.INPUT,
          label: 'Sub Project',
          content: (
            <Input
              {...getFieldProps(`${prefixLineItem}.${PO_PAYMENT_LINE_ITEM_KEY.SUB_PROJECT}`)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_PAYMENT_LINE_ITEM_KEY.SUB_PROJECT}`,
                  value: event.target.value,
                })
              }
              style={{ width: 60, padding: '6px' }}
              maxLength={5}
              disabled={disabled}
            />
          ),
          width: 60,
          headerStyle: {
            paddingRight: 0,
            paddingLeft: '6px',
          },
          style: {
            paddingRight: 0,
          },
        },
        {
          type: CellType.INPUT,
          label: 'Budget Category',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(`${prefixLineItem}.${PO_PAYMENT_LINE_ITEM_KEY.BUDGET_CATEGORY}`)}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${PO_PAYMENT_LINE_ITEM_KEY.BUDGET_CATEGORY}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_PAYMENT_LINE_ITEM_KEY.BUDGET_CATEGORY}`,
                  value: event.target.value,
                })
              }
              style={{ width: 60, padding: '6px' }}
              hideEllipsisTooltip
              maxLength={4}
              disabled={disabled}
              required
            />
          ),
          width: 60,
          headerStyle: {
            paddingRight: 0,
            paddingLeft: '6px',
          },
          style: {
            paddingRight: 0,
          },
        },
        {
          type: CellType.INPUT,
          label: 'Sub Budget Category',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(
                `${prefixLineItem}.${PO_PAYMENT_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_PAYMENT_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY}`,
                  value: event.target.value,
                })
              }
              style={{ width: 60, padding: '6px' }}
              hideEllipsisTooltip
              maxLength={3}
              disabled={disabled}
            />
          ),
          width: 60,
          headerStyle: {
            paddingRight: 0,
            paddingLeft: '4px',
          },
          style: {
            paddingRight: 0,
          },
        },
        {
          type: CellType.INPUT,
          label: 'Service Date',
          content: (
            <Box width={105}>
              <DatePicker
                {...getFieldProps(`${prefixLineItem}.${PO_PAYMENT_LINE_ITEM_KEY.SERVICE_DATE}`)}
                onChange={(name, value) =>
                  handleInputChange({
                    index,
                    name,
                    value,
                  })
                }
                dateFormat={'MM/dd/yyyy'}
                // todo: remove ternary condition
                selected={
                  getFieldProps(`${prefixLineItem}.${PO_PAYMENT_LINE_ITEM_KEY.SERVICE_DATE}`).value
                }
                disabled={disabled}
                placeholder=""
                hideIcon
              />
            </Box>
          ),
          width: 90,
          headerStyle: {
            paddingRight: 0,
            paddingLeft: '6px',
          },
          style: {
            paddingRight: 0,
          },
        },
        {
          type: CellType.CURRENCY_INPUT,
          label: 'Amount',
          content: (
            <EllipsisTooltipInputCurrency
              {...getFieldProps(`${prefixLineItem}.${PO_PAYMENT_LINE_ITEM_KEY.AMOUNT}`)}
              onChange={(name, value) =>
                handleAmountChange({
                  name,
                  value,
                  lineItemRow,
                  prefixLineItem,
                  index,
                  isEditQuantity: false,
                  key: PO_PAYMENT_LINE_ITEM_KEY.AMOUNT,
                })
              }
              textAlign="right"
              lengthShowTooltip={8}
              disabled={disabled}
              style={{ width: 115, padding: '6px' }}
            />
          ),
          width: 115,
          headerStyle: {
            paddingRight: 0,
            paddingLeft: '6px',
          },
          style: {
            paddingRight: 0,
          },
        },
      ],
    };
  });

  return (
    <Box>
      {/* Hidden input for scroll to error purpose */}
      <input name={PO_FORM_KEY.PAYMENT_LINE_ITEMS} hidden />
      <CustomTable.Basic bodyList={lineItemRows} />

      <Grid container mt={2}>
        <Grid item xs={8} className="justify-flex-start">
          <Typography variant="body2">
            (The payment will be for the Total amount shown here)
          </Typography>
        </Grid>
        <Grid item xs={1.5} className="justify-flex-start">
          <Typography variant="h6" fontWeight={'bold'}>
            TOTAL
          </Typography>
        </Grid>
        <Grid item xs={2.5}>
          <EllipsisTooltipInputCurrency
            {...getFieldProps(PO_FORM_KEY.PAYMENT_TOTAL)}
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
  disabled?: boolean;
  currentPOMode: PO_MODE;
};

export default React.memo(TablePaymentLineItems, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_FORM_KEY.PAYMENT_LINE_ITEMS,
    PO_FORM_KEY.PROJECT_NUMBER,
    PO_FORM_KEY.PAYMENT_TOTAL,
    PO_FORM_KEY.PAYMENT_TYPE,
  ];

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentPOMode === nextProps.currentPOMode &&
    isEqualPrevAndNextFormikValues<UpdatePOPaymentFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
