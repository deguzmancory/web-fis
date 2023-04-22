import { Box, Grid, Typography } from '@mui/material';
import { memo, useMemo, FC, useCallback, ChangeEvent, useEffect } from 'react';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, BodyRow, CellType } from 'src/components/CustomTable/types';
import {
  EllipsisTooltipInputCurrency,
  Input,
  Select,
  TextareaAutosize,
} from 'src/components/common';
import { PO_MODE } from 'src/queries';
import { checkRowStateAndSetValue, getErrorMessage } from 'src/utils';
import { isEqualPrevAndNextFormikValues } from 'src/utils';
import { UpsertNonEmployeeTravelFormValue, UpsertNonEmployeeTravelFormikProps } from '../types';
import { EXPENDITURE_ITEM_FORM_KEY, NON_EMPLOYEE_TRAVEL_FORM_KEY } from '../enums';
import {
  initialNonEmployeeTravelExpenditure,
  travelExpenditureColumnNames,
} from '../helpers/constants';
import { NonEmployeeTravelExpenditure } from 'src/queries/NonPOPayment/NonEmployeeTravel';
import { travelExpendituresHeaderRow, travelExpensesOptions } from './helpers';
import { commonColumnStyles } from '../../shared/constants';

const TravelExpenditures: FC<Props> = ({ formikProps, disabled }) => {
  const { errors, values, touched, setFieldValue, getFieldProps, getUncontrolledFieldProps } =
    formikProps;

  const expenditureItemValue = useMemo(() => {
    return values.expenditures || [];
  }, [values.expenditures]);

  const expenditureItemKey = NON_EMPLOYEE_TRAVEL_FORM_KEY.EXPENDITURES;

  useEffect(() => {}, []);

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const removeRow = useCallback(
    (index: number) => {
      setFieldValue(
        `${expenditureItemKey}`,
        expenditureItemValue.filter((_row, idx) => idx !== index)
      );
    },
    [expenditureItemValue, expenditureItemKey, setFieldValue]
  );

  const addNewRow = useCallback(() => {
    setFieldValue(`${expenditureItemKey}`, [
      ...expenditureItemValue,
      initialNonEmployeeTravelExpenditure,
    ]);
  }, [expenditureItemValue, expenditureItemKey, setFieldValue]);

  const updatePaymentAmountTotal = useCallback(
    ({ lineItemRow, index }: { lineItemRow: NonEmployeeTravelExpenditure; index: number }) => {
      let updatedPaymentTotal = Number(values.remittance?.remittanceTotal || 0);
      const currentLineItemAmount = Number(lineItemRow.amount || 0);

      updatedPaymentTotal = expenditureItemValue.reduce((total, currentLineItem, currentIndex) => {
        if (index === currentIndex) return total + currentLineItemAmount;

        return total + currentLineItem.amount;
      }, 0);
      setFieldValue(`${NON_EMPLOYEE_TRAVEL_FORM_KEY.EXPENDITURE_TOTAL}`, updatedPaymentTotal);
    },

    [expenditureItemValue, setFieldValue, values.remittance?.remittanceTotal]
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
      lineItemRow: NonEmployeeTravelExpenditure;
      key: EXPENDITURE_ITEM_FORM_KEY;
      index: number;
    }) => {
      checkRowStateAndSetValue<NonEmployeeTravelExpenditure>({
        name,
        value,
        index,
        records: expenditureItemValue,
        columnKeys: travelExpenditureColumnNames,
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
    [addNewRow, expenditureItemValue, removeRow, setFieldValue, updatePaymentAmountTotal]
  );

  const miscExpenditureRow: BodyRow = {
    columns: [
      {
        content: (
          <Box width={250}>
            <Input disabled value={'M&IE Trip Total (from above)'} />
          </Box>
        ),
        style: { ...commonColumnStyles },
      },
      {
        content: (
          <Box width={70}>
            <Input disabled value={'All'} />
          </Box>
        ),
        style: { ...commonColumnStyles },
      },
      {
        content: (
          <Box width={100}>
            <Input
              disabled
              {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.MISC_DAYS_CLAIM_TOTAL)}
            />
          </Box>
        ),
        style: { ...commonColumnStyles },
      },
      {
        content: (
          <Box>
            <TextareaAutosize
              disabled={disabled}
              {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.MISC_DESCRIPTION)}
              errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.MISC_DESCRIPTION)}
              style={{
                paddingTop: '4px',
                paddingBottom: 0,
              }}
            />
          </Box>
        ),
        style: { ...commonColumnStyles },
      },
      {
        content: (
          <Box width={180}>
            <EllipsisTooltipInputCurrency
              disabled
              {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.MISC_COST_TOTAL)}
              textAlign="right"
            />
          </Box>
        ),
        style: { ...commonColumnStyles },
      },
    ],
  };

  const lodgingExpenditureRow: BodyRow = {
    columns: [
      {
        content: (
          <Box>
            <Input disabled value={'Lodging Trip Total (from above)'} />
          </Box>
        ),
        style: { ...commonColumnStyles },
      },
      {
        content: (
          <Box width={70}>
            <Input disabled value={'All'} />
          </Box>
        ),
        style: { ...commonColumnStyles },
      },
      {
        content: (
          <Box width={100}>
            <Input
              disabled
              {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.LODGING_DAYS_CLAIM_TOTAL)}
            />
          </Box>
        ),
        style: { ...commonColumnStyles },
      },
      {
        content: (
          <Box>
            <TextareaAutosize
              disabled={disabled}
              {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.LODGING_DESCRIPTION)}
              errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.LODGING_DESCRIPTION)}
              style={{
                paddingTop: '4px',
                paddingBottom: 0,
              }}
            />
          </Box>
        ),
        style: { ...commonColumnStyles },
      },
      {
        content: (
          <Box width={180}>
            <EllipsisTooltipInputCurrency
              disabled
              {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.LODGING_COST_TOTAL)}
              textAlign="right"
            />
          </Box>
        ),
        style: { ...commonColumnStyles },
      },
    ],
  };

  const handleInputChange = ({ name, value, index }) => {
    checkRowStateAndSetValue<NonEmployeeTravelExpenditure>({
      name,
      value,
      index,
      records: expenditureItemValue,
      columnKeys: travelExpenditureColumnNames,
      setFieldValue,
      onAddRow: addNewRow,
      onRemoveRow: removeRow,
    });
  };

  const lineItemRows: BodyBasicRows = expenditureItemValue.map((lineItemRow, index) => {
    const prefixLineItem = `${expenditureItemKey}.${index}`;

    return {
      style: {
        verticalAlign: 'top',
      },
      columns: [
        {
          content: (
            <Box>
              <Select
                {...getFieldProps(`${prefixLineItem}.${EXPENDITURE_ITEM_FORM_KEY.ITEM}`)}
                errorMessage={_getErrorMessage(
                  `${prefixLineItem}.${EXPENDITURE_ITEM_FORM_KEY.ITEM}`
                )}
                options={travelExpensesOptions}
                label=""
                onChange={(name, value) => {
                  handleInputChange({
                    index,
                    name,
                    value,
                  });
                }}
                hideSearchIcon
                isDisabled={disabled}
              />
            </Box>
          ),
          style: { ...commonColumnStyles },
        },
        {
          type: CellType.INPUT,
          content: (
            <Box width={70}>
              <Input
                {...getFieldProps(`${prefixLineItem}.${EXPENDITURE_ITEM_FORM_KEY.LEG}`)}
                errorMessage={_getErrorMessage(
                  `${prefixLineItem}.${EXPENDITURE_ITEM_FORM_KEY.LEG}`
                )}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange({
                    index,
                    name: `${prefixLineItem}.${EXPENDITURE_ITEM_FORM_KEY.LEG}`,
                    value: event.target.value,
                  })
                }
                maxLength={3}
                disabled={disabled}
              />
            </Box>
          ),
        },
        {
          type: CellType.INPUT,
          colSpan: 2,
          content: (
            <Box>
              <TextareaAutosize
                {...getFieldProps(`${prefixLineItem}.${EXPENDITURE_ITEM_FORM_KEY.DESCRIPTION}`)}
                errorMessage={_getErrorMessage(
                  `${prefixLineItem}.${EXPENDITURE_ITEM_FORM_KEY.DESCRIPTION}`
                )}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange({
                    index,
                    name: `${prefixLineItem}.${EXPENDITURE_ITEM_FORM_KEY.DESCRIPTION}`,
                    value: event.target.value,
                  })
                }
                style={{
                  paddingTop: '4px',
                  paddingBottom: 0,
                }}
                disabled={disabled}
              />
            </Box>
          ),
        },
        {
          type: CellType.INPUT,
          content: (
            <Box width={180}>
              <EllipsisTooltipInputCurrency
                {...getFieldProps(`${prefixLineItem}.${EXPENDITURE_ITEM_FORM_KEY.AMOUNT}`)}
                onChange={(name, value) =>
                  handleAmountChange({
                    name,
                    value,
                    lineItemRow,
                    index,
                    key: EXPENDITURE_ITEM_FORM_KEY.AMOUNT,
                  })
                }
                disabled={disabled}
                textAlign="right"
              />
            </Box>
          ),
        },
      ],
    };
  });

  return (
    <Box>
      <Typography variant="h5" textAlign={'center'}>
        ALL TRAVEL EXPENDITURES FOR THIS TRIP
      </Typography>
      <Typography variant="body2" textAlign={'center'} pt={'4px'} pb={2}>
        (Including other POs and Non-Po Payments)
      </Typography>

      {/* Hidden input for scroll to error purpose */}
      <input name={expenditureItemKey} hidden />
      <CustomTable.Layout
        bodyList={[
          travelExpendituresHeaderRow,
          miscExpenditureRow,
          lodgingExpenditureRow,
          ...lineItemRows,
        ]}
      />

      <Grid container className="justify-flex-end" mt={2}>
        <Grid item xs={3} textAlign={'right'}>
          <Typography mr={3}>A. TOTAL TRIP EXPENSES</Typography>
        </Grid>
        <Grid item xs={2}>
          <EllipsisTooltipInputCurrency
            {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.EXPENDITURE_TOTAL)}
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.EXPENDITURE_TOTAL)}
            textAlign="right"
            disabled
            lengthShowTooltip={8}
          />
        </Grid>
      </Grid>

      <Grid container className="justify-flex-end" mt={2}>
        <Grid item xs={2}>
          <Typography mr={2}>Document Number(s)</Typography>
        </Grid>
        <Grid item xs={5}>
          <Input
            {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.ADVANCED_DOCUMENT_NUMBER)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={3} textAlign={'right'}>
          <Typography mr={3}>B. LESS AMOUNT PAID</Typography>
        </Grid>
        <Grid item xs={2}>
          <EllipsisTooltipInputCurrency
            {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.AMOUNT_ADVANCED)}
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.AMOUNT_ADVANCED)}
            onChange={setFieldValue}
            textAlign="right"
            disabled={disabled}
            lengthShowTooltip={8}
          />
        </Grid>
      </Grid>

      <Grid container className="justify-flex-end" mt={2}>
        <Grid item xs={3} textAlign={'right'}>
          <Typography variant="h6" mr={3}>
            CLAIM DUE (A-B)
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <EllipsisTooltipInputCurrency
            name=""
            value={Number(values.expenditureTotal) - Number(values.amountAdvanced)}
            textAlign="right"
            disabled
            lengthShowTooltip={8}
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.PAYMENT_TOTAL) ? ' ' : null}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpsertNonEmployeeTravelFormikProps;
  disabled?: boolean;
  currentMode?: PO_MODE;
};

export default memo(TravelExpenditures, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    NON_EMPLOYEE_TRAVEL_FORM_KEY.EXPENDITURES,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.ADVANCED_DOCUMENT_NUMBER,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.EXPENDITURE_TOTAL,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.AMOUNT_ADVANCED,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.MISC_COST_TOTAL,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.LODGING_COST_TOTAL,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.MISC_DESCRIPTION,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.LODGING_DESCRIPTION,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.MISC_DAYS_CLAIM_TOTAL,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.LODGING_DAYS_CLAIM_TOTAL,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.PAYMENT_TOTAL,
  ];

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentMode === nextProps.currentMode &&
    isEqualPrevAndNextFormikValues<UpsertNonEmployeeTravelFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
