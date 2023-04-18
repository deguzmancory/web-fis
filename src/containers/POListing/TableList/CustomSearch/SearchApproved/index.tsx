import { Search } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import CustomFilter from 'src/components/CustomFilter';
import { Checkbox, DateRangePicker, Input } from 'src/components/common';
import { PO_LIST_QUERY_KEY } from 'src/containers/POListing/enum';
import { getDate, getDateDisplay } from 'src/utils';
import {
  CustomFilterPOApprovedFormValue,
  CustomFilterPOApprovedQueryValue,
  PO_ALL_FORM_DOCUMENT_TYPE,
  PO_PAYMENT_TYPE,
  documentTypeApprovedOptions,
  emptySearchApprovedFormValue,
  paymentTypeOptions,
} from './helpers';

const SearchApproved = ({
  searchValues,
}: {
  searchValues: Partial<CustomFilterPOApprovedQueryValue>;
}) => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const handleSubmitSearchAndFilter = (values: CustomFilterPOApprovedFormValue) => {
    const { documentType, paymentType, ...searchInputValues } = values;
    const filterValues = { documentType, paymentType };

    Object.entries(filterValues).forEach(([key, value]) => {
      if (!isEmpty(value)) {
        query.set(key, value.join(','));
      } else {
        query.delete(key);
      }
    });

    Object.entries(searchInputValues).forEach(([key, value]) => {
      if (!!value) {
        if (Array.isArray(value)) {
          switch (key) {
            case PO_LIST_QUERY_KEY.CHECK_DATE: {
              if (value.length < 2 || !value[0] || !value[1]) {
                query.delete(PO_LIST_QUERY_KEY.CHECK_START_DATE);
                query.delete(PO_LIST_QUERY_KEY.CHECK_END_DATE);
                return;
              }
              query.set(PO_LIST_QUERY_KEY.CHECK_START_DATE, getDateDisplay(value[0]));
              query.set(PO_LIST_QUERY_KEY.CHECK_END_DATE, getDateDisplay(value[1]));
              return;
            }
            case PO_LIST_QUERY_KEY.FINAL_APPROVED_DATE: {
              if (value.length < 2 || !value[0] || !value[1]) {
                query.delete(PO_LIST_QUERY_KEY.FINAL_APPROVED_START_DATE);
                query.delete(PO_LIST_QUERY_KEY.FINAL_APPROVED_END_DATE);
                return;
              }
              query.set(PO_LIST_QUERY_KEY.FINAL_APPROVED_START_DATE, getDateDisplay(value[0]));
              query.set(PO_LIST_QUERY_KEY.FINAL_APPROVED_END_DATE, getDateDisplay(value[1]));
              return;
            }
            case PO_LIST_QUERY_KEY.PRINTED_DATE: {
              if (value.length < 2 || !value[0] || !value[1]) {
                query.delete(PO_LIST_QUERY_KEY.PRINTED_START_DATE);
                query.delete(PO_LIST_QUERY_KEY.PRINTED_END_DATE);
                return;
              }
              query.set(PO_LIST_QUERY_KEY.PRINTED_START_DATE, getDateDisplay(value[0]));
              query.set(PO_LIST_QUERY_KEY.PRINTED_END_DATE, getDateDisplay(value[1]));
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

  const initialFormValue: CustomFilterPOApprovedFormValue = React.useMemo(
    () => ({
      number: searchValues.number,
      projectNumber: searchValues.projectNumber,
      vendorName: searchValues.vendorName,
      paymentRequestNumber: searchValues.paymentRequestNumber,
      faReviewer: searchValues.faReviewer,
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
      printedDate:
        searchValues.printedStartDate && searchValues.printedEndDate
          ? [getDate(searchValues.printedStartDate), getDate(searchValues.printedEndDate)]
          : null,
      documentType: searchValues.documentType
        ? (searchValues.documentType.split(',') as PO_ALL_FORM_DOCUMENT_TYPE[])
        : [],
      paymentType: searchValues.paymentType
        ? (searchValues.paymentType.split(',') as PO_PAYMENT_TYPE[])
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
    setValues(emptySearchApprovedFormValue);

    Object.keys(emptySearchApprovedFormValue).forEach((key) => {
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
              label={'Search by PO Number'}
              placeholder="Search"
              {...getFieldProps(PO_LIST_QUERY_KEY.PO_NUMBER)}
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              label={'Search by Project #'}
              placeholder="Search"
              {...getFieldProps(PO_LIST_QUERY_KEY.PROJECT_NUMBER)}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              label={'Search by Vendor Name'}
              placeholder="Search"
              {...getFieldProps(PO_LIST_QUERY_KEY.VENDOR_NAME)}
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              label={'Search by Payment Request #'}
              placeholder="Search"
              {...getFieldProps(PO_LIST_QUERY_KEY.PAYMENT_REQUEST_NUMBER)}
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              label={'Search by FA Staff'}
              placeholder="Search"
              {...getFieldProps(PO_LIST_QUERY_KEY.FA_REVIEWER)}
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              label={'Search by PI Name'}
              placeholder="Search"
              {...getFieldProps(PO_LIST_QUERY_KEY.PI_NAME)}
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              label={'Check Number'}
              placeholder="Search"
              {...getFieldProps(PO_LIST_QUERY_KEY.CHECK_NUMBER)}
            />
          </Grid>

          <Grid container item xs={3.5}>
            <DateRangePicker
              label={'Check Date'}
              placeholder="From - To"
              {...getFieldProps(PO_LIST_QUERY_KEY.CHECK_DATE)}
              onChange={setFieldValue}
              selecteds={values.checkDate}
              monthsShown={2}
            />
          </Grid>
          <Grid item xs={3.5}>
            <DateRangePicker
              label={'Approved Date'}
              placeholder="From - To"
              {...getFieldProps(PO_LIST_QUERY_KEY.FINAL_APPROVED_DATE)}
              selecteds={values.finalApprovedDate}
              onChange={setFieldValue}
              monthsShown={2}
            />
          </Grid>
          <Grid item xs={3.5}>
            <DateRangePicker
              label={'Printed Date'}
              placeholder="From - To"
              {...getFieldProps(PO_LIST_QUERY_KEY.PRINTED_DATE)}
              selecteds={values.printedDate}
              onChange={setFieldValue}
              monthsShown={2}
            />
          </Grid>
          <Grid item xs={2}>
            {null}
          </Grid>
          <Grid item xs={12}>
            <Checkbox.Group
              label={
                <Typography variant="body2" fontWeight="bold">
                  Document Type
                </Typography>
              }
              {...getFieldProps(PO_LIST_QUERY_KEY.DOCUMENT_TYPE)}
              onChange={setFieldValue}
              columns={5}
              options={documentTypeApprovedOptions}
            />
          </Grid>
          <Grid item xs={12}>
            <Checkbox.Group
              label={
                <Typography variant="body2" fontWeight="bold">
                  Payment Type
                </Typography>
              }
              {...getFieldProps(PO_LIST_QUERY_KEY.PAYMENT_TYPE)}
              onChange={setFieldValue}
              columns={6}
              options={paymentTypeOptions}
            />
          </Grid>
        </Grid>
      }
    />
  );
};

export default SearchApproved;
