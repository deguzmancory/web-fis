import { Add, Delete } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { FC, memo, useCallback, useEffect, useMemo } from 'react';
import CustomTable from 'src/components/CustomTable';
import { BodyRow } from 'src/components/CustomTable/types';
import {
  Button,
  DatePicker,
  EllipsisTooltipInput,
  EllipsisTooltipInputCurrency,
} from 'src/components/common';
import { PO_MODE } from 'src/queries';
import {
  DatePickerDateTimeFormat,
  getErrorMessage,
  isEqualPrevAndNextFormikValues,
} from 'src/utils';
import { ITINERARY_ITEM_FORM_KEY, NON_EMPLOYEE_TRAVEL_FORM_KEY } from '../enums';
import { initialNonEmployeeTravelItinerary } from '../helpers/constants';
import { UpsertNonEmployeeTravelFormikProps } from '../types';
import { calculateDataOfItineraries, calculateItinerariesTotal, headerRow } from './helpers';
import { commonInputColumnStyles, commonColumnStyles } from '../../shared/constants';

const TripItinerary: FC<Props> = ({ formikProps, disabled = false }) => {
  const { values, errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } =
    formikProps;

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const itinerariesValue = useMemo(() => values.itineraries || [], [values.itineraries]);

  // Update calc days, minus days, bus days in case itineraries's length change
  useEffect(() => {
    const updatedItineraries = calculateDataOfItineraries({
      startDepartureDate: values.startDepartureDate,
      endArrivalDate: values.endArrivalDate,
      itineraries: itinerariesValue,
    });
    const {
      lodgingCostTotal,
      lodgingDaysClaimTotal,
      miscCostTotal,
      miscDaysClaimTotal,
      itinerariesTotal,
    } = calculateItinerariesTotal(updatedItineraries);

    setFieldValue(`${NON_EMPLOYEE_TRAVEL_FORM_KEY.ITINERARIES}`, updatedItineraries);
    setFieldValue(`${NON_EMPLOYEE_TRAVEL_FORM_KEY.TRIP_TOTAL}`, itinerariesTotal);
    setFieldValue(`${NON_EMPLOYEE_TRAVEL_FORM_KEY.LODGING_COST_TOTAL}`, lodgingCostTotal);
    setFieldValue(
      `${NON_EMPLOYEE_TRAVEL_FORM_KEY.LODGING_DAYS_CLAIM_TOTAL}`,
      lodgingDaysClaimTotal
    );
    setFieldValue(`${NON_EMPLOYEE_TRAVEL_FORM_KEY.MISC_COST_TOTAL}`, miscCostTotal);
    setFieldValue(`${NON_EMPLOYEE_TRAVEL_FORM_KEY.MISC_DAYS_CLAIM_TOTAL}`, miscDaysClaimTotal);
  }, [
    itinerariesValue.length,
    itinerariesValue,
    values.endArrivalDate,
    values.startDepartureDate,
    setFieldValue,
  ]);

  const handleRemoveItineraryRow = useCallback(
    (index: number) => {
      setFieldValue(
        `${NON_EMPLOYEE_TRAVEL_FORM_KEY.ITINERARIES}`,
        itinerariesValue.filter((_row, idx) => idx !== index)
      );
    },
    [itinerariesValue, setFieldValue]
  );
  const handleAddItineraryRow = useCallback(
    (index: number) => {
      const updatedItineraryValue = [...itinerariesValue];
      updatedItineraryValue.splice(index + 1, 0, initialNonEmployeeTravelItinerary);

      setFieldValue(`${NON_EMPLOYEE_TRAVEL_FORM_KEY.ITINERARIES}`, updatedItineraryValue);
    },
    [itinerariesValue, setFieldValue]
  );

  const handleDepartureDateChange = (name, value) => {
    setFieldValue(name, value);
  };

  const startDepartureRow: BodyRow = {
    columns: [
      {
        content: 'Start',
        style: { ...commonColumnStyles },
      },
      {
        content: (
          <EllipsisTooltipInput
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.START_DESTINATION)}
            {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.START_DESTINATION)}
            disabled={disabled}
            style={{ ...commonInputColumnStyles, maxWidth: 115, minWidth: 115 }}
            placeholder="City, State"
            lengthShowTooltip={10}
          />
        ),
        style: { ...commonColumnStyles },
      },
      {
        content: 'Dep',
        style: { ...commonColumnStyles },
      },
      {
        content: (
          <Box maxWidth={200}>
            <DatePicker
              errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.START_DEPARTURE_DATE)}
              {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.START_DEPARTURE_DATE)}
              onChange={handleDepartureDateChange}
              selected={values.startDepartureDate}
              disabled={disabled}
              showTimeSelect
              dateFormat={DatePickerDateTimeFormat}
              timeIntervals={10}
              hideIcon
              placeholder=""
              classNames="pl-2 pr-2"
              isClearable
            />
          </Box>
        ),
        style: { ...commonColumnStyles },
      },
      ...Array(9).fill({
        content: '',
        style: { ...commonColumnStyles },
      }),
    ],
  };

  const itinerariesRows: BodyRow[] = itinerariesValue.reduce(
    (prevRows, _currentItinerary, index) => {
      const prefixItinerary = `${NON_EMPLOYEE_TRAVEL_FORM_KEY.ITINERARIES}.${index}`;

      // an itinerary will take 2 row
      const currentItineraryRows: BodyRow[] = [
        {
          columns: [
            {
              content: `${index + 1}`,
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <EllipsisTooltipInput
                  errorMessage={_getErrorMessage(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.DESTINATION}`
                  )}
                  {...getUncontrolledFieldProps(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.DESTINATION}`
                  )}
                  disabled={disabled}
                  style={{ ...commonInputColumnStyles, maxWidth: 115, minWidth: 115 }}
                  placeholder="City, State"
                  lengthShowTooltip={10}
                />
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: 'Arr',
              style: { ...commonColumnStyles, maxWidth: 20 },
            },
            {
              content: (
                <Box maxWidth={200}>
                  <DatePicker
                    errorMessage={_getErrorMessage(
                      `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.ARRIVAL_DATE}`
                    )}
                    {...getFieldProps(`${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.ARRIVAL_DATE}`)}
                    onChange={setFieldValue}
                    selected={
                      getFieldProps(`${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.ARRIVAL_DATE}`)
                        .value
                    }
                    disabled={disabled}
                    showTimeSelect
                    dateFormat={DatePickerDateTimeFormat}
                    timeIntervals={10}
                    hideIcon
                    placeholder=""
                    classNames="pl-2 pr-2"
                    isClearable
                  />
                </Box>
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <EllipsisTooltipInput
                  errorMessage={_getErrorMessage(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.CALC_DAYS}`
                  )}
                  {...getFieldProps(`${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.CALC_DAYS}`)}
                  type="number"
                  disabled
                  hideArrowTypeNumber
                  lengthShowTooltip={5}
                  style={{ ...commonInputColumnStyles, width: 60 }}
                />
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <EllipsisTooltipInput
                  errorMessage={_getErrorMessage(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.MINUS_DAYS}`
                  )}
                  {...getFieldProps(`${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.MINUS_DAYS}`)}
                  type="number"
                  disabled={disabled}
                  hideArrowTypeNumber
                  lengthShowTooltip={5}
                  style={{ ...commonInputColumnStyles, width: 60 }}
                />
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <EllipsisTooltipInput
                  errorMessage={_getErrorMessage(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.BUSINESS_DAYS}`
                  )}
                  {...getFieldProps(`${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.BUSINESS_DAYS}`)}
                  type="number"
                  disabled
                  hideArrowTypeNumber
                  lengthShowTooltip={5}
                  style={{ ...commonInputColumnStyles, width: 60 }}
                />
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: 'M&IE',
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <EllipsisTooltipInputCurrency
                  {...getFieldProps(`${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.MISC_FAR}`)}
                  errorMessage={_getErrorMessage(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.MISC_FAR}`
                  )}
                  onChange={setFieldValue}
                  textAlign="right"
                  lengthShowTooltip={7}
                  disabled={disabled}
                  style={{ ...commonInputColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <EllipsisTooltipInputCurrency
                  {...getFieldProps(`${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.MISC_ESTIMATED}`)}
                  errorMessage={_getErrorMessage(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.MISC_ESTIMATED}`
                  )}
                  onChange={setFieldValue}
                  textAlign="right"
                  lengthShowTooltip={7}
                  disabled={disabled}
                  style={{ ...commonInputColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <EllipsisTooltipInputCurrency
                  {...getFieldProps(`${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.MISC_EXCESS}`)}
                  errorMessage={_getErrorMessage(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.MISC_EXCESS}`
                  )}
                  onChange={setFieldValue}
                  textAlign="right"
                  lengthShowTooltip={7}
                  disabled
                  style={{ ...commonInputColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <EllipsisTooltipInput
                  errorMessage={_getErrorMessage(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.MISC_DAYS_CLAIM}`
                  )}
                  {...getFieldProps(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.MISC_DAYS_CLAIM}`
                  )}
                  type="number"
                  disabled={disabled}
                  hideArrowTypeNumber
                  lengthShowTooltip={5}
                  style={{ ...commonInputColumnStyles, width: 60 }}
                />
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <EllipsisTooltipInputCurrency
                  {...getFieldProps(`${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.MISC_COST}`)}
                  errorMessage={_getErrorMessage(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.MISC_COST}`
                  )}
                  onChange={setFieldValue}
                  textAlign="right"
                  lengthShowTooltip={7}
                  disabled
                  style={{ ...commonInputColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonColumnStyles },
            },
          ],
        },
        {
          columns: [
            {
              content: '',
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <Stack direction={'row'}>
                  <Button
                    style={{
                      maxWidth: '56px',
                      minWidth: '56px',
                      marginRight: '2px',
                    }}
                    onClick={() => handleAddItineraryRow(index)}
                    disabled={disabled}
                  >
                    <Stack direction={'row'}>
                      <Add fontSize={'small'} sx={{ p: 0, m: 0 }} />
                      <p>Add</p>
                    </Stack>
                  </Button>
                  <Button
                    style={{
                      maxWidth: '56px',
                      minWidth: '56px',
                    }}
                    onClick={() => handleRemoveItineraryRow(index)}
                    disabled={disabled || itinerariesValue.length < 2}
                  >
                    <Stack direction={'row'}>
                      <Delete fontSize={'small'} sx={{ p: 0, m: 0 }} />
                      <p>Del</p>
                    </Stack>
                  </Button>
                </Stack>
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: 'Dep',
              style: { ...commonColumnStyles, maxWidth: 20 },
            },
            {
              content: (
                <Box maxWidth={200}>
                  <DatePicker
                    errorMessage={_getErrorMessage(
                      `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.DEPARTURE_DATE}`
                    )}
                    {...getFieldProps(
                      `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.DEPARTURE_DATE}`
                    )}
                    onChange={handleDepartureDateChange}
                    selected={
                      getFieldProps(`${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.DEPARTURE_DATE}`)
                        .value
                    }
                    disabled={disabled}
                    showTimeSelect
                    dateFormat={DatePickerDateTimeFormat}
                    timeIntervals={10}
                    hideIcon
                    placeholder=""
                    classNames="pl-2 pr-2"
                    isClearable
                  />
                </Box>
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: '',
              style: { ...commonColumnStyles },
            },
            {
              content: '',
              style: { ...commonColumnStyles },
            },
            {
              content: '',
              style: { ...commonColumnStyles },
            },
            {
              content: 'Lodging',
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <EllipsisTooltipInputCurrency
                  {...getFieldProps(`${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.LODGING_FAR}`)}
                  errorMessage={_getErrorMessage(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.LODGING_FAR}`
                  )}
                  onChange={setFieldValue}
                  textAlign="right"
                  lengthShowTooltip={7}
                  disabled={disabled}
                  style={{ ...commonInputColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <EllipsisTooltipInputCurrency
                  {...getFieldProps(`${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.LODGING_RATE}`)}
                  errorMessage={_getErrorMessage(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.LODGING_RATE}`
                  )}
                  onChange={setFieldValue}
                  textAlign="right"
                  lengthShowTooltip={7}
                  disabled
                  style={{ ...commonInputColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <EllipsisTooltipInputCurrency
                  {...getFieldProps(`${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.LODGING_EXCESS}`)}
                  errorMessage={_getErrorMessage(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.LODGING_EXCESS}`
                  )}
                  onChange={setFieldValue}
                  textAlign="right"
                  lengthShowTooltip={7}
                  disabled
                  style={{ ...commonInputColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <EllipsisTooltipInput
                  errorMessage={_getErrorMessage(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.LODGING_DAYS_CLAIM}`
                  )}
                  {...getFieldProps(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.LODGING_DAYS_CLAIM}`
                  )}
                  type="number"
                  disabled={disabled}
                  hideArrowTypeNumber
                  lengthShowTooltip={5}
                  style={{ ...commonInputColumnStyles, width: 60 }}
                />
              ),
              style: { ...commonColumnStyles },
            },
            {
              content: (
                <EllipsisTooltipInputCurrency
                  {...getFieldProps(`${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.LODGING_COST}`)}
                  errorMessage={_getErrorMessage(
                    `${prefixItinerary}.${ITINERARY_ITEM_FORM_KEY.LODGING_COST}`
                  )}
                  onChange={setFieldValue}
                  textAlign="right"
                  lengthShowTooltip={7}
                  disabled={disabled}
                  style={{ ...commonInputColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonColumnStyles, paddingRight: '4px' },
            },
          ],
        },
      ];

      return [...prevRows, ...currentItineraryRows];
    },
    []
  );

  const endArrivalRow: BodyRow = {
    columns: [
      {
        content: 'End',
        style: { ...commonColumnStyles },
      },
      {
        content: (
          <EllipsisTooltipInput
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.END_DESTINATION)}
            {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.END_DESTINATION)}
            disabled={disabled}
            style={{ ...commonInputColumnStyles, maxWidth: 115, minWidth: 115 }}
            placeholder="City, State"
            lengthShowTooltip={10}
          />
        ),
        style: { ...commonColumnStyles },
      },
      {
        content: 'Arr',
        style: { ...commonColumnStyles },
      },
      {
        content: (
          <Box maxWidth={200}>
            <DatePicker
              errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.END_ARRIVAL_DATE)}
              {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.END_ARRIVAL_DATE)}
              onChange={handleDepartureDateChange}
              selected={values.endArrivalDate}
              disabled={disabled}
              showTimeSelect
              dateFormat={DatePickerDateTimeFormat}
              timeIntervals={10}
              hideIcon
              placeholder=""
              classNames="pl-2 pr-2"
              isClearable
            />
          </Box>
        ),
        style: { ...commonColumnStyles },
      },
      ...Array(6).fill({
        content: '',
        style: { ...commonColumnStyles },
      }),
      {
        content: <b>TOTALS</b>,
        colSpan: 2,
        style: {
          textAlign: 'right',
        },
      },
      {
        content: (
          <EllipsisTooltipInputCurrency
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.TRIP_TOTAL)}
            {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.TRIP_TOTAL)}
            onChange={setFieldValue}
            textAlign="right"
            lengthShowTooltip={7}
            disabled
            style={{ ...commonInputColumnStyles, width: 110 }}
          />
        ),
        style: { ...commonColumnStyles, paddingRight: '4px' },
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h5" textAlign={'center'} p={2}>
        TRIP ITINERARY
      </Typography>

      {/* Hidden input for scroll to error purpose */}
      <input name={NON_EMPLOYEE_TRAVEL_FORM_KEY.ITINERARIES} hidden />
      <CustomTable.Layout
        bodyList={[headerRow, startDepartureRow, ...itinerariesRows, endArrivalRow]}
      />
    </Box>
  );
};

type Props = {
  formikProps: UpsertNonEmployeeTravelFormikProps;
  disabled?: boolean;
  currentMode?: PO_MODE;
};

export default memo(TripItinerary, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    NON_EMPLOYEE_TRAVEL_FORM_KEY.START_DESTINATION,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.START_DEPARTURE_DATE,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.ITINERARIES,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.END_DESTINATION,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.END_ARRIVAL_DATE,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.TRIP_TOTAL,
  ];

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentMode === nextProps.currentMode &&
    isEqualPrevAndNextFormikValues({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
