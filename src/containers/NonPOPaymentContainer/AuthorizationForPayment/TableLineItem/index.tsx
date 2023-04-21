import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, CellType } from 'src/components/CustomTable/types';
import {
  DatePicker,
  EllipsisTooltipInput,
  EllipsisTooltipInputCurrency,
  TextareaAutosize,
} from 'src/components/common';
import SearchProjectNumber from 'src/containers/shared/SearchProjectNumber';
import { AuthorizationProjectLineItem } from 'src/queries/NonPOPayment/AuthorizationForPayment/types';
import { checkRowStateAndSetValue, getErrorMessage } from 'src/utils';
import { AUTHORIZATION_FOR_PAYMENT_KEY, AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY } from '../enum';
import {
  authorizationProjectLineItemsColumnsName,
  initialAuthorizationPaymentProjectItem,
} from '../helpers/contants';
import { UpsertAuthorizationPaymentFormikProps } from '../types';

const TableLineItems: React.FC<Props> = ({ formikProps, disabled }) => {
  const { errors, values, touched, setFieldValue, getFieldProps, setFieldTouched } = formikProps;
  const authorizationPaymentLineItemKey = AUTHORIZATION_FOR_PAYMENT_KEY.PROJECT_LINE_ITEMS;

  const lineItemsValue = React.useMemo(() => {
    return values.projectLineItems || [];
  }, [values.projectLineItems]);

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const removeRow = React.useCallback(
    (index: number) => {
      setFieldValue(
        `${authorizationPaymentLineItemKey}`,
        lineItemsValue.filter((_row, idx) => idx !== index)
      );
    },
    [lineItemsValue, authorizationPaymentLineItemKey, setFieldValue]
  );

  const addNewRow = React.useCallback(() => {
    setFieldValue(`${authorizationPaymentLineItemKey}`, [
      ...lineItemsValue,
      {
        ...initialAuthorizationPaymentProjectItem,
      },
    ]);
  }, [lineItemsValue, authorizationPaymentLineItemKey, setFieldValue]);

  const handleInputChange = ({ name, value, index }) => {
    checkRowStateAndSetValue<AuthorizationProjectLineItem>({
      name,
      value,
      index,
      records: lineItemsValue,
      columnKeys: authorizationProjectLineItemsColumnsName,
      setFieldValue,
      onAddRow: addNewRow,
      onRemoveRow: removeRow,
    });
  };

  const updatePaymentAmountTotal = React.useCallback(
    ({ lineItemRow, index }: { lineItemRow: AuthorizationProjectLineItem; index: number }) => {
      let updatedAuthPaymentTotal = Number(values?.total || 0);
      const currentLineItemAmount = Number(lineItemRow.amount || 0);

      updatedAuthPaymentTotal = lineItemsValue.reduce((total, currentLineItem, currentIndex) => {
        if (index === currentIndex) return total + currentLineItemAmount;

        return total + currentLineItem.amount;
      }, 0);
      setFieldValue(`${AUTHORIZATION_FOR_PAYMENT_KEY.TOTAL}`, updatedAuthPaymentTotal);
    },

    [lineItemsValue, setFieldValue, values?.total]
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
      lineItemRow: AuthorizationProjectLineItem;
      key: AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY;
      index: number;
    }) => {
      checkRowStateAndSetValue<AuthorizationProjectLineItem>({
        name,
        value,
        index,
        records: lineItemsValue,
        columnKeys: authorizationProjectLineItemsColumnsName,
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
    [addNewRow, lineItemsValue, removeRow, setFieldValue, updatePaymentAmountTotal]
  );

  const lineItemRows: BodyBasicRows = lineItemsValue.map((lineItemRow, index) => {
    const prefixLineItem = `${authorizationPaymentLineItemKey}.${index}`;
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
            paddingLeft: '10px',
          },
          style: {
            paddingTop: '16px',
          },
        },
        {
          type: CellType.INPUT,
          label: 'Project # **',
          content: (
            <SearchProjectNumber
              fieldProps={{
                ...getFieldProps(
                  `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.PROJECT_NUMBER}`
                ),
              }}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.PROJECT_NUMBER}`
              )}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              sx={{ width: 120 }}
              disabled={disabled}
              onChange={(name, value) => {
                handleInputChange({
                  index,
                  name,
                  value,
                });
              }}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Sub Project',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(
                `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.SUB_PROJECT}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.SUB_PROJECT}`,
                  value: event.target.value,
                })
              }
              hideEllipsisTooltip
              maxLength={5}
              style={{ width: 100 }}
              disabled={disabled}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Budget Category *',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(
                `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.BUDGET_CATEGORY}`
              )}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.BUDGET_CATEGORY}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.BUDGET_CATEGORY}`,
                  value: event.target.value,
                })
              }
              hideEllipsisTooltip
              maxLength={4}
              style={{ width: 100 }}
              disabled={disabled}
              required
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Sub Budget Category',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(
                `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY}`,
                  value: event.target.value,
                })
              }
              hideEllipsisTooltip
              style={{ width: 100 }}
              maxLength={3}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Service Date',
          content: (
            <DatePicker
              placeholder=""
              dateFormat="MM/dd/yyyy"
              {...getFieldProps(
                `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.SERVICE_DATE}`
              )}
              selected={lineItemRow.serviceDate as Date}
              name={`${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.SERVICE_DATE}`}
              onBlur={setFieldTouched}
              onChange={(name, value) => {
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.SERVICE_DATE}`,
                  value: value,
                });
              }}
              disabled={disabled}
            />
          ),
          width: 150,
        },
        {
          type: CellType.INPUT,
          label: 'Description *',
          content: (
            <TextareaAutosize
              {...getFieldProps(
                `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.DESCRIPTION}`
              )}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.DESCRIPTION}`
              )}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                const nameDescription = `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.DESCRIPTION}`;
                const valueDescription = event.target.value;

                handleInputChange({
                  index,
                  name: nameDescription,
                  value: valueDescription,
                });
              }}
              required
              style={{
                paddingTop: '4px',
                paddingBottom: 0,
                width: 290,
              }}
              disabled={disabled}
              resize="none"
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Amount *',
          content: (
            <EllipsisTooltipInputCurrency
              {...getFieldProps(
                `${prefixLineItem}.${AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.AMOUNT}`
              )}
              onChange={(name, value) =>
                handleAmountChange({
                  name,
                  value,
                  lineItemRow,
                  index,
                  key: AUTHORIZATION_PMT_PROJECT_LINE_ITEM_KEY.AMOUNT,
                })
              }
              style={{
                width: 150,
              }}
              disabled={disabled}
            />
          ),
        },
      ],
    };
  });

  return (
    <Box>
      {/* Hidden input for scroll to error purpose */}
      <input name={authorizationPaymentLineItemKey} hidden />
      <CustomTable.Basic bodyList={lineItemRows} />
      <Grid container className="justify-flex-end" mt={2}>
        <Grid item xs={1.5}>
          <Typography variant="h6" fontWeight={'bold'}>
            TOTAL
          </Typography>
        </Grid>
        <Grid item>
          <EllipsisTooltipInputCurrency
            {...getFieldProps(`${AUTHORIZATION_FOR_PAYMENT_KEY.TOTAL}`)}
            errorMessage={_getErrorMessage(`${AUTHORIZATION_FOR_PAYMENT_KEY.TOTAL}`)}
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

export default TableLineItems;
