import { Box } from '@mui/material';
import { isNumber } from 'lodash';
import React from 'react';
import {
  EllipsisTooltipInput,
  EllipsisTooltipInputCurrency,
  TextareaAutosize,
} from 'src/components/common';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, CellType } from 'src/components/CustomTable/types';
import { POLineItemPayload } from 'src/queries/PurchaseOrders';
import { isEqualPrevAndNextFormikValues } from 'src/utils';
import { initialLineItemValue } from '../constants';
import { PO_FORM_KEY, PO_LINE_ITEM_KEY } from '../enums';
import { checkRowStateAndSetValue } from '../helpers';
import { UpsertPOFormikProps, UpsertPOFormValue } from '../types';

const TableLineItems: React.FC<Props> = ({ formikProps, disabled = false }) => {
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

  const updateExtItem = React.useCallback(
    ({
      lineItemRow,
      prefixLineItem,
      index,
    }: {
      lineItemRow: POLineItemPayload;
      prefixLineItem: string;
      index: number;
    }) => {
      let updatedSubtotal = values.subtotal;

      if (!lineItemRow?.quantity || !isNumber(lineItemRow?.unitPrice)) {
        updatedSubtotal = values.subtotal - (lineItemRow.ext || 0);

        setFieldValue(`${prefixLineItem}.${PO_LINE_ITEM_KEY.EXT}`, null);
        setFieldValue(PO_FORM_KEY.SUBTOTAL, updatedSubtotal);
        return;
      }

      const currentLineItemExt = Number(lineItemRow?.quantity) * Number(lineItemRow?.unitPrice);

      setFieldValue(`${prefixLineItem}.${PO_LINE_ITEM_KEY.EXT}`, currentLineItemExt);

      updatedSubtotal = lineItemsValue.reduce((total, currentLineItem, currentIndex) => {
        if (index === currentIndex) return total + currentLineItemExt;

        return total + currentLineItem.ext;
      }, 0);

      setFieldValue(PO_FORM_KEY.SUBTOTAL, updatedSubtotal);
    },
    [setFieldValue, lineItemsValue, values]
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
      checkRowStateAndSetValue<POLineItemPayload>({
        name,
        value,
        index,
        records: lineItemsValue,
        setFieldValue,
        onAddRow: addNewRow,
        onRemoveRow: removeRow,
        callback: () => {
          updateExtItem({
            index,
            prefixLineItem,
            lineItemRow: {
              ...lineItemRow,
              [key]: value,
            },
          });
        },
      });
    },
    [lineItemsValue, updateExtItem, addNewRow, removeRow, setFieldValue]
  );

  const handleInputChange = ({ name, value, index }) => {
    checkRowStateAndSetValue<POLineItemPayload>({
      name,
      value,
      index,
      records: lineItemsValue,
      setFieldValue,
      onAddRow: addNewRow,
      onRemoveRow: removeRow,
    });
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Quantity',
          content: (
            <EllipsisTooltipInput
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
              lengthShowTooltip={7}
              hideArrowTypeNumber
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
  disabled?: boolean;
};

export default React.memo(TableLineItems, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [PO_FORM_KEY.LINE_ITEMS];

  return isEqualPrevAndNextFormikValues<UpsertPOFormValue>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender,
  });
});
