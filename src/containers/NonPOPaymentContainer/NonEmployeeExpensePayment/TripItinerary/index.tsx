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
import {
  calculateDataOfItineraries,
  commonInputItineraryColumnStyles,
  commonItineraryColumnStyles,
  headerRow,
} from './helpers';

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
    const itinerariesTotal = updatedItineraries.reduce((total, itinerary) => {
      return total + Number(itinerary.miscCost || 0) + Number(itinerary.lodgingCost || 0);
    }, 0);

    setFieldValue(`${NON_EMPLOYEE_TRAVEL_FORM_KEY.ITINERARIES}`, updatedItineraries);
    setFieldValue(`${NON_EMPLOYEE_TRAVEL_FORM_KEY.TRIP_TOTAL}`, itinerariesTotal);
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
        style: { ...commonItineraryColumnStyles },
      },
      {
        content: (
          <EllipsisTooltipInput
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.START_DESTINATION)}
            {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.START_DESTINATION)}
            disabled={disabled}
            style={{ ...commonInputItineraryColumnStyles, maxWidth: 115, minWidth: 115 }}
            placeholder="City, State"
            lengthShowTooltip={10}
          />
        ),
        style: { ...commonItineraryColumnStyles },
      },
      {
        content: 'Dep',
        style: { ...commonItineraryColumnStyles },
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
        style: { ...commonItineraryColumnStyles },
      },
      ...Array(9).fill({
        content: '',
        style: { ...commonItineraryColumnStyles },
      }),
    ],
  };

  const itinerariesRows: BodyRow[] = itinerariesValue.reduce(
    (prevRows, currentItinerary, index) => {
      const prefixItinerary = `${NON_EMPLOYEE_TRAVEL_FORM_KEY.ITINERARIES}.${index}`;

      // an itinerary will take 2 row
      const currentItineraryRows: BodyRow[] = [
        {
          columns: [
            {
              content: `${index + 1}`,
              style: { ...commonItineraryColumnStyles },
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
                  style={{ ...commonInputItineraryColumnStyles, maxWidth: 115, minWidth: 115 }}
                  placeholder="City, State"
                  lengthShowTooltip={10}
                />
              ),
              style: { ...commonItineraryColumnStyles },
            },
            {
              content: 'Arr',
              style: { ...commonItineraryColumnStyles, maxWidth: 20 },
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
              style: { ...commonItineraryColumnStyles },
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
                  style={{ ...commonInputItineraryColumnStyles, width: 60 }}
                />
              ),
              style: { ...commonItineraryColumnStyles },
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
                  style={{ ...commonInputItineraryColumnStyles, width: 60 }}
                />
              ),
              style: { ...commonItineraryColumnStyles },
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
                  style={{ ...commonInputItineraryColumnStyles, width: 60 }}
                />
              ),
              style: { ...commonItineraryColumnStyles },
            },
            {
              content: 'M&IE',
              style: { ...commonItineraryColumnStyles },
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
                  style={{ ...commonInputItineraryColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonItineraryColumnStyles },
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
                  style={{ ...commonInputItineraryColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonItineraryColumnStyles },
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
                  style={{ ...commonInputItineraryColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonItineraryColumnStyles },
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
                  style={{ ...commonInputItineraryColumnStyles, width: 60 }}
                />
              ),
              style: { ...commonItineraryColumnStyles },
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
                  style={{ ...commonInputItineraryColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonItineraryColumnStyles },
            },
          ],
        },
        {
          columns: [
            {
              content: '',
              style: { ...commonItineraryColumnStyles },
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
                    disabled={itinerariesValue.length < 2}
                  >
                    <Stack direction={'row'}>
                      <Delete fontSize={'small'} sx={{ p: 0, m: 0 }} />
                      <p>Del</p>
                    </Stack>
                  </Button>
                </Stack>
              ),
              style: { ...commonItineraryColumnStyles },
            },
            {
              content: 'Dep',
              style: { ...commonItineraryColumnStyles, maxWidth: 20 },
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
              style: { ...commonItineraryColumnStyles },
            },
            {
              content: '',
              style: { ...commonItineraryColumnStyles },
            },
            {
              content: '',
              style: { ...commonItineraryColumnStyles },
            },
            {
              content: '',
              style: { ...commonItineraryColumnStyles },
            },
            {
              content: 'Lodging',
              style: { ...commonItineraryColumnStyles },
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
                  style={{ ...commonInputItineraryColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonItineraryColumnStyles },
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
                  style={{ ...commonInputItineraryColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonItineraryColumnStyles },
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
                  style={{ ...commonInputItineraryColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonItineraryColumnStyles },
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
                  style={{ ...commonInputItineraryColumnStyles, width: 60 }}
                />
              ),
              style: { ...commonItineraryColumnStyles },
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
                  style={{ ...commonInputItineraryColumnStyles, width: 110 }}
                />
              ),
              style: { ...commonItineraryColumnStyles, paddingRight: '4px' },
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
        style: { ...commonItineraryColumnStyles },
      },
      {
        content: (
          <EllipsisTooltipInput
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.END_DESTINATION)}
            {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.END_DESTINATION)}
            disabled={disabled}
            style={{ ...commonInputItineraryColumnStyles, maxWidth: 115, minWidth: 115 }}
            placeholder="City, State"
            lengthShowTooltip={10}
          />
        ),
        style: { ...commonItineraryColumnStyles },
      },
      {
        content: 'Arr',
        style: { ...commonItineraryColumnStyles },
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
        style: { ...commonItineraryColumnStyles },
      },
      ...Array(6).fill({
        content: '',
        style: { ...commonItineraryColumnStyles },
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
            style={{ ...commonInputItineraryColumnStyles, width: 110 }}
          />
        ),
        style: { ...commonItineraryColumnStyles, paddingRight: '4px' },
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h5" textAlign={'center'} p={1}>
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
