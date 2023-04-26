import { Box, Grid, Typography } from '@mui/material';
import { ChangeEvent, memo, useCallback, useEffect, useMemo } from 'react';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, CellType } from 'src/components/CustomTable/types';
import {
  Checkbox,
  DatePicker,
  EllipsisTooltipInput,
  EllipsisTooltipInputCurrency,
  Input,
  Link,
  TextareaAutosize,
} from 'src/components/common';
import { PO_MODE } from 'src/queries';
import {
  checkRowStateAndSetValue,
  getErrorMessage,
  isEqualPrevAndNextFormikValues,
} from 'src/utils';
import { NO_OPENER } from '../../../../appConfig/constants';
import { commonColumnStyles } from '../../shared/constants';
import { PERSONAL_AUTO_TRIP_ITEM_FORM_KEY } from '../enums';
import {
  initialPersonalAutomobileTripInfoItem,
  personalAutomobileTripItemColumnNames,
} from '../helpers/constants';
import {
  PersonalAutomobileFormValue,
  PersonalAutomobileFormikProps,
  PersonalAutomobileTripItemFormValue,
} from '../types';

const ProjectItems = <T extends PersonalAutomobileFormikProps>({
  formikProps,
  disabled,
  tripItemsPrefix,
  totalMilesPrefix,
  mileageRatePrefix,
  totalMileageClaimPrefix,
  totalParkingFeesPrefix,
  totalMilesParkingPrefix,
  companyPrefix,
  policyPrefix,
  expirationDatePrefix,
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

  const {
    tripInfos = [],
    milesTotal,
    mileageRate,
    parkingTotal,
    milesRateTotal,
    expirationDate,
  } = values || {};

  const lineItemsValue = useMemo(() => tripInfos, [tripInfos]);

  /**
   * Re-Calculate totals of Mileage Claim and Total Claim for Mileage and Parking
   */
  useEffect(() => {
    const totalMileageClaim = Number(milesTotal || 0) * Number(mileageRate || 0);
    setFieldValue(totalMileageClaimPrefix, totalMileageClaim);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [milesTotal, mileageRate]);

  useEffect(() => {
    const totalMilesParking = Number(parkingTotal) + Number(milesRateTotal);
    setFieldValue(totalMilesParkingPrefix, totalMilesParking);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parkingTotal, milesRateTotal]);
  /***************/

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const removeRow = useCallback(
    (index: number) => {
      setFieldValue(
        `${tripItemsPrefix}`,
        lineItemsValue.filter((_row, idx) => idx !== index)
      );
    },
    [lineItemsValue, tripItemsPrefix, setFieldValue]
  );

  const addNewRow = useCallback(() => {
    setFieldValue(`${tripItemsPrefix}`, [
      ...lineItemsValue,
      {
        ...initialPersonalAutomobileTripInfoItem,
      },
    ]);
  }, [lineItemsValue, tripItemsPrefix, setFieldValue]);

  const handleInputChange = ({ name, value, index }) => {
    checkRowStateAndSetValue<PersonalAutomobileTripItemFormValue>({
      name,
      value,
      index,
      records: lineItemsValue,
      columnKeys: personalAutomobileTripItemColumnNames,
      setFieldValue,
      onAddRow: addNewRow,
      onRemoveRow: removeRow,
    });
  };

  const updateTotalMiles = useCallback(
    ({
      lineItemRow,
      index,
    }: {
      lineItemRow: PersonalAutomobileTripItemFormValue;
      index: number;
    }) => {
      const milesTotal = lineItemsValue.reduce(
        (total, currItem, currIndex) =>
          index === currIndex
            ? total + Number(lineItemRow?.miles || 0)
            : total + Number(currItem?.miles || 0),
        0
      );

      setFieldValue(totalMilesPrefix, milesTotal || 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineItemsValue]
  );

  const handleTripMilesChange = useCallback(
    ({
      name,
      value,
      lineItemRow,
      key,
      index,
    }: {
      name: string;
      value: any;
      lineItemRow: PersonalAutomobileTripItemFormValue;
      key: PERSONAL_AUTO_TRIP_ITEM_FORM_KEY;
      index: number;
    }) => {
      checkRowStateAndSetValue<PersonalAutomobileTripItemFormValue>({
        name,
        value,
        index,
        records: lineItemsValue,
        columnKeys: personalAutomobileTripItemColumnNames,
        setFieldValue,
        onAddRow: addNewRow,
        onRemoveRow: removeRow,
        callback: () => {
          updateTotalMiles({
            index,
            lineItemRow: {
              ...lineItemRow,
              [key]: value,
            },
          });
        },
        removeCallback: () => {
          updateTotalMiles({
            index,
            lineItemRow: {
              ...lineItemRow,
              [key]: value,
            },
          });
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addNewRow, lineItemsValue, removeRow, updateTotalMiles]
  );

  const updateTotalParkingFees = useCallback(
    ({
      lineItemRow,
      index,
    }: {
      lineItemRow: PersonalAutomobileTripItemFormValue;
      index: number;
    }) => {
      const parkingFeesTotal = lineItemsValue.reduce(
        (total, currItem, currIndex) =>
          index === currIndex
            ? total + Number(lineItemRow?.parking || 0)
            : total + Number(currItem?.parking || 0),
        0
      );

      setFieldValue(totalParkingFeesPrefix, parkingFeesTotal || 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineItemsValue]
  );

  const handleParkingFeesChange = useCallback(
    ({
      name,
      value,
      lineItemRow,
      key,
      index,
    }: {
      name: string;
      value: any;
      lineItemRow: PersonalAutomobileTripItemFormValue;
      key: PERSONAL_AUTO_TRIP_ITEM_FORM_KEY;
      index: number;
    }) => {
      checkRowStateAndSetValue<PersonalAutomobileTripItemFormValue>({
        name,
        value,
        index,
        records: lineItemsValue,
        columnKeys: personalAutomobileTripItemColumnNames,
        setFieldValue,
        onAddRow: addNewRow,
        onRemoveRow: removeRow,
        callback: () => {
          updateTotalParkingFees({
            index,
            lineItemRow: {
              ...lineItemRow,
              [key]: value,
            },
          });
        },
        removeCallback: () => {
          updateTotalParkingFees({
            index,
            lineItemRow: {
              ...lineItemRow,
              [key]: value,
            },
          });
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addNewRow, lineItemsValue, removeRow, updateTotalMiles]
  );

  const lineItemRows: BodyBasicRows = lineItemsValue.map((lineItemRow, index) => {
    const prefixLineItem = `${tripItemsPrefix}.${index}`;
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
          label: 'Service Date',
          headerStyle: {
            ...commonColumnStyles,
          },
          content: (
            <Box width={145}>
              <DatePicker
                placeholder=""
                dateFormat="MM/dd/yyyy"
                {...getFieldProps(
                  `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_SERVICE_DATE}`
                )}
                selected={lineItemRow.serviceDate as Date}
                name={`${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_SERVICE_DATE}`}
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
          label: 'From *',
          content: (
            <Input
              {...getUncontrolledFieldProps(
                `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_FROM}`
              )}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_FROM}`
              )}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                const nameDescription = `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_FROM}`;
                const valueDescription = event.target.value;
                handleInputChange({
                  index,
                  name: nameDescription,
                  value: valueDescription,
                });
              }}
              required
              style={{ width: 100 }}
              disabled={disabled}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'To *',
          content: (
            <Input
              {...getUncontrolledFieldProps(
                `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_TO}`
              )}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_TO}`
              )}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                const nameDescription = `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_TO}`;
                const valueDescription = event.target.value;

                handleInputChange({
                  index,
                  name: nameDescription,
                  value: valueDescription,
                });
              }}
              required
              style={{ width: 100 }}
              disabled={disabled}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Purpose *',
          content: (
            <TextareaAutosize
              {...getUncontrolledFieldProps(
                `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_PURPOSE}`
              )}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_PURPOSE}`
              )}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                const nameDescription = `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_PURPOSE}`;
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
                width: 320,
              }}
              disabled={disabled}
            />
          ),
        },
        {
          type: CellType.DEFAULT,
          label: 'Round Trip',
          content: (
            <Checkbox.Item
              {...getFieldProps(
                `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_ROUND_FLAG}`
              )}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_ROUND_FLAG}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const { name, checked } = event.target || {};
                handleInputChange({
                  index,
                  name,
                  value: checked,
                });
              }}
              required
              style={{
                paddingTop: '8px',
                justifyContent: 'center',
              }}
              disabled={disabled}
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Parking Fees',
          headerStyle: {
            ...commonColumnStyles,
          },
          content: (
            <EllipsisTooltipInputCurrency
              {...getFieldProps(
                `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_PARKING}`
              )}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_PARKING}`
              )}
              onChange={(name, value) =>
                handleParkingFeesChange({
                  name,
                  value,
                  lineItemRow,
                  index,
                  key: PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_PARKING,
                })
              }
              hideEllipsisTooltip
              style={{ width: 80 }}
              disabled={disabled}
              required
            />
          ),
        },
        {
          type: CellType.INPUT,
          label: 'Miles',
          headerStyle: {
            ...commonColumnStyles,
          },
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(`${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_MILES}`)}
              errorMessage={_getErrorMessage(
                `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_MILES}`
              )}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleTripMilesChange({
                  name: `${prefixLineItem}.${PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_MILES}`,
                  value: event.target.value,
                  lineItemRow,
                  index,
                  key: PERSONAL_AUTO_TRIP_ITEM_FORM_KEY.TRIP_MILES,
                })
              }
              hideEllipsisTooltip
              maxLength={4}
              style={{ width: 130 }}
              disabled={disabled}
              required
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
      <input name={tripItemsPrefix} hidden />
      <CustomTable.Basic bodyList={lineItemRows} errorMessage={tableErrorMessage} />
      <Grid container mt={1} spacing={2}>
        <Grid item xs={6}>
          <Typography>
            I hereby certify that the above accounting is a true and correct record of mileage on my
            personal automobile used in the performance of my official duties in accordance with the
            RCUH rules and regulations governing official travel and transportation expenses. I
            further certify that I carry the minimum liability insurance as required by the Hawaii
            No-Fault Law with:
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container className="justify-flex-end">
            <Grid item xs={9} className="justify-flex-end">
              <Typography variant="body1" mr={2}>
                A. TOTAL MILES
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <EllipsisTooltipInput
                {...getFieldProps(totalMilesPrefix)}
                errorMessage={showTotalError ? _getErrorMessage(totalMilesPrefix) : ''}
                style={{ textAlign: 'right', marginRight: 10 }}
                disabled
                lengthShowTooltip={8}
              />
            </Grid>
            <Grid item xs={9} className="justify-flex-end" mt={1}>
              <Typography variant="body1" mr={2}>
                B. TOTAL MILEAGE RATE&nbsp;
                <Link
                  href="https://www.rcuh.com/document-library/2-000/travel-risk-management/attachment-12-current-rcuh-travel-rates/"
                  target={'_blank'}
                  rel={NO_OPENER}
                >
                  see current rates
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={3} mt={1}>
              <EllipsisTooltipInputCurrency
                {...getFieldProps(mileageRatePrefix)}
                errorMessage={showTotalError ? _getErrorMessage(mileageRatePrefix) : ''}
                onChange={setFieldValue}
                textAlign="right"
                style={{ marginRight: 10 }}
                lengthShowTooltip={8}
              />
            </Grid>
            <Grid item xs={9} className="justify-flex-end" mt={1}>
              <Typography variant="body1" mr={2}>
                C. TOTAL MILEAGE CLAIM (A x B)
              </Typography>
            </Grid>
            <Grid item xs={3} mt={1}>
              <EllipsisTooltipInputCurrency
                {...getFieldProps(totalMileageClaimPrefix)}
                errorMessage={showTotalError ? _getErrorMessage(totalMileageClaimPrefix) : ''}
                textAlign="right"
                style={{ marginRight: 10 }}
                lengthShowTooltip={8}
                disabled
              />
            </Grid>
            <Grid item xs={9} className="justify-flex-end" mt={1}>
              <Typography variant="body1" mr={2}>
                D. TOTAL PARKING FEES
              </Typography>
            </Grid>
            <Grid item xs={3} mt={1}>
              <EllipsisTooltipInputCurrency
                {...getFieldProps(totalParkingFeesPrefix)}
                errorMessage={showTotalError ? _getErrorMessage(totalParkingFeesPrefix) : ''}
                textAlign="right"
                style={{ marginRight: 10 }}
                lengthShowTooltip={8}
                disabled
              />
            </Grid>
            <Grid item xs={9} className="justify-flex-end" mt={1}>
              <Typography variant="body1" mr={2} fontWeight={700}>
                TOTAL CLAIM FOR MILEAGE AND PARKING (C+D)
              </Typography>
            </Grid>
            <Grid item xs={3} mt={1}>
              <EllipsisTooltipInputCurrency
                {...getFieldProps(totalMilesParkingPrefix)}
                errorMessage={showTotalError ? _getErrorMessage(totalMilesParkingPrefix) : ''}
                textAlign="right"
                style={{ marginRight: 10 }}
                lengthShowTooltip={8}
                disabled
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Input
            label={'Company'}
            errorMessage={_getErrorMessage(companyPrefix)}
            {...getUncontrolledFieldProps(companyPrefix)}
            required
          />
        </Grid>
        <Grid item xs={4} />
        <Grid item xs={4}>
          <Input
            label={'Policy Number'}
            errorMessage={_getErrorMessage(policyPrefix)}
            {...getUncontrolledFieldProps(policyPrefix)}
            required
          />
        </Grid>
        <Grid item xs={4}>
          <DatePicker
            label={'Expiration Date'}
            placeholder=""
            dateFormat="MM/dd/yyyy"
            {...getFieldProps(expirationDatePrefix)}
            errorMessage={_getErrorMessage(expirationDatePrefix)}
            selected={expirationDate ? new Date(expirationDate) : null}
            name={expirationDatePrefix}
            onChange={setFieldValue}
            onBlur={setFieldTouched}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props<T> = {
  formikProps: T;
  tripItemsPrefix: string;
  totalMilesPrefix: string;
  mileageRatePrefix: string;
  totalMileageClaimPrefix: string;
  totalParkingFeesPrefix: string;
  totalMilesParkingPrefix: string;
  companyPrefix: string;
  policyPrefix: string;
  expirationDatePrefix: string;
  title?: string;
  currentMode?: PO_MODE;
  disabled?: boolean;
  tableErrorMessage?: string;
  showTotalError?: boolean;
};

export default memo(ProjectItems, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    nextProps.tripItemsPrefix,
    nextProps.totalMilesPrefix,
    nextProps.mileageRatePrefix,
    nextProps.totalMileageClaimPrefix,
    nextProps.totalParkingFeesPrefix,
    nextProps.totalMilesParkingPrefix,
    nextProps.companyPrefix,
    nextProps.policyPrefix,
    nextProps.expirationDatePrefix,
  ];

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.tripItemsPrefix === nextProps.tripItemsPrefix &&
    prevProps.tableErrorMessage === nextProps.tableErrorMessage &&
    prevProps.showTotalError === nextProps.showTotalError &&
    prevProps.currentMode === nextProps.currentMode &&
    prevProps.totalMilesPrefix === nextProps.totalMilesPrefix &&
    prevProps.totalMileageClaimPrefix === nextProps.totalMileageClaimPrefix &&
    prevProps.totalParkingFeesPrefix === nextProps.totalParkingFeesPrefix &&
    prevProps.totalMilesParkingPrefix === nextProps.totalMilesParkingPrefix &&
    prevProps.companyPrefix === nextProps.companyPrefix &&
    prevProps.policyPrefix === nextProps.policyPrefix &&
    prevProps.expirationDatePrefix === nextProps.expirationDatePrefix &&
    isEqualPrevAndNextFormikValues<PersonalAutomobileFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
