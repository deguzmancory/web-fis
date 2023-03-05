import { Box } from '@mui/material';
import { get } from 'lodash';
import React from 'react';
import { COMMON_STYLE } from 'src/appConfig/constants';
import {
  EllipsisTooltipInput,
  EllipsisTooltipInputCurrency,
  TextArea,
} from 'src/components/common';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, CellType } from 'src/components/CustomTable/types';
import { POLineItemPayload } from 'src/queries/PurchaseOrders';
import { formatMoney, getUncontrolledCurrencyInputFieldProps } from 'src/utils';
import { initialLineItemValue } from '../constants';
import { PO_FORM_KEY, PO_LINE_ITEM_KEY } from '../enums';
import { UpsertPOFormikProps } from '../types';

const TableLineItems: React.FC<Props> = ({ formikProps, disabled }) => {
  const { values, setFieldTouched, setFieldValue, getFieldProps } = formikProps;

  const lineItemsValue = React.useMemo(() => values.lineItems, [values.lineItems]);

  const getAutoGenerateUncontrolledFieldProps = getUncontrolledCurrencyInputFieldProps({
    values,
    setFieldTouched,
    setFieldValue,
  });

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

  // custom onBlur handler for uncontrolled input
  const handleAutoGenerateOnBlur = React.useCallback(
    ({ name, value, index }) => {
      setFieldValue(name, value);
      setFieldTouched(name, value);

      const currentRow = get(lineItemsValue, index);
      if (!value && !Object.values(currentRow).some((value) => value)) {
        if (index === lineItemsValue.length - 1) return;

        removeRow(index);
        return;
      }

      const rowAbove = get(lineItemsValue, `${index + 1}`);
      if (!rowAbove) {
        addNewRow();
        return;
      }
    },
    [addNewRow, lineItemsValue, removeRow, setFieldTouched, setFieldValue]
  );

  const updateExtData = React.useCallback(
    ({
      lineItemRow,
      prefixLineItem,
    }: {
      lineItemRow: POLineItemPayload;
      prefixLineItem: string;
    }) => {
      setFieldValue(
        `${prefixLineItem}.${PO_LINE_ITEM_KEY.EXT}`,
        formatMoney(Number(lineItemRow?.quantity) * Number(lineItemRow?.unitPrice))
      );
    },
    [setFieldValue]
  );

  const handleUnitPriceChange = React.useCallback(
    ({
      name,
      value,
      lineItemRow,
      prefixLineItem,
      key,
      index,
    }: {
      name;
      value;
      lineItemRow: POLineItemPayload;
      prefixLineItem: string;
      key: PO_LINE_ITEM_KEY;
      index: number;
    }) => {
      setFieldValue(name, value);
      updateExtData({
        prefixLineItem,
        lineItemRow: {
          ...lineItemRow,
          [key]: value,
        },
      });
    },
    [setFieldValue, updateExtData]
  );

  const lineItemRows: BodyBasicRows = lineItemsValue.map((lineItemRow, index) => {
    const prefixLineItem = `${PO_FORM_KEY.LINE_ITEMS}.${index}`;

    return {
      style: {
        verticalAlign: 'initial',
      },
      columns: [
        {
          label: 'Line',
          content: `${index + 1}`,
          headerStyle: {
            paddingRight: 0,
            paddingLeft: '10px',
          },
        },
        {
          type: CellType.INPUT,
          label: 'Sub Project',
          content: (
            <EllipsisTooltipInput
              {...getAutoGenerateUncontrolledFieldProps(
                `${prefixLineItem}.${PO_LINE_ITEM_KEY.SUB_PROJECT}`,
                {
                  onBlur: (name, value) => handleAutoGenerateOnBlur({ name, value, index }),
                }
              )}
              style={{ width: 100 }}
              lengthShowTooltip={9}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Budget Category *',
          content: (
            <EllipsisTooltipInput
              {...getAutoGenerateUncontrolledFieldProps(
                `${prefixLineItem}.${PO_LINE_ITEM_KEY.BUDGET_CATEGORY}`,
                {
                  onBlur: (name, value) => handleAutoGenerateOnBlur({ name, value, index }),
                }
              )}
              style={{ width: 100 }}
              lengthShowTooltip={9}
              errorMessage={'Required'} //todo: implement validation
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Sub Budget Category',
          content: (
            <EllipsisTooltipInput
              {...getAutoGenerateUncontrolledFieldProps(
                `${prefixLineItem}.${PO_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY}`,
                {
                  onBlur: (name, value) => handleAutoGenerateOnBlur({ name, value, index }),
                }
              )}
              style={{ width: 100 }}
              lengthShowTooltip={9}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Description *',
          content: (
            <TextArea
              {...getAutoGenerateUncontrolledFieldProps(
                `${prefixLineItem}.${PO_LINE_ITEM_KEY.DESCRIPTION}`,
                {
                  onBlur: (name, value) => handleAutoGenerateOnBlur({ name, value, index }),
                }
              )}
              style={{ width: 205, height: COMMON_STYLE.SMALL_INPUT_HEIGHT, paddingTop: '4px' }}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Quantity',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.QUANTITY}`)}
              onChange={(e: any) =>
                handleUnitPriceChange({
                  lineItemRow,
                  prefixLineItem,
                  index,
                  name: `${prefixLineItem}.${PO_LINE_ITEM_KEY.QUANTITY}`,
                  value: e.target.value,
                  key: PO_LINE_ITEM_KEY.QUANTITY,
                })
              }
              type="number"
              style={{ width: 80 }}
              lengthShowTooltip={7}
              hideArrowTypeNumber
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Unit',
          content: (
            <EllipsisTooltipInput
              {...getAutoGenerateUncontrolledFieldProps(
                `${prefixLineItem}.${PO_LINE_ITEM_KEY.UNIT}`,
                {
                  onBlur: (name, value) => handleAutoGenerateOnBlur({ name, value, index }),
                }
              )}
              style={{ width: 80 }}
              lengthShowTooltip={7}
            />
          ),
        },
        {
          type: CellType.CURRENCY_INPUT,
          label: 'Unit Price',
          content: (
            <EllipsisTooltipInputCurrency
              {...getFieldProps(`${prefixLineItem}.${PO_LINE_ITEM_KEY.UNIT_PRICE}`)}
              onChange={(name, value) =>
                handleUnitPriceChange({
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
      <CustomTable.Basic bodyList={lineItemRows} errorMessage={'At least one record'} />
    </Box>
  );
};

type Props = {
  formikProps: UpsertPOFormikProps;
  disabled: boolean;
};

export default React.memo(TableLineItems);
