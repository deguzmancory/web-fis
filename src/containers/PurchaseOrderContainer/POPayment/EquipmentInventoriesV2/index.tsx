import { Box, Typography } from '@mui/material';
import { memo, useMemo, useCallback } from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import CustomTable from 'src/components/CustomTable';
import { BodyRow, BodyRows } from 'src/components/CustomTable/types';
import {
  Accordion,
  Checkbox,
  DatePicker,
  Element,
  Input,
  RadioButton,
  Select,
  TextareaAutosize,
} from 'src/components/common';
import { InputPhoneWithoutFlags } from 'src/components/common/InputPhone';
import {
  UpdatePOPaymentFormValue,
  UpdatePOPaymentFormikProps,
} from 'src/containers/PurchaseOrderContainer/POPayment/types';
import { PO_FORM_KEY } from 'src/containers/PurchaseOrderContainer/PO/enums';
import { PO_MODE } from 'src/queries';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY } from '../enums';
import {
  getInitialPaymentEquipmentInventories,
  getNumberOfTableEquipmentInventories,
  isNotEmptyPaymentEquipmentInventory,
} from '../helpers';
import {
  DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS,
  numberOfItemsOptions,
  ownershipOptions,
} from './helpers';
import {
  UpsertAuthorizationFormValue,
  UpsertAuthorizationPaymentFormikProps,
} from 'src/containers/NonPOPaymentContainer/AuthorizationForPayment/types';
import { AUTHORIZATION_FOR_PAYMENT_KEY } from 'src/containers/NonPOPaymentContainer/AuthorizationForPayment/enum';
import { isNumber } from 'lodash';

const getHeaderRow = (tableIndex: number): BodyRow => {
  const tableStartOrder = tableIndex * DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS + 1;

  return {
    isHeaderRow: true,
    style: {
      verticalAlign: 'top',
    },
    columns: [
      {
        content: '',
        style: {
          padding: '4px',
        },
      },
      {
        content: `Item #${tableStartOrder}`,
        style: {
          padding: '4px',
        },
      },
      {
        content: `Item #${tableStartOrder + 1}`,
        style: {
          padding: '4px',
        },
      },
      {
        content: `Item #${tableStartOrder + 2}`,
        style: {
          padding: '4px',
        },
      },
      {
        content: `Item #${tableStartOrder + 3}`,
        style: {
          padding: '4px',
        },
      },
      {
        content: `Item #${tableStartOrder + 4}`,
        style: {
          padding: '4px',
        },
      },
    ],
  };
};

const labelStyle = {
  padding: '8px',
  minWidth: '130px',
  maxWidth: '130px',
  borderLeft: COLOR_CODE.DEFAULT_BORDER,
};

const getContentStyle = (isLastColumn: boolean) => ({
  padding: '8px 2px',
  minWidth: '160px',
  maxWidth: '160px',
  borderRight: isLastColumn ? COLOR_CODE.DEFAULT_BORDER : 'none',
});

const isUpsertAuthorizationPaymentFormValue = (
  formValues,
  authorizationPaymentPrefix: string
): formValues is UpsertAuthorizationFormValue => {
  return authorizationPaymentPrefix === AUTHORIZATION_FOR_PAYMENT_KEY.EQUIPMENT_INVENTORIES;
};

const EquipmentInventories = <
  T extends UpdatePOPaymentFormikProps | UpsertAuthorizationPaymentFormikProps
>({
  formikProps,
  authorizationPaymentPrefix,
  disabled = false,
}: Props<T>) => {
  const { values, errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } =
    formikProps;

  const equipmentInventoriesValue = useMemo(() => {
    if (isUpsertAuthorizationPaymentFormValue(values, authorizationPaymentPrefix)) {
      return values.equipmentInventories || [];
    }
    return values.paymentEquipmentInventories || [];
  }, [authorizationPaymentPrefix, values]);

  const getPrefixName = useCallback(
    (startIndexOfSliceInventories, index) => {
      if (isUpsertAuthorizationPaymentFormValue(values, authorizationPaymentPrefix)) {
        return `${AUTHORIZATION_FOR_PAYMENT_KEY.EQUIPMENT_INVENTORIES}.${
          startIndexOfSliceInventories + index
        }`;
      } else {
        return `${PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORIES}.${
          startIndexOfSliceInventories + index
        }`;
      }
    },
    [authorizationPaymentPrefix, values]
  );

  const isExpanded = equipmentInventoriesValue.some((inventory) =>
    isNotEmptyPaymentEquipmentInventory(inventory)
  );

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const getEquipmentInventoryItems = (tableIndex: number): BodyRows => {
    const startIndexOfSliceInventories = tableIndex * DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS;
    const endIndexOfSliceInventories = (tableIndex + 1) * DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS;

    return [
      {
        style: {
          verticalAlign: 'top',
        },
        columns: [
          {
            content: (
              <Typography variant="body2" px={2} p={0}>
                <b>1. DESCRIPTION</b> - Use generic names; (e.g. 3COM CELLPLEX = Interface card)
              </Typography>
            ),
            style: labelStyle,
          },
          ...equipmentInventoriesValue
            .slice(startIndexOfSliceInventories, endIndexOfSliceInventories)
            .map((_inventory, index) => {
              const prefixInventory = getPrefixName(startIndexOfSliceInventories, index);

              return {
                content: (
                  <TextareaAutosize
                    {...getUncontrolledFieldProps(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.DESCRIPTION}`
                    )}
                    disabled={disabled}
                    errorMessage={_getErrorMessage(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.DESCRIPTION}`
                    )}
                    minRows={3}
                  />
                ),
                style: getContentStyle(index === DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS - 1),
              };
            }),
        ],
      },
      {
        style: {
          verticalAlign: 'top',
        },
        columns: [
          {
            content: (
              <Typography variant="body2" px={2} p={0}>
                <b>2. BRAND NAME & MODEL NUMBER </b> - If none, state NONE
              </Typography>
            ),
            style: labelStyle,
          },
          ...equipmentInventoriesValue
            .slice(startIndexOfSliceInventories, endIndexOfSliceInventories)
            .map((_inventory, index) => {
              const prefixInventory = getPrefixName(startIndexOfSliceInventories, index);

              return {
                content: (
                  <TextareaAutosize
                    {...getUncontrolledFieldProps(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.BRAND_NAME}`
                    )}
                    disabled={disabled}
                    errorMessage={_getErrorMessage(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.BRAND_NAME}`
                    )}
                    minRows={2}
                  />
                ),
                style: getContentStyle(index === DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS - 1),
              };
            }),
        ],
      },
      {
        style: {
          verticalAlign: 'top',
        },
        columns: [
          {
            content: (
              <Typography variant="body2" px={2} p={0}>
                <b>3. SERIAL NUMBER</b> - If none, state NONE
              </Typography>
            ),
            style: labelStyle,
          },
          ...equipmentInventoriesValue
            .slice(startIndexOfSliceInventories, endIndexOfSliceInventories)
            .map((_inventory, index) => {
              const prefixInventory = getPrefixName(startIndexOfSliceInventories, index);

              return {
                content: (
                  <TextareaAutosize
                    {...getUncontrolledFieldProps(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.SERIAL_NUMBER}`
                    )}
                    disabled={disabled}
                    errorMessage={_getErrorMessage(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.SERIAL_NUMBER}`
                    )}
                    minRows={2}
                  />
                ),
                style: getContentStyle(index === DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS - 1),
              };
            }),
        ],
      },
      {
        style: {
          verticalAlign: 'top',
        },
        columns: [
          {
            content: (
              <Typography variant="body2" px={2} p={0}>
                <b>4. COST OF ITEM</b>
              </Typography>
            ),
            style: labelStyle,
          },
          ...equipmentInventoriesValue
            .slice(startIndexOfSliceInventories, endIndexOfSliceInventories)
            .map((inventory, index) => {
              const prefixInventory = getPrefixName(startIndexOfSliceInventories, index);

              return {
                content: (
                  <Input
                    type="number"
                    hideArrowTypeNumber
                    {...getUncontrolledFieldProps(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.ITEM_COST}`
                    )}
                    disabled={disabled}
                    errorMessage={_getErrorMessage(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.ITEM_COST}`
                    )}
                    value={isNumber(inventory?.itemCost) ? inventory.itemCost : ''}
                  />
                ),
                style: getContentStyle(index === DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS - 1),
              };
            }),
        ],
      },
      {
        style: {
          verticalAlign: 'top',
        },
        columns: [
          {
            content: (
              <Typography variant="body2" px={2} p={0}>
                <b>5. BUILDING NAME AND ROOM NO.</b> (Location of equipment)
              </Typography>
            ),
            style: labelStyle,
          },
          ...equipmentInventoriesValue
            .slice(startIndexOfSliceInventories, endIndexOfSliceInventories)
            .map((_inventory, index) => {
              const prefixInventory = getPrefixName(startIndexOfSliceInventories, index);

              return {
                content: (
                  <TextareaAutosize
                    {...getUncontrolledFieldProps(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.LOCATION_OF_EQUIPMENT}`
                    )}
                    minRows={2}
                    disabled={disabled}
                    errorMessage={_getErrorMessage(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.LOCATION_OF_EQUIPMENT}`
                    )}
                  />
                ),
                style: getContentStyle(index === DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS - 1),
              };
            }),
        ],
      },
      {
        style: {
          verticalAlign: 'top',
        },
        columns: [
          {
            content: (
              <Typography variant="body2" px={2} p={0}>
                <b>6. TITLE/OWNERSHIP</b>
              </Typography>
            ),
            style: labelStyle,
          },
          ...equipmentInventoriesValue
            .slice(startIndexOfSliceInventories, endIndexOfSliceInventories)
            .map((_inventory, index) => {
              const prefixInventory = getPrefixName(startIndexOfSliceInventories, index);

              return {
                content: (
                  <Element
                    errorMessage={_getErrorMessage(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.OWNERSHIP}`
                    )}
                    showErrorBorder
                  >
                    <RadioButton
                      label={''}
                      columns={1}
                      options={ownershipOptions}
                      {...getFieldProps(
                        `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.OWNERSHIP}`
                      )}
                      onChange={setFieldValue}
                      showClearButton
                      disabled={disabled}
                    />
                  </Element>
                ),
                style: getContentStyle(index === DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS - 1),
              };
            }),
        ],
      },
      {
        style: {
          verticalAlign: 'top',
        },
        columns: [
          {
            content: (
              <Typography variant="body2" px={2} p={0}>
                <b>7a. NAME OF PREPARER</b>
              </Typography>
            ),
            style: labelStyle,
          },
          ...equipmentInventoriesValue
            .slice(startIndexOfSliceInventories, endIndexOfSliceInventories)
            .map((_inventory, index) => {
              const prefixInventory = getPrefixName(startIndexOfSliceInventories, index);

              return {
                content: (
                  <TextareaAutosize
                    {...getUncontrolledFieldProps(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.PREPARER_NAME}`
                    )}
                    disabled={disabled}
                    errorMessage={_getErrorMessage(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.PREPARER_NAME}`
                    )}
                    minRows={2}
                  />
                ),
                style: getContentStyle(index === DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS - 1),
              };
            }),
        ],
      },
      {
        style: {
          verticalAlign: 'top',
        },
        columns: [
          {
            content: (
              <Typography variant="body2" px={2} p={0}>
                <b>7b. PHONE NUMBER OF PREPARER</b>
              </Typography>
            ),
            style: labelStyle,
          },
          ...equipmentInventoriesValue
            .slice(startIndexOfSliceInventories, endIndexOfSliceInventories)
            .map((_inventory, index) => {
              const prefixInventory = getPrefixName(startIndexOfSliceInventories, index);

              return {
                content: (
                  <InputPhoneWithoutFlags
                    {...getFieldProps(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.PREPARER_PHONE}`
                    )}
                    disabled={disabled}
                    errorMessage={_getErrorMessage(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.PREPARER_PHONE}`
                    )}
                    onChange={setFieldValue}
                    onlyUS
                  />
                ),
                style: getContentStyle(index === DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS - 1),
              };
            }),
        ],
      },
      {
        style: {
          verticalAlign: 'top',
        },
        columns: [
          {
            content: (
              <Typography variant="body2" px={2} p={0}>
                <b>8. EQUIPMENT COMPONENT:</b>{' '}
                {
                  'IF additional component and Cost is >=$1,000 and item will be incorporated or attached to a host/parent equipment item, provide Decal# or PO# of host/parent Standalone.(If not applicable, state N/A)'
                }
              </Typography>
            ),
            style: labelStyle,
          },
          ...equipmentInventoriesValue
            .slice(startIndexOfSliceInventories, endIndexOfSliceInventories)
            .map((_inventory, index) => {
              const prefixInventory = getPrefixName(startIndexOfSliceInventories, index);

              return {
                content: (
                  <TextareaAutosize
                    {...getUncontrolledFieldProps(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.COMPONENT}`
                    )}
                    disabled={disabled}
                    errorMessage={_getErrorMessage(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.COMPONENT}`
                    )}
                    minRows={8}
                  />
                ),
                style: getContentStyle(index === DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS - 1),
              };
            }),
        ],
      },
      {
        style: {
          verticalAlign: 'top',
        },
        columns: [
          {
            content: (
              <Typography variant="body2" px={2} p={0}>
                <b>9. FABRICATED EQUIPMENT:</b>{' '}
                {
                  '(a) If initial purchase provide end product name (b) If addition to fabrication, provide Decal# or PO# of Initial fabrication purchase (If not applicable, state N/A in both (a) and (b))'
                }
              </Typography>
            ),
            style: labelStyle,
          },
          ...equipmentInventoriesValue
            .slice(startIndexOfSliceInventories, endIndexOfSliceInventories)
            .map((_inventory, index) => {
              const prefixInventory = getPrefixName(startIndexOfSliceInventories, index);

              return {
                content: (
                  <Box>
                    <TextareaAutosize
                      label="(a) Product Name"
                      {...getUncontrolledFieldProps(
                        `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.FABRICATED_A}`
                      )}
                      disabled={disabled}
                      errorMessage={_getErrorMessage(
                        `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.FABRICATED_A}`
                      )}
                      minRows={2}
                      className="mb-12"
                    />
                    <TextareaAutosize
                      label="(b) Decal# or PO#"
                      {...getUncontrolledFieldProps(
                        `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.FABRICATED_B}`
                      )}
                      disabled={disabled}
                      errorMessage={_getErrorMessage(
                        `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.FABRICATED_B}`
                      )}
                      minRows={2}
                    />
                  </Box>
                ),
                style: getContentStyle(index === DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS - 1),
              };
            }),
        ],
      },
      {
        style: {
          verticalAlign: 'top',
        },
        columns: [
          {
            content: (
              <Typography variant="body2" px={2} p={0}>
                <b>10. EQUIPMENT RECEIVED DATE</b>
              </Typography>
            ),
            style: labelStyle,
          },
          ...equipmentInventoriesValue
            .slice(startIndexOfSliceInventories, endIndexOfSliceInventories)
            .map((_inventory, index) => {
              const prefixInventory = getPrefixName(startIndexOfSliceInventories, index);

              return {
                content: (
                  <DatePicker
                    {...getFieldProps(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.RECEIVE_DATE}`
                    )}
                    disabled={disabled}
                    errorMessage={_getErrorMessage(
                      `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.RECEIVE_DATE}`
                    )}
                    onChange={setFieldValue}
                    selected={
                      getFieldProps(
                        `${prefixInventory}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.RECEIVE_DATE}`
                      ).value
                    }
                  />
                ),
                style: getContentStyle(index === DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS - 1),
              };
            }),
        ],
      },
    ];
  };

  const numberOfTableItems = getNumberOfTableEquipmentInventories(
    values.paymentNumberOfEquipmentInventories
  );

  const handleNumberOfItemsChange = (name: string, value: number) => {
    setFieldValue(name, value);

    const currentNumberOfEquipmentInventories = equipmentInventoriesValue.length || 0;
    const updatedNumberOfEquipmentInventories = value;

    if (currentNumberOfEquipmentInventories < updatedNumberOfEquipmentInventories) {
      setFieldValue(PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORIES, [
        ...equipmentInventoriesValue,
        ...getInitialPaymentEquipmentInventories(
          updatedNumberOfEquipmentInventories - currentNumberOfEquipmentInventories
        ),
      ]);
    }
  };

  return (
    <Accordion title="Equipment Inventory:" isExpanded={isExpanded}>
      <Box width={'25%'} mb={2}>
        <Select
          options={numberOfItemsOptions}
          label="Number of Items"
          {...getFieldProps(PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORIES_NUMBER_OF_ITEMS)}
          hideSearchIcon
          onChange={handleNumberOfItemsChange}
          isClearable={false}
        />
      </Box>

      {Array.from({ length: numberOfTableItems }).map((_value, index) => {
        return (
          <CustomTable.Layout
            bodyList={[getHeaderRow(index), ...getEquipmentInventoryItems(index)]}
            tableSx={{ mb: 3 }}
          />
        );
      })}

      <Typography variant="h5" mt={2}>
        If the Equipment Inventory form has not been completed, please click the following:
      </Typography>

      <Checkbox.Item
        label={
          'I will complete and submit an Equipment Inventory list manually and forward it to my Fiscal Office who will then forward it to the appropriate RCUH or UH office.'
        }
        {...getFieldProps(PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORY_MANUAL_FLAG)}
        errorMessage={_getErrorMessage(PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORY_MANUAL_FLAG)}
        disabled={disabled}
        className="mt-8"
      />
    </Accordion>
  );
};

type Props<T> = {
  formikProps: T extends UpsertAuthorizationPaymentFormikProps
    ? UpsertAuthorizationPaymentFormikProps
    : T extends UpdatePOPaymentFormikProps
    ? UpdatePOPaymentFormikProps
    : unknown;
  authorizationPaymentPrefix?: string;
  disabled?: boolean;
  currentPOMode: PO_MODE;
};

export default memo(EquipmentInventories, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentPOMode === nextProps.currentPOMode &&
    prevFormikProps.submitCount === nextFormikProps.submitCount &&
    isEqualPrevAndNextFormikValues<UpdatePOPaymentFormValue | UpsertAuthorizationFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender: [
        PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORIES,
        PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORY_MANUAL_FLAG,
        PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORIES_NUMBER_OF_ITEMS,

        PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORIES,
        PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORY_MANUAL_FLAG,
        PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORIES_NUMBER_OF_ITEMS,

        AUTHORIZATION_FOR_PAYMENT_KEY.EQUIPMENT_INVENTORIES,
        AUTHORIZATION_FOR_PAYMENT_KEY.EQUIPMENT_INVENTORY_MANUAL_FLAG,
      ],
    })
  );
});
