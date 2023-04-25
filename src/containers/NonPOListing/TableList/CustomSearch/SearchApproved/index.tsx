import { Search } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import CustomFilter from 'src/components/CustomFilter';
import { Checkbox, DateRangePicker, Input } from 'src/components/common';
import { getDate, getDateDisplay, getEndOfDayDisplay, isoFormat } from 'src/utils';
import {
  CustomFilterNonPOApprovedFormValue,
  CustomFilterNonPOApprovedQueryValue,
  documentTypeNonPOApprovedOptions,
  emptySearchNonPOApprovedFormValue,
} from './helpers';
import { NON_PO_LISTING_QUERY_KEY } from 'src/containers/NonPOListing/enum';
import {
  PO_PAYMENT_METHOD,
  paymentMethodOptions,
} from 'src/containers/POListing/TableList/CustomSearch/SearchApproved/helpers';
import { NON_PO_PAYMENT_DOCUMENT_TYPE } from 'src/queries';

const SearchApproved = ({
  searchValues,
}: {
  searchValues: Partial<CustomFilterNonPOApprovedQueryValue>;
}) => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const handleSubmitSearchAndFilter = (values: CustomFilterNonPOApprovedFormValue) => {
    const { documentType, paymentMethod, ...searchInputValues } = values;
    const filterValues = { documentType, paymentMethod };

    Object.entries(filterValues).forEach(([filterKey, filterValueItems]) => {
      if (!isEmpty(filterValueItems)) {
        query.delete(filterKey);
        filterValueItems.forEach((item) => {
          query.append(filterKey, item);
        });
      } else {
        query.delete(filterKey);
      }
    });

    Object.entries(searchInputValues).forEach(([key, value]) => {
      if (!!value) {
        if (Array.isArray(value)) {
          switch (key) {
            case NON_PO_LISTING_QUERY_KEY.CHECK_DATE: {
              if (value.length < 2 || !value[0] || !value[1]) {
                query.delete(NON_PO_LISTING_QUERY_KEY.CHECK_START_DATE);
                query.delete(NON_PO_LISTING_QUERY_KEY.CHECK_END_DATE);
                return;
              }
              query.set(
                NON_PO_LISTING_QUERY_KEY.CHECK_START_DATE,
                getDateDisplay(value[0], isoFormat)
              );
              query.set(
                NON_PO_LISTING_QUERY_KEY.CHECK_END_DATE,
                getEndOfDayDisplay(value[1], isoFormat)
              );
              return;
            }
            case NON_PO_LISTING_QUERY_KEY.FINAL_APPROVED_DATE: {
              if (value.length < 2 || !value[0] || !value[1]) {
                query.delete(NON_PO_LISTING_QUERY_KEY.FINAL_APPROVED_START_DATE);
                query.delete(NON_PO_LISTING_QUERY_KEY.FINAL_APPROVED_END_DATE);
                return;
              }
              query.set(
                NON_PO_LISTING_QUERY_KEY.FINAL_APPROVED_START_DATE,
                getDateDisplay(value[0], isoFormat)
              );
              query.set(
                NON_PO_LISTING_QUERY_KEY.FINAL_APPROVED_END_DATE,
                getEndOfDayDisplay(value[1], isoFormat)
              );
              return;
            }

            default:
              return;
          }
        }
        query.set(key, value);
      } else {
        query.delete(key);
      }
    });

    history.push({ search: query.toString() });
  };

  const initialFormValue: CustomFilterNonPOApprovedFormValue = React.useMemo(
    () => ({
      requestNumber: searchValues.requestNumber,
      documentNumber: searchValues.documentNumber,
      vendorName: searchValues.vendorName,
      listedProjectNumber: searchValues.listedProjectNumber,
      faStaffReviewer: searchValues.faStaffReviewer,
      piName: searchValues.piName,
      checkNumber: searchValues.checkNumber,
      checkDate:
        searchValues.checkStartDate && searchValues.checkEndDate
          ? [getDate(searchValues.checkStartDate), getDate(searchValues.checkEndDate)]
          : null,
      finalApprovedDate:
        searchValues.finalApprovedStartDate && searchValues.finalApprovedEndDate
          ? [
              getDate(searchValues.finalApprovedStartDate),
              getDate(searchValues.finalApprovedEndDate),
            ]
          : null,
      documentType: searchValues.documentType
        ? (searchValues.documentType as NON_PO_PAYMENT_DOCUMENT_TYPE[])
        : [],

      paymentMethod: searchValues.paymentMethod
        ? (searchValues.paymentMethod as PO_PAYMENT_METHOD[])
        : [],
    }),
    [searchValues]
  );

  const { values, setValues, setFieldValue, handleSubmit, getFieldProps } = useFormik({
    initialValues: initialFormValue,
    enableReinitialize: true,
    onSubmit: handleSubmitSearchAndFilter,
  });

  const handleClearAll = () => {
    setValues(emptySearchNonPOApprovedFormValue);

    Object.keys(emptySearchNonPOApprovedFormValue).forEach((key) => {
      query.delete(key);
    });

    history.push({ search: query.toString() });
  };

  return (
    <CustomFilter.Container
      title="Search"
      icon={<Search sx={{ color: COLOR_CODE.INFO }} />}
      clearVariant="outline"
      onApply={() => handleSubmit()}
      onClear={handleClearAll}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      disabledTransformOrigin
      formStyle={{ width: '912px' }}
      bodyStyle={{ width: '912px', maxWidth: '912px' }}
      filterForm={
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}>
            <Typography variant="h4" fontWeight="bold">
              Search
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Input
              label={'Search by Request Number'}
              placeholder="Search"
              {...getFieldProps(NON_PO_LISTING_QUERY_KEY.REQUEST_NUMBER)}
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              label={'Search by Document Number'}
              placeholder="Search"
              {...getFieldProps(NON_PO_LISTING_QUERY_KEY.DOCUMENT_NUMBER)}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              label={'Search by Vendor Name'}
              placeholder="Search"
              {...getFieldProps(NON_PO_LISTING_QUERY_KEY.VENDOR_NAME)}
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              label={'Search by Project Number'}
              placeholder="Search"
              {...getFieldProps(NON_PO_LISTING_QUERY_KEY.LISTED_PROJECT_NUMBER)}
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              label={'Search by FA Staff'}
              placeholder="Search"
              {...getFieldProps(NON_PO_LISTING_QUERY_KEY.FA_STAFF_REVIEWER)}
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              label={'Search by PI Name'}
              placeholder="Search"
              {...getFieldProps(NON_PO_LISTING_QUERY_KEY.PI_NAME)}
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              label={'Check Number'}
              placeholder="Search"
              {...getFieldProps(NON_PO_LISTING_QUERY_KEY.CHECK_NUMBER)}
            />
          </Grid>

          <Grid container item xs={3}>
            <DateRangePicker
              label={'Check Date'}
              placeholder="From - To"
              {...getFieldProps(NON_PO_LISTING_QUERY_KEY.CHECK_DATE)}
              onChange={setFieldValue}
              selecteds={values.checkDate}
            />
          </Grid>
          <Grid item xs={3}>
            <DateRangePicker
              label={'Approved Date'}
              placeholder="From - To"
              {...getFieldProps(NON_PO_LISTING_QUERY_KEY.FINAL_APPROVED_DATE)}
              selecteds={values.finalApprovedDate}
              onChange={setFieldValue}
            />
          </Grid>

          <Grid item xs={2}>
            {null}
          </Grid>
          <Grid item xs={12} container>
            <Checkbox.Group
              label={
                <Typography variant="body2" fontWeight="bold">
                  Document Type
                </Typography>
              }
              {...getFieldProps(NON_PO_LISTING_QUERY_KEY.DOCUMENT_TYPE)}
              onChange={setFieldValue}
              columns={4}
              options={documentTypeNonPOApprovedOptions}
            />
          </Grid>
          <Grid item xs={12}>
            <Checkbox.Group
              label={
                <Typography variant="body2" fontWeight="bold">
                  Payment Method
                </Typography>
              }
              {...getFieldProps(NON_PO_LISTING_QUERY_KEY.PAYMENT_METHOD)}
              onChange={setFieldValue}
              columns={4}
              options={paymentMethodOptions}
            />
          </Grid>
        </Grid>
      }
    />
  );
};

export default SearchApproved;
