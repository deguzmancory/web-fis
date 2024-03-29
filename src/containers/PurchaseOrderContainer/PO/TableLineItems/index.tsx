import { Box } from '@mui/material';
import { isNumber } from 'lodash';
import {
  EllipsisTooltipInput,
  EllipsisTooltipInputCurrency,
  TextareaAutosize,
} from 'src/components/common';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, CellType } from 'src/components/CustomTable/types';
import SearchProjectNumber from 'src/containers/shared/SearchProjectNumber';
import {
  checkRowStateAndSetValue,
  getErrorMessage,
  isEqualPrevAndNextFormikValues,
} from 'src/utils';
import { initialLineItemValue, lineItemsColumnNames } from '../helpers/constants';
import { PO_FORM_KEY, PO_LINE_ITEM_KEY } from '../enums';
import { isVariousProject } from '../GeneralInfo/helpers';
import { POLineItemFormValue, UpsertPOFormikProps, UpsertPOFormValue } from '../types';
import { isCUReviewMode, isFAReviewMode } from 'src/queries/PurchaseOrders/helpers';
import { PO_MODE } from 'src/queries';
import {
  UpdatePOPaymentFormValue,
  UpdatePOPaymentFormikProps,
} from 'src/containers/PurchaseOrderContainer/POPayment/types';
import { ChangeEvent, memo, useCallback, useMemo } from 'react';

const TableLineItems = <T extends UpsertPOFormikProps | UpdatePOPaymentFormikProps>({
  formikProps,
  disabled = false,
  currentPOMode,
}: Props<T>) => {
  const isInFAReviewMode = isFAReviewMode(currentPOMode);
  const isInCUReviewMode = isCUReviewMode(currentPOMode);
  const isReviewMode = isInFAReviewMode || isInCUReviewMode;

  const { values, errors, touched, setFieldValue, getFieldProps, setFieldTouched } = formikProps;

  const lineItemsValue = useMemo(() => {
    if (disabled) {
      return values.lineItems || [];
    }

    return values.lineItems || [];
  }, [disabled, values.lineItems]);

  const hideProjectNumberColumn = useMemo(
    () => !isVariousProject(values.projectNumber),
    [values.projectNumber]
  );

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const removeRow = useCallback(
    (index: number) => {
      setFieldValue(
        `${PO_FORM_KEY.LINE_ITEMS}`,
        lineItemsValue.filter((_row, idx) => idx !== index)
      );
    },
    [lineItemsValue, setFieldValue]
  );

  const addNewRow = useCallback(() => {
    setFieldValue(`${PO_FORM_KEY.LINE_ITEMS}`, [...lineItemsValue, initialLineItemValue]);
  }, [lineItemsValue, setFieldValue]);

  const updateExtItem = useCallback(
    ({
      lineItemRow,
      prefixLineItem,
      index,
      isEditQuantity,
    }: {
      lineItemRow: POLineItemFormValue;
      prefixLineItem: string;
      index: number;
      isEditQuantity: boolean;
    }) => {
      let updatedSubtotal = Number(values.subtotal || 0);

      // subtract from subtotal in case no unit price entered
      if (!isNumber(lineItemRow?.unitPrice)) {
        updatedSubtotal = Number(values.subtotal) - (lineItemRow.ext || 0);

        setFieldValue(`${prefixLineItem}.${PO_LINE_ITEM_KEY.EXT}`, 0);
        setFieldValue(PO_FORM_KEY.SUBTOTAL, updatedSubtotal);
        return;
      }

      // When input data on Unit price only, default value for Quantity = 1
      let defaultQuantity = 0;
      if (!lineItemRow?.quantity && !isEditQuantity) {
        defaultQuantity = 1;
        setFieldValue(`${prefixLineItem}.${PO_LINE_ITEM_KEY.QUANTITY}`, 1);
      }

      // calculate extension
      const currentLineItemExt =
        Number(lineItemRow?.quantity || defaultQuantity) * Number(lineItemRow?.unitPrice);

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

  const columnNamesByProjectNumber = useMemo(
    () =>
      hideProjectNumberColumn
        ? lineItemsColumnNames
        : [...lineItemsColumnNames, PO_LINE_ITEM_KEY.ITEM_PROJECT_NUMBER],
    [hideProjectNumberColumn]
  );

  const handleQuantityOrPriceChange = useCallback(
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
      lineItemRow: POLineItemFormValue;
      prefixLineItem: string;
      key: PO_LINE_ITEM_KEY;
      index: number;
      isEditQuantity: boolean;
    }) => {
      checkRowStateAndSetValue<POLineItemFormValue>({
        name,
        value,
        index,
        records: lineItemsValue,
        columnKeys: columnNamesByProjectNumber,
        setFieldValue,
        onAddRow: addNewRow,
        onRemoveRow: removeRow,
        callback: () => {
          updateExtItem({
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
    [lineItemsValue, columnNamesByProjectNumber, setFieldValue, addNewRow, removeRow, updateExtItem]
  );

  const handleInputChange = ({ name, value, index }) => {
    checkRowStateAndSetValue<POLineItemFormValue>({
      name,
      value,
      index,
      records: lineItemsValue,
      columnKeys: columnNamesByProjectNumber,
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
      errorMessage: _getErrorMessage(`${prefixLineItem}.${PO_LINE_ITEM_KEY.EXT}`),
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
            <SearchProjectNumber
              fieldProps={{
                ...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.ITEM_PROJECT_NUMBER}`),
              }}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${PO_LINE_ITEM_KEY.ITEM_PROJECT_NUMBER}`
              )}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              sx={{ width: 155 }}
              disabled={disabled || isInCUReviewMode}
              onChange={(name, value) => {
                handleInputChange({
                  index,
                  name,
                  value,
                });
              }}
            />
          ),
          width: 155,
          hide: hideProjectNumberColumn,
        },
        {
          type: CellType.INPUT,
          label: 'Sub Project',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.SUB_PROJECT}`)}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.SUB_PROJECT}`,
                  value: event.target.value,
                })
              }
              style={{ width: hideProjectNumberColumn ? 90 : 85 }}
              hideEllipsisTooltip
              maxLength={5}
              disabled={disabled || isInCUReviewMode}
            />
          ),
          width: hideProjectNumberColumn ? 90 : 85,
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
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.BUDGET_CATEGORY}`,
                  value: event.target.value,
                })
              }
              style={{ width: hideProjectNumberColumn ? 90 : 85 }}
              hideEllipsisTooltip
              maxLength={4}
              disabled={disabled || isInCUReviewMode}
              required
            />
          ),
          width: hideProjectNumberColumn ? 90 : 85,
        },
        {
          type: CellType.INPUT,
          label: 'Sub Budget Category',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY}`)}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY}`,
                  value: event.target.value,
                })
              }
              style={{ width: hideProjectNumberColumn ? 90 : 85 }}
              hideEllipsisTooltip
              maxLength={3}
              disabled={disabled || isInCUReviewMode}
            />
          ),
          width: hideProjectNumberColumn ? 90 : 85,
        },
        {
          type: CellType.INPUT,
          label: 'Description *',
          content: (
            <TextareaAutosize
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.DESCRIPTION}`)}
              errorMessage={_getErrorMessage(`${prefixLineItem}.${PO_LINE_ITEM_KEY.DESCRIPTION}`)}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.DESCRIPTION}`,
                  value: event.target.value,
                })
              }
              required
              style={{
                width: hideProjectNumberColumn ? 265 : 190,
                paddingTop: '4px',
                paddingBottom: 0,
              }}
              disabled={disabled || isInCUReviewMode}
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
                  isEditQuantity: true,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.QUANTITY}`,
                  value: e.target.value,
                  key: PO_LINE_ITEM_KEY.QUANTITY,
                });
              }}
              type="number"
              style={{ width: hideProjectNumberColumn ? 100 : 80 }}
              lengthShowTooltip={hideProjectNumberColumn ? 7 : 5}
              hideArrowTypeNumber
              disabled={disabled || isReviewMode}
            />
          ),
          width: hideProjectNumberColumn ? 100 : 80,
        },
        {
          type: CellType.INPUT,
          label: 'Unit',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.UNIT}`)}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.UNIT}`,
                  value: event.target.value,
                })
              }
              style={{ width: hideProjectNumberColumn ? 100 : 80 }}
              lengthShowTooltip={hideProjectNumberColumn ? 7 : 5}
              disabled={disabled || isReviewMode}
            />
          ),
          width: hideProjectNumberColumn ? 100 : 80,
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
                  isEditQuantity: false,
                  key: PO_LINE_ITEM_KEY.UNIT_PRICE,
                })
              }
              textAlign="right"
              lengthShowTooltip={hideProjectNumberColumn ? 14 : 11}
              disabled={disabled || isReviewMode}
              style={{ width: hideProjectNumberColumn ? 130 : 115 }}
            />
          ),
          width: hideProjectNumberColumn ? 130 : 115,
        },
        {
          type: CellType.CURRENCY_INPUT,
          label: 'Extension',
          content: (
            <EllipsisTooltipInputCurrency
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.EXT}`)}
              textAlign="right"
              disabled
              lengthShowTooltip={hideProjectNumberColumn ? 14 : 11}
              style={{ width: hideProjectNumberColumn ? 130 : 115 }}
            />
          ),
          width: hideProjectNumberColumn ? 130 : 115,
        },
      ],
    };
  });

  // currently can't using lineItems error because it return string or object => can't pass into jsx
  // defined table error manually
  const tableError =
    touched.lineItems && errors.lineItems && lineItemsValue.length === 1
      ? hideProjectNumberColumn
        ? 'Budget Category is required. Description is required.'
        : 'At least one Project # is Required'
      : '';

  return (
    <Box>
      {/* Hidden input for scroll to error purpose */}
      <input name={PO_FORM_KEY.LINE_ITEMS} hidden />
      <CustomTable.Basic bodyList={lineItemRows} errorMessage={tableError} />
    </Box>
  );
};

type Props<T extends UpsertPOFormikProps | UpdatePOPaymentFormikProps> = {
  formikProps: T extends UpsertPOFormikProps ? UpsertPOFormikProps : UpdatePOPaymentFormikProps;
  disabled?: boolean;
  currentPOMode: PO_MODE;
};

export default memo(TableLineItems, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [PO_FORM_KEY.LINE_ITEMS, PO_FORM_KEY.PROJECT_NUMBER];

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues<UpsertPOFormValue | UpdatePOPaymentFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
