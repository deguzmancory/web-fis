import { Delete, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  iconButtonClasses,
} from '@mui/material';
import React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import TypographyLink from 'src/components/TypographyLink';
import {
  Accordion,
  AnimatedTabPanel,
  Button,
  Checkbox,
  DatePicker,
  Element,
  Input,
  InputPhone,
  RadioButton,
  TabsBar,
  TextareaAutosize,
} from 'src/components/common';
import {
  UpdatePOPaymentFormValue,
  UpdatePOPaymentFormikProps,
} from 'src/containers/POPayment/types';
import { PO_FORM_KEY } from 'src/containers/PurchaseOrderContainer/enums';
import { PO_MODE } from 'src/queries';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { isEmpty } from 'src/validations';
import { PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY } from '../enums';
import { initialPaymentEquipmentInventory } from '../helpers';
import { ownershipOptions } from './helpers';

const EquipmentInventories: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const [currentTabIndex, setCurrentTabIndex] = React.useState<number>(0);

  const {
    values,
    errors,
    touched,
    submitCount,
    getUncontrolledFieldProps,
    getFieldProps,
    setFieldValue,
  } = formikProps;

  const equipmentInventoriesValue = React.useMemo(
    () => values.paymentEquipmentInventories || [],
    [values.paymentEquipmentInventories]
  );

  const currentEquipmentInventoriesPrefix = `${PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORIES}.${currentTabIndex}`;

  const allowRemoveItem = equipmentInventoriesValue.length > 1;
  const showNextPrevButtons = equipmentInventoriesValue.length > 1;

  React.useEffect(() => {
    if (
      !isEmpty(errors.paymentEquipmentInventories) &&
      Array.isArray(errors.paymentEquipmentInventories)
    ) {
      const firstTabIndexHasErrors = errors.paymentEquipmentInventories.findIndex(
        (inventory) => !!inventory
      );
      setCurrentTabIndex(firstTabIndexHasErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount]);

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleAddTab = () => {
    const currentValuesLength = equipmentInventoriesValue.length || 1;
    setFieldValue(PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORIES, [
      ...equipmentInventoriesValue,
      initialPaymentEquipmentInventory,
    ]);

    // auto jump to item just created
    setCurrentTabIndex(currentValuesLength);
  };

  const handleRemoveTab = React.useCallback(
    (index: number) => {
      setFieldValue(
        PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORIES,
        equipmentInventoriesValue.filter((_item, idx) => idx !== index)
      );

      // jump to first item when remove current item
      if (currentTabIndex === index) {
        setCurrentTabIndex(0);
      }

      // update index of current selected item if other item above has been removed
      if (currentTabIndex > index) {
        setCurrentTabIndex((prev) => prev - 1);
      }
    },
    [setFieldValue, equipmentInventoriesValue, currentTabIndex]
  );

  const tabList = React.useMemo(
    () =>
      equipmentInventoriesValue
        .map((_item, index) => {
          return {
            label: (
              <Stack
                direction={'row'}
                justifyContent="space-between"
                width={'80%'}
                height={'100%'}
                sx={{
                  '&:hover': {
                    [`& .${iconButtonClasses.root}`]: {
                      display: 'inline-flex',
                    },
                  },
                }}
              >
                <span>Item #{index + 1} </span>
                {allowRemoveItem && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();

                      handleRemoveTab(index);
                    }}
                    sx={{
                      p: 0,
                      display: 'none',
                    }}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Stack>
            ),
            value: index.toString(),
            sx: {
              minWidth: 150,
              justifyContent: 'space-between',
              flexDirection: 'row',
            },
          };
        })
        .concat([
          {
            label: <TypographyLink fontWeight={'bold'}>Add Item</TypographyLink>,
            value: 'Add',
            sx: undefined,
          },
        ]),
    [equipmentInventoriesValue, handleRemoveTab, allowRemoveItem]
  );

  const handleTabChange = (_e, value) => {
    if (value === 'Add') {
      handleAddTab();
      return;
    }

    setCurrentTabIndex(Number(value));
  };

  const handleJumpToNextItem = () => {
    setCurrentTabIndex((prev) => prev + 1);
  };

  const handleJumpToPrevItem = () => {
    setCurrentTabIndex((prev) => prev - 1);
  };

  return (
    <Accordion title="Equipment Inventory:">
      <Box display={'flex'} flexGrow={1} border={COLOR_CODE.DEFAULT_BORDER}>
        <TabsBar
          tabsList={tabList}
          onChange={handleTabChange}
          value={currentTabIndex.toString()}
          orientation="vertical"
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            maxWidth: '130px',
            maxHeight: '150vh',
          }}
        />
        <AnimatedTabPanel
          uniqKey={`vertical-tab-${currentTabIndex}`}
          transitionTime={0.2}
          style={{
            width: '100%',
            maxHeight: '150vh',
            overflow: 'auto',
          }}
          direction="none"
        >
          <Stack
            direction="row"
            alignItems={'center'}
            justifyContent={'space-between'}
            borderBottom={COLOR_CODE.DEFAULT_BORDER}
            py={1}
            px={2}
            position="sticky"
            bgcolor={COLOR_CODE.WHITE}
            zIndex={99}
            top={0}
          >
            <Stack direction="row" alignItems={'center'}>
              <Typography fontWeight={'bold'} mr={1}>
                ITEM #{currentTabIndex + 1}
              </Typography>
              {allowRemoveItem && (
                <IconButton
                  disabled={equipmentInventoriesValue.length === 1}
                  onClick={() => handleRemoveTab(currentTabIndex)}
                >
                  <Delete />
                </IconButton>
              )}
            </Stack>
            {showNextPrevButtons && (
              <Stack direction="row">
                <Button
                  onClick={handleJumpToPrevItem}
                  disabled={currentTabIndex === 0}
                  className="pt-12 pr-8 pl-8 pb-8"
                  style={{
                    minWidth: '30px',
                    borderRadius: '4px',
                    marginRight: '4px',
                  }}
                >
                  <KeyboardArrowLeft />
                </Button>
                <Button
                  disabled={currentTabIndex === equipmentInventoriesValue.length - 1}
                  onClick={handleJumpToNextItem}
                  className="pt-12 pr-8 pl-8 pb-8"
                  style={{
                    minWidth: '30px',
                    borderRadius: '4px',
                  }}
                >
                  <KeyboardArrowRight />
                </Button>
              </Stack>
            )}
          </Stack>
          <Grid container spacing={1} py={2}>
            <Grid item xs={12} md={6} px={2}>
              <Typography variant="body2" px={2}>
                <b>1. DESCRIPTION</b> - Use generic names; (e.g. 3COM CELLPLEX = Interface card)
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} px={2}>
              <TextareaAutosize
                {...getUncontrolledFieldProps(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.DESCRIPTION}`
                )}
                disabled={disabled}
                errorMessage={_getErrorMessage(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.DESCRIPTION}`
                )}
                minRows={1}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6} px={2}>
              <Typography variant="body2" px={2}>
                <b>2. BRAND NAME & MODEL NUMBER </b> - If none, state NONE
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} px={2}>
              <TextareaAutosize
                {...getUncontrolledFieldProps(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.BRAND_NAME}`
                )}
                minRows={1}
                disabled={disabled}
                errorMessage={_getErrorMessage(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.BRAND_NAME}`
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6} px={2}>
              <Typography variant="body2" px={2}>
                <b>3. SERIAL NUMBER</b> - If none, state NONE
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} px={2}>
              <TextareaAutosize
                {...getUncontrolledFieldProps(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.SERIAL_NUMBER}`
                )}
                minRows={1}
                disabled={disabled}
                errorMessage={_getErrorMessage(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.SERIAL_NUMBER}`
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6} px={2}>
              <Typography variant="body2" px={2}>
                <b>4. COST OF ITEM</b>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} px={2}>
              <Input
                type="number"
                hideArrowTypeNumber
                {...getUncontrolledFieldProps(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.ITEM_COST}`
                )}
                minRows={1}
                disabled={disabled}
                errorMessage={_getErrorMessage(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.ITEM_COST}`
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6} px={2}>
              <Typography variant="body2" px={2}>
                <b>5. BUILDING NAME AND ROOM NO.</b> (Location of equipment)
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} px={2}>
              <TextareaAutosize
                {...getUncontrolledFieldProps(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.LOCATION_OF_EQUIPMENT}`
                )}
                minRows={1}
                disabled={disabled}
                errorMessage={_getErrorMessage(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.LOCATION_OF_EQUIPMENT}`
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6} px={2}>
              <Typography variant="body2" px={2}>
                <b>6. TITLE/OWNERSHIP</b>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} px={2}>
              <Element
                errorMessage={_getErrorMessage(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.OWNERSHIP}`
                )}
                showErrorBorder
              >
                <RadioButton
                  label={<b>Payment Type:</b>}
                  columns={1}
                  options={ownershipOptions}
                  {...getFieldProps(
                    `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.OWNERSHIP}`
                  )}
                  onChange={setFieldValue}
                  showClearButton
                  disabled={disabled}
                />
              </Element>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6} px={2}>
              <Typography variant="body2" px={2}>
                <b>7a. NAME OF PREPARER</b>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} px={2}>
              <TextareaAutosize
                {...getUncontrolledFieldProps(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.PREPARER_NAME}`
                )}
                disabled={disabled}
                errorMessage={_getErrorMessage(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.PREPARER_NAME}`
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6} px={2}>
              <Typography variant="body2" px={2}>
                <b>7b. PHONE NUMBER OF PREPARER</b>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} px={2}>
              <InputPhone
                {...getFieldProps(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.PREPARER_PHONE}`
                )}
                disabled={disabled}
                errorMessage={_getErrorMessage(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.PREPARER_PHONE}`
                )}
                onChange={setFieldValue}
                onlyUS
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6} px={2}>
              <Typography variant="body2" px={2}>
                <b>8. EQUIPMENT COMPONENT:</b>{' '}
                {
                  'IF additional component and Cost is >=$1,000 and item will be incorporated or attached to a host/parent equipment item, provide Decal# or PO# of host/parent Standalone.(If not applicable, state N/A)'
                }
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} px={2}>
              <TextareaAutosize
                {...getUncontrolledFieldProps(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.COMPONENT}`
                )}
                disabled={disabled}
                errorMessage={_getErrorMessage(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.COMPONENT}`
                )}
                minRows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6} px={2}>
              <Typography variant="body2" px={2}>
                <b>9. FABRICATED EQUIPMENT:</b>{' '}
                {
                  '(a) If initial purchase provide end product name (b) If addition to fabrication, provide Decal# or PO# of Initial fabrication purchase (If not applicable, state N/A in both (a) and (b))'
                }
              </Typography>
            </Grid>
            <Grid item xs={12} md={3} pl={2}>
              <TextareaAutosize
                label="(a) Product Name"
                {...getUncontrolledFieldProps(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.FABRICATED_A}`
                )}
                disabled={disabled}
                errorMessage={_getErrorMessage(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.FABRICATED_A}`
                )}
                minRows={2}
              />
            </Grid>
            <Grid item xs={12} md={3} pr={2}>
              <TextareaAutosize
                label="(b) Decal# or PO#"
                {...getUncontrolledFieldProps(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.FABRICATED_B}`
                )}
                disabled={disabled}
                errorMessage={_getErrorMessage(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.FABRICATED_B}`
                )}
                minRows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6} px={2}>
              <Typography variant="body2" px={2}>
                <b>10. EQUIPMENT RECEIVED DATE</b>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} px={2}>
              <DatePicker
                {...getFieldProps(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.RECEIVE_DATE}`
                )}
                disabled={disabled}
                errorMessage={_getErrorMessage(
                  `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.RECEIVE_DATE}`
                )}
                onChange={setFieldValue}
                selected={
                  getFieldProps(
                    `${currentEquipmentInventoriesPrefix}.${PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY.RECEIVE_DATE}`
                  ).value
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        </AnimatedTabPanel>
      </Box>

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

type Props = {
  formikProps: UpdatePOPaymentFormikProps;
  disabled?: boolean;
  currentPOMode: PO_MODE;
};

export default React.memo(EquipmentInventories, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentPOMode === nextProps.currentPOMode &&
    prevFormikProps.submitCount === nextFormikProps.submitCount &&
    isEqualPrevAndNextFormikValues<UpdatePOPaymentFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender: [
        PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORIES,
        PO_FORM_KEY.PAYMENT_EQUIPMENT_INVENTORY_MANUAL_FLAG,
      ],
    })
  );
});
