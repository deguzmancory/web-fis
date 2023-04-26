import { Box, Grid, Typography } from '@mui/material';
import { ChangeEvent, memo, useCallback, useEffect, useMemo } from 'react';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, CellType } from 'src/components/CustomTable/types';
import {
  DatePicker,
  EllipsisTooltipInput,
  EllipsisTooltipInputCurrency,
  TextareaAutosize,
} from 'src/components/common';
import SearchProjectNumber from 'src/containers/shared/SearchProjectNumber';
import { PO_MODE } from 'src/queries';
import { isCUReviewMode, isFAReviewMode } from 'src/queries/PurchaseOrders/helpers';
import {
  calculateTotals,
  checkRowStateAndSetValue,
  getErrorMessage,
  isEqualPrevAndNextFormikValues,
} from 'src/utils';
import { AUTHORIZATION_FOR_PAYMENT_KEY } from '../../AuthorizationForPayment/enum';
import { initialAuthorizationPaymentProjectItem } from '../../AuthorizationForPayment/helpers/constants';
import {
  NonPOPaymentProjectItemFormValue,
  UpsertAuthorizationFormValue,
  UpsertAuthorizationPaymentFormikProps,
} from '../../AuthorizationForPayment/types';
import { NON_EMPLOYEE_TRAVEL_FORM_KEY } from '../../NonEmployeeExpensePayment/enums';
import {
  UpsertNonEmployeeTravelFormValue,
  UpsertNonEmployeeTravelFormikProps,
} from '../../NonEmployeeExpensePayment/types';
import { PERSONAL_AUTOMOBILE_FORM_KEY } from '../../PersonalAutomobileMileageVoucher/enums';
import {
  PersonalAutomobileFormValue,
  PersonalAutomobileFormikProps,
} from '../../PersonalAutomobileMileageVoucher/types';
import { PETTY_CASH_FORM_KEY } from '../../PettyCashSummarySheet/enums';
import {
  UpsertPettyCashFormValue,
  UpsertPettyCashFormikProps,
} from '../../PettyCashSummarySheet/types';
import { authorizationProjectLineItemsColumnsName, commonColumnStyles } from '../constants';
import { PMT_PROJECT_LINE_ITEM_KEY } from '../enums';

const isUpsertAuthorizationPaymentFormValue = (
  formValues,
  projectItemsPrefix: string
): formValues is UpsertAuthorizationFormValue => {
  return projectItemsPrefix === AUTHORIZATION_FOR_PAYMENT_KEY.PROJECT_LINE_ITEMS;
};

const isUpsertNonEmployeeTravelFormValue = (
  formValues,
  projectItemsPrefix: string
): formValues is UpsertNonEmployeeTravelFormValue => {
  return projectItemsPrefix === NON_EMPLOYEE_TRAVEL_FORM_KEY.PROJECT_ITEMS;
};

const isUpsertPersonalAutomobileFormValue = (
  formValues,
  projectItemsPrefix: string
): formValues is PersonalAutomobileFormValue => {
  return projectItemsPrefix === PERSONAL_AUTOMOBILE_FORM_KEY.PROJECT_ITEMS;
};

const isUpsertPettyCashFormValue = (
  formValues,
  projectItemsPrefix: string
): formValues is UpsertPettyCashFormValue => {
  return projectItemsPrefix === PETTY_CASH_FORM_KEY.PROJECT_ITEMS;
};

const ProjectItems = <
  T extends
    | UpsertAuthorizationPaymentFormikProps
    | UpsertNonEmployeeTravelFormikProps
    | PersonalAutomobileFormikProps
    | UpsertPettyCashFormikProps
>({
  formikProps,
  disabled,
  projectItemsPrefix,
  totalPrefix,
  title,
  showTotalError = true,
  tableErrorMessage,
  currentMode,
}: Props<T>) => {
  const {
    errors,
    values,
    touched,
    setFieldValue,
    getFieldProps,
    setFieldTouched,
    getUncontrolledFieldProps,
  } = formikProps;

  const isReviewMode = isFAReviewMode(currentMode) || isCUReviewMode(currentMode);

  const lineItemsValue = useMemo(() => {
    if (
      isUpsertAuthorizationPaymentFormValue(values, projectItemsPrefix) ||
      isUpsertPersonalAutomobileFormValue(values, projectItemsPrefix) ||
      isUpsertPettyCashFormValue(values, projectItemsPrefix)
    ) {
      return values.projectLineItems || [];
    }

    if (isUpsertNonEmployeeTravelFormValue(values, projectItemsPrefix)) {
      return values.projectItems || [];
    }

    return [];
  }, [projectItemsPrefix, values]);

  useEffect(() => {
    const paymentTotal = calculateTotals(lineItemsValue, [PMT_PROJECT_LINE_ITEM_KEY.AMOUNT]);
    setFieldValue(totalPrefix, paymentTotal);
  }, [lineItemsValue, setFieldValue, totalPrefix]);

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const removeRow = useCallback(
    (index: number) => {
      setFieldValue(
        `${projectItemsPrefix}`,
        lineItemsValue.filter((_row, idx) => idx !== index)
      );
    },
    [lineItemsValue, projectItemsPrefix, setFieldValue]
  );

  const addNewRow = useCallback(() => {
    setFieldValue(`${projectItemsPrefix}`, [
      ...lineItemsValue,
      {
        ...initialAuthorizationPaymentProjectItem,
      },
    ]);
  }, [lineItemsValue, projectItemsPrefix, setFieldValue]);

  const handleInputChange = ({ name, value, index }) => {
    checkRowStateAndSetValue<NonPOPaymentProjectItemFormValue>({
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

  const updatePaymentAmountTotal = useCallback(
    ({ lineItemRow, index }: { lineItemRow: NonPOPaymentProjectItemFormValue; index: number }) => {
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

  const handleAmountChange = useCallback(
    ({
      name,
      value,
      lineItemRow,
      key,
      index,
    }: {
      name: string;
      value: any;
      lineItemRow: NonPOPaymentProjectItemFormValue;
      key: PMT_PROJECT_LINE_ITEM_KEY;
      index: number;
    }) => {
      checkRowStateAndSetValue<NonPOPaymentProjectItemFormValue>({
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
    const prefixLineItem = `${projectItemsPrefix}.${index}`;
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
                ...getFieldProps(`${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.PROJECT_NUMBER}`),
              }}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.PROJECT_NUMBER}`
              )}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              sx={{ width: 140 }}
              disabled={disabled || isReviewMode}
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
          headerStyle: {
            ...commonColumnStyles,
          },
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(`${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.SUB_PROJECT}`)}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.SUB_PROJECT}`,
                  value: event.target.value,
                })
              }
              hideEllipsisTooltip
              maxLength={5}
              style={{ width: 90 }}
              disabled={disabled}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Budget Category *',
          headerStyle: {
            ...commonColumnStyles,
          },
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(`${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.BUDGET_CATEGORY}`)}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.BUDGET_CATEGORY}`
              )}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.BUDGET_CATEGORY}`,
                  value: event.target.value,
                })
              }
              hideEllipsisTooltip
              maxLength={4}
              style={{ width: 80 }}
              disabled={disabled}
              required
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Sub Budget Category',
          headerStyle: {
            ...commonColumnStyles,
          },
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(
                `${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY}`
              )}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY}`,
                  value: event.target.value,
                })
              }
              hideEllipsisTooltip
              style={{ width: 90 }}
              maxLength={3}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Service Date',
          headerStyle: {
            ...commonColumnStyles,
          },
          content: (
            <Box width={145}>
              <DatePicker
                placeholder=""
                dateFormat="MM/dd/yyyy"
                {...getFieldProps(`${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.SERVICE_DATE}`)}
                selected={lineItemRow.serviceDate as Date}
                name={`${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.SERVICE_DATE}`}
                onBlur={setFieldTouched}
                onChange={(name, value) => {
                  handleInputChange({
                    index,
                    name,
                    value,
                  });
                }}
                disabled={disabled}
              />
            </Box>
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Description *',
          content: (
            <TextareaAutosize
              {...getUncontrolledFieldProps(
                `${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.DESCRIPTION}`
              )}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.DESCRIPTION}`
              )}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                const nameDescription = `${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.DESCRIPTION}`;
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
                width: 315,
              }}
              disabled={disabled}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Amount *',
          content: (
            <EllipsisTooltipInputCurrency
              {...getFieldProps(`${prefixLineItem}.${PMT_PROJECT_LINE_ITEM_KEY.AMOUNT}`)}
              onChange={(name, value) =>
                handleAmountChange({
                  name,
                  value,
                  lineItemRow,
                  index,
                  key: PMT_PROJECT_LINE_ITEM_KEY.AMOUNT,
                })
              }
              style={{
                width: 145,
              }}
              disabled={disabled}
              textAlign="right"
            />
          ),
        },
      ],
    };
  });

  return (
    <Box>
      {title && (
        <Typography variant="h5" textAlign={'center'} pb={2}>
          {title}
        </Typography>
      )}
      {/* Hidden input for scroll to error purpose */}
      <input name={projectItemsPrefix} hidden />
      <CustomTable.Basic bodyList={lineItemRows} errorMessage={tableErrorMessage} />
      <Grid container className="justify-flex-end" mt={1}>
        <Grid item xs={0.8}>
          <Typography variant="h6" fontWeight={'bold'}>
            TOTAL
          </Typography>
        </Grid>
        <Grid item xs={1.6}>
          <EllipsisTooltipInputCurrency
            {...getFieldProps(totalPrefix)}
            errorMessage={showTotalError ? _getErrorMessage(totalPrefix) : ''}
            textAlign="right"
            disabled
            lengthShowTooltip={8}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props<T> = {
  formikProps: T extends UpsertAuthorizationPaymentFormikProps
    ? UpsertAuthorizationPaymentFormikProps
    : T extends UpsertNonEmployeeTravelFormikProps
    ? UpsertNonEmployeeTravelFormikProps
    : T extends PersonalAutomobileFormikProps
    ? PersonalAutomobileFormikProps
    : T extends UpsertPettyCashFormikProps
    ? UpsertPettyCashFormikProps
    : unknown;
  projectItemsPrefix: string;
  totalPrefix: string;
  title?: string;
  currentMode?: PO_MODE;
  disabled?: boolean;
  tableErrorMessage?: string;
  showTotalError?: boolean;
};

export default memo(ProjectItems, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [nextProps.projectItemsPrefix, nextProps.totalPrefix];

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.projectItemsPrefix === nextProps.projectItemsPrefix &&
    prevProps.totalPrefix === nextProps.totalPrefix &&
    prevProps.tableErrorMessage === nextProps.tableErrorMessage &&
    prevProps.showTotalError === nextProps.showTotalError &&
    prevProps.currentMode === nextProps.currentMode &&
    isEqualPrevAndNextFormikValues<
      | UpsertAuthorizationFormValue
      | UpsertNonEmployeeTravelFormValue
      | PersonalAutomobileFormValue
      | UpsertPettyCashFormValue
    >({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
