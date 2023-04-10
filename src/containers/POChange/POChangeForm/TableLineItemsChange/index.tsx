import { Box } from '@mui/material';
import { isBoolean, isNumber } from 'lodash';
import React from 'react';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, CellType } from 'src/components/CustomTable/types';
import {
  EllipsisTooltipInput,
  EllipsisTooltipInputCurrency,
  TextareaAutosize,
} from 'src/components/common';
import { isVariousProject } from 'src/containers/PurchaseOrderContainer/GeneralInfo/helpers';
import { PO_FORM_KEY, PO_LINE_ITEM_KEY } from 'src/containers/PurchaseOrderContainer/enums';
import {
  initialLineItemPOChangeValue,
  lineItemsColumnNames,
} from 'src/containers/PurchaseOrderContainer/helpers';
import {
  POLineItemFormValue,
  UpsertPOFormValue,
  UpsertPOFormikProps,
} from 'src/containers/PurchaseOrderContainer/types';
import SearchProjectNumber from 'src/containers/shared/SearchProjectNumber';
import { PO_MODE } from 'src/queries';
import { isPOChangeDescriptionForm } from 'src/queries/POChange/helpers';
import {
  checkRowStateAndSetValue,
  getErrorMessage,
  isEqualPrevAndNextFormikValues,
} from 'src/utils';

const TableLineItemsPOChange: React.FC<Props> = ({
  formikProps,
  disabled = false,
  allowUpdateInfoAndAmount,
  allowUpdateDescription,
  filterOriginItemValue,
}) => {
  const { values, errors, touched, setFieldValue, getFieldProps, setFieldTouched } = formikProps;

  const lineItemsValue = React.useMemo(() => {
    if (isBoolean(filterOriginItemValue)) {
      return values.lineItems.filter((lineItem) => lineItem.isOriginal === filterOriginItemValue);
    }

    return values.lineItems;
  }, [values.lineItems, filterOriginItemValue]);

  const isInPOChangeDescriptionForm = isPOChangeDescriptionForm(values?.formNumber);

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
    setFieldValue(`${PO_FORM_KEY.LINE_ITEMS}`, [...lineItemsValue, initialLineItemPOChangeValue]);
  }, [lineItemsValue, setFieldValue]);

  const updateExtItem = React.useCallback(
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

  const columnNamesByProjectNumber = React.useMemo(
    () =>
      hideProjectNumberColumn
        ? lineItemsColumnNames
        : [...lineItemsColumnNames, PO_LINE_ITEM_KEY.ITEM_PROJECT_NUMBER],
    [hideProjectNumberColumn]
  );

  const handleQuantityOrPriceChange = React.useCallback(
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
              disabled={disabled || !allowUpdateInfoAndAmount}
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.SUB_PROJECT}`,
                  value: event.target.value,
                })
              }
              style={{ width: hideProjectNumberColumn ? 90 : 85 }}
              hideEllipsisTooltip
              maxLength={5}
              disabled={disabled || !allowUpdateInfoAndAmount}
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.BUDGET_CATEGORY}`,
                  value: event.target.value,
                })
              }
              style={{ width: hideProjectNumberColumn ? 90 : 85 }}
              hideEllipsisTooltip
              maxLength={4}
              disabled={disabled || !allowUpdateInfoAndAmount}
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY}`,
                  value: event.target.value,
                })
              }
              style={{ width: hideProjectNumberColumn ? 90 : 85 }}
              hideEllipsisTooltip
              maxLength={3}
              disabled={disabled || !allowUpdateInfoAndAmount}
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
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                const nameDescription = `${prefixLineItem}.${PO_LINE_ITEM_KEY.DESCRIPTION}`;
                const valueDescription = event.target.value;
                if (isInPOChangeDescriptionForm) {
                  setFieldValue(nameDescription, valueDescription);
                  return;
                }
                handleInputChange({
                  index,
                  name: nameDescription,
                  value: valueDescription,
                });
              }}
              required
              style={{
                width: hideProjectNumberColumn ? 265 : 190,
                paddingTop: '4px',
                paddingBottom: 0,
              }}
              disabled={disabled || !allowUpdateDescription}
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
              disabled={disabled || !allowUpdateInfoAndAmount}
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.UNIT}`,
                  value: event.target.value,
                })
              }
              style={{ width: hideProjectNumberColumn ? 100 : 80 }}
              lengthShowTooltip={hideProjectNumberColumn ? 7 : 5}
              disabled={disabled || !allowUpdateInfoAndAmount}
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
              disabled={disabled || !allowUpdateInfoAndAmount}
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

type Props = {
  formikProps: UpsertPOFormikProps;
  disabled?: boolean;
  currentPOMode: PO_MODE;
  filterOriginItemValue?: boolean;
  allowUpdateInfoAndAmount: boolean;
  allowUpdateDescription: boolean;
};

export default React.memo(TableLineItemsPOChange, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [PO_FORM_KEY.LINE_ITEMS, PO_FORM_KEY.PROJECT_NUMBER];

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentPOMode === nextProps.currentPOMode &&
    prevProps.allowUpdateInfoAndAmount === nextProps.allowUpdateInfoAndAmount &&
    prevProps.allowUpdateDescription === nextProps.allowUpdateDescription &&
    isEqualPrevAndNextFormikValues<UpsertPOFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
