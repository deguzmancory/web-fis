import { Box } from '@mui/material';
import { get, isNumber } from 'lodash';
import React from 'react';
import {
  EllipsisTooltipInput,
  EllipsisTooltipInputCurrency,
  Input,
  TextareaAutosize,
} from 'src/components/common';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, CellType } from 'src/components/CustomTable/types';
import { POLineItemPayload } from 'src/queries/PurchaseOrders';
import { Callback } from 'src/redux/types';
import { formatMoney, isEqualPrevAndNextObjByPath } from 'src/utils';
import { initialLineItemValue } from '../constants';
import { PO_FORM_KEY, PO_LINE_ITEM_KEY } from '../enums';
import { UpsertPOFormikProps } from '../types';

const TableLineItems: React.FC<Props> = ({ formikProps, disabled }) => {
  const { values, setFieldValue, getFieldProps } = formikProps;

  const lineItemsValue = React.useMemo(() => values.lineItems, [values.lineItems]);

  const removeRow = React.useCallback(
    (index: number) => {
      setFieldValue(
        `${PO_FORM_KEY.LINE_ITEMS}`,
        lineItemsValue.filter((_row, idx) => idx !== index)
      );
    },
    [lineItemsValue, setFieldValue]
  );

  const addNewRow = React.useCallback(() => {
    setFieldValue(`${PO_FORM_KEY.LINE_ITEMS}`, [...lineItemsValue, initialLineItemValue]);
  }, [lineItemsValue, setFieldValue]);

  const updateExtData = React.useCallback(
    ({
      lineItemRow,
      prefixLineItem,
    }: {
      lineItemRow: POLineItemPayload;
      prefixLineItem: string;
    }) => {
      if (!lineItemRow?.quantity || !isNumber(lineItemRow?.unitPrice)) {
        setFieldValue(`${prefixLineItem}.${PO_LINE_ITEM_KEY.EXT}`, null);
        return;
      }

      setFieldValue(
        `${prefixLineItem}.${PO_LINE_ITEM_KEY.EXT}`,
        formatMoney(Number(lineItemRow?.quantity) * Number(lineItemRow?.unitPrice))
      );
    },
    [setFieldValue]
  );

  const checkRowStateAndSetValue = React.useCallback(
    ({
      value,
      name,
      index,
      callback,
    }: {
      name: string;
      value: any;
      index: number;
      callback?: Callback;
    }) => {
      const currentRow = get(lineItemsValue, index);

      // if !value and other cell of current row do not have value => remove row
      if (
        !value &&
        !Object.entries(currentRow).some(([key, value]) => {
          // exclude the current field cause "currentRow" references to the previous data now
          if (name.includes(key)) return false;
          return !!value;
        })
      ) {
        // not remove the last field
        if (index === lineItemsValue.length - 1) return;

        removeRow(index);
      }
      // add new row if the current row is the last row
      else {
        const rowAbove = get(lineItemsValue, `${index + 1}`);
        if (!rowAbove) {
          addNewRow();
        }

        setFieldValue(name, value);

        if (callback) {
          callback();
        }
      }
    },
    [addNewRow, lineItemsValue, removeRow, setFieldValue]
  );

  const handleQuantityOrPriceChange = React.useCallback(
    ({
      name,
      value,
      lineItemRow,
      prefixLineItem,
      key,
      index,
    }: {
      name: string;
      value: any;
      lineItemRow: POLineItemPayload;
      prefixLineItem: string;
      key: PO_LINE_ITEM_KEY;
      index: number;
    }) => {
      checkRowStateAndSetValue({
        name,
        value,
        index,
        callback: () => {
          updateExtData({
            prefixLineItem,
            lineItemRow: {
              ...lineItemRow,
              [key]: value,
            },
          });
        },
      });
    },
    [checkRowStateAndSetValue, updateExtData]
  );

  const handleInputChange = ({ name, value, index }) => {
    checkRowStateAndSetValue({ name, value, index });
  };

  const lineItemRows: BodyBasicRows = lineItemsValue.map((lineItemRow, index) => {
    const prefixLineItem = `${PO_FORM_KEY.LINE_ITEMS}.${index}`;

    return {
      style: {
        verticalAlign: 'top',
      },
      // errorMessage: index === 1 ? 'Extension must be less than $100,000,000.00.' : '', //TODO: add validation for row
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
          label: 'Sub Project',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.SUB_PROJECT}`)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.SUB_PROJECT}`,
                  value: event.target.value,
                })
              }
              style={{ width: 90 }}
              lengthShowTooltip={8}
              maxLength={5}
            />
          ),
          width: 90,
        },
        {
          type: CellType.INPUT,
          label: 'Budget Category *',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.BUDGET_CATEGORY}`)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.BUDGET_CATEGORY}`,
                  value: event.target.value,
                })
              }
              style={{ width: 90 }}
              lengthShowTooltip={8}
              maxLength={4}
              // errorMessage={'Required'} //TODO: add validation for cell
            />
          ),
          width: 90,
        },
        {
          type: CellType.INPUT,
          label: 'Sub Budget Category',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY}`)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY}`,
                  value: event.target.value,
                })
              }
              style={{ width: 100 }}
              lengthShowTooltip={8}
              maxLength={3}
            />
          ),
          width: 100,
        },
        {
          type: CellType.INPUT,
          label: 'Description *',
          content: (
            <TextareaAutosize
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.DESCRIPTION}`)}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.DESCRIPTION}`,
                  value: event.target.value,
                })
              }
              style={{ width: 240, paddingTop: '4px' }}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Quantity',
          content: (
            <Input
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.QUANTITY}`)}
              onChange={(e: any) => {
                handleQuantityOrPriceChange({
                  lineItemRow,
                  prefixLineItem,
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.QUANTITY}`,
                  value: e.target.value,
                  key: PO_LINE_ITEM_KEY.QUANTITY,
                });
              }}
              type="number"
              style={{ width: 80 }}
              // lengthShowTooltip={7}
              hideArrowTypeNumber
            />
          ),
          width: 80,
        },
        {
          type: CellType.INPUT,
          label: 'Unit',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.UNIT}`)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.UNIT}`,
                  value: event.target.value,
                })
              }
              style={{ width: 80 }}
              lengthShowTooltip={7}
            />
          ),
          width: 80,
        },
        {
          type: CellType.CURRENCY_INPUT,
          label: 'Unit Price',
          content: (
            <EllipsisTooltipInputCurrency
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.UNIT_PRICE}`)}
              onChange={(name, value) =>
                handleQuantityOrPriceChange({
                  name,
                  value,
                  lineItemRow,
                  prefixLineItem,
                  index,
                  key: PO_LINE_ITEM_KEY.UNIT_PRICE,
                })
              }
              textAlign="right"
              lengthShowTooltip={14}
            />
          ),
        },
        {
          type: CellType.CURRENCY_INPUT,
          label: 'Extension',
          content: (
            <EllipsisTooltipInputCurrency
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.EXT}`)}
              textAlign="right"
              disabled
              lengthShowTooltip={14}
            />
          ),
        },
      ],
    };
  });

  return (
    <Box>
      {/* //todo: implement validation */}
      <CustomTable.Basic
        bodyList={lineItemRows}
        // errorMessage={'At least one record'} //TODO: add validation for table
      />
    </Box>
  );
};

type Props = {
  formikProps: UpsertPOFormikProps;
  disabled: boolean;
};

export default React.memo(TableLineItems, (prevProps, nextProps) => {
  const prevFormikValues = prevProps.formikProps.values;
  const nextFormikValues = nextProps.formikProps.values;

  return isEqualPrevAndNextObjByPath({
    prevValues: prevFormikValues,
    nextValues: nextFormikValues,
    path: PO_FORM_KEY.LINE_ITEMS,
  });
});
