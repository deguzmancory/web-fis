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
import {
  checkRowStateAndSetValue,
  getErrorMessage,
  isEqualPrevAndNextFormikValues,
} from 'src/utils';
import { initialLineItemValue } from '../constants';
import { PO_FORM_KEY, PO_LINE_ITEM_KEY, PO_MODE } from '../enums';
import { isVariousProject } from '../GeneralInfo/helpers';
import { isCUReviewPOMode, isFAReviewPOMode } from '../helpers';
import { UpsertPOFormikProps, UpsertPOFormValue } from '../types';

const TableLineItems: React.FC<Props> = ({ formikProps, disabled = false, currentPOMode }) => {
  const isFAReviewMode = isFAReviewPOMode(currentPOMode);
  const isCUReviewMode = isCUReviewPOMode(currentPOMode);
  const isReviewMode = isFAReviewMode || isCUReviewMode;

  const { values, errors, touched, setFieldValue, getFieldProps } = formikProps;

  const lineItemsValue = React.useMemo(() => values.lineItems, [values.lineItems]);
  const hideProjectNumberColumn = React.useMemo(
    () => !isVariousProject(values.projectNumber),
    [values.projectNumber]
  );

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

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

      // subtract from subtotal in case no unit price entered
      if (!isNumber(lineItemRow?.unitPrice)) {
        updatedSubtotal = values.subtotal - (lineItemRow.ext || 0);

        setFieldValue(`${prefixLineItem}.${PO_LINE_ITEM_KEY.EXT}`, 0);
        setFieldValue(PO_FORM_KEY.SUBTOTAL, updatedSubtotal);
        return;
      }

      // When input data on Unit price only, default value for Quantity = 1
      if (!lineItemRow?.quantity) {
        setFieldValue(`${prefixLineItem}.${PO_LINE_ITEM_KEY.QUANTITY}`, 1);
      }

      // calculate extension
      const currentLineItemExt =
        Number(lineItemRow?.quantity || 1) * Number(lineItemRow?.unitPrice);

      setFieldValue(`${prefixLineItem}.${PO_LINE_ITEM_KEY.EXT}`, currentLineItemExt);

      // calculate subtotal
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
      errorMessage: '',
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
          label: 'Project # *',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.ITEM_PROJECT_NUMBER}`)}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${PO_LINE_ITEM_KEY.ITEM_PROJECT_NUMBER}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.ITEM_PROJECT_NUMBER}`,
                  value: event.target.value,
                })
              }
              style={{ width: 90 }}
              lengthShowTooltip={8}
              disabled={disabled || isCUReviewMode}
              required
            />
          ),
          width: 90,
          hide: hideProjectNumberColumn,
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
              style={{ width: hideProjectNumberColumn ? 90 : 75 }}
              hideEllipsisTooltip
              maxLength={5}
              disabled={disabled || isCUReviewMode}
            />
          ),
          width: hideProjectNumberColumn ? 90 : 75,
        },
        {
          type: CellType.INPUT,
          label: 'Budget Category *',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.BUDGET_CATEGORY}`)}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${PO_LINE_ITEM_KEY.BUDGET_CATEGORY}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.BUDGET_CATEGORY}`,
                  value: event.target.value,
                })
              }
              style={{ width: hideProjectNumberColumn ? 90 : 75 }}
              hideEllipsisTooltip
              maxLength={4}
              disabled={disabled || isCUReviewMode}
              required
            />
          ),
          width: hideProjectNumberColumn ? 90 : 75,
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
              style={{ width: hideProjectNumberColumn ? 90 : 75 }}
              hideEllipsisTooltip
              maxLength={3}
              disabled={disabled || isCUReviewMode}
            />
          ),
          width: hideProjectNumberColumn ? 90 : 75,
        },
        {
          type: CellType.INPUT,
          label: 'Description *',
          content: (
            <TextareaAutosize
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.DESCRIPTION}`)}
              errorMessage={_getErrorMessage(`${prefixLineItem}.${PO_LINE_ITEM_KEY.DESCRIPTION}`)}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.DESCRIPTION}`,
                  value: event.target.value,
                })
              }
              required
              style={{ width: hideProjectNumberColumn ? 240 : 200, paddingTop: '4px' }}
              disabled={disabled || isCUReviewMode}
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
              disabled={disabled || isReviewMode}
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
              disabled={disabled || isReviewMode}
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
              disabled={disabled || isReviewMode}
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

  const tableError =
    touched.lineItems && lineItemsValue.length === 1
      ? hideProjectNumberColumn
        ? 'Budget Category is required. Description is required.'
        : 'At least one Project # is Required'
      : '';

  return (
    <Box>
      <CustomTable.Basic bodyList={lineItemRows} errorMessage={tableError} />
    </Box>
  );
};

type Props = {
  formikProps: UpsertPOFormikProps;
  disabled?: boolean;
  currentPOMode: PO_MODE;
};

export default React.memo(TableLineItems, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [PO_FORM_KEY.LINE_ITEMS, PO_FORM_KEY.PROJECT_NUMBER];

  return isEqualPrevAndNextFormikValues<UpsertPOFormValue>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender,
  });
});
