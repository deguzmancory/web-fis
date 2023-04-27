import { Search } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import CustomFilter from 'src/components/CustomFilter';
import { Checkbox, DateRangePicker, Input } from 'src/components/common';
import {
  PO_LIST_QUERY_KEY,
  PURCHASING_LIST_WORK_FLOW_STATUS_KEY,
} from 'src/containers/POListing/enum';
import { getDate, getDateDisplay, getEndOfDayDisplay, isoFormat } from 'src/utils';
import { CustomFilterPOQueryValue } from '../SearchPendingReviewApprove/helpers';
import {
  CustomFilterPOPaymentAndChangeFormFormValue,
  PO_CHG_PMT_FORM_DOCUMENT_TYPE,
  documentTypePaymentAndChangeForm,
  emptySearchPaymentAndChangeFormValue,
} from './helpers';

const SearchPOChangePayment = ({
  searchValues,
  searchStatusText,
}: {
  searchValues: Partial<CustomFilterPOQueryValue>;
  searchStatusText: PURCHASING_LIST_WORK_FLOW_STATUS_KEY;
}) => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const handleSubmitSearchAndFilter = (values: CustomFilterPOPaymentAndChangeFormFormValue) => {
    const { documentType, ...searchInputValues } = values;

    Object.entries({ documentType }).forEach(([filterKey, filterValueItems]) => {
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
            case PO_LIST_QUERY_KEY.FINAL_APPROVED_DATE: {
              if (value.length < 2 || !value[0] || !value[1]) {
                query.delete(PO_LIST_QUERY_KEY.FINAL_APPROVED_START_DATE);
                query.delete(PO_LIST_QUERY_KEY.FINAL_APPROVED_END_DATE);
                return;
              }
              query.set(
                PO_LIST_QUERY_KEY.FINAL_APPROVED_START_DATE,
                getDateDisplay(value[0], isoFormat)
              );
              query.set(
                PO_LIST_QUERY_KEY.FINAL_APPROVED_END_DATE,
                getEndOfDayDisplay(value[1], isoFormat)
              );
              return;
            }
            case PO_LIST_QUERY_KEY.PRINTED_DATE: {
              if (value.length < 2 || !value[0] || !value[1]) {
                query.delete(PO_LIST_QUERY_KEY.PRINTED_START_DATE);
                query.delete(PO_LIST_QUERY_KEY.PRINTED_END_DATE);
                return;
              }
              query.set(PO_LIST_QUERY_KEY.PRINTED_START_DATE, getDateDisplay(value[0], isoFormat));
              query.set(
                PO_LIST_QUERY_KEY.PRINTED_END_DATE,
                getEndOfDayDisplay(value[1], isoFormat)
              );
              return;
            }
            case PO_LIST_QUERY_KEY.MODIFIED_DATE: {
              if (value.length < 2 || !value[0] || !value[1]) {
                query.delete(PO_LIST_QUERY_KEY.MODIFIED_START_DATE);
                query.delete(PO_LIST_QUERY_KEY.MODIFIED_END_DATE);
                return;
              }

              query.set(PO_LIST_QUERY_KEY.MODIFIED_START_DATE, getDateDisplay(value[0], isoFormat));
              query.set(
                PO_LIST_QUERY_KEY.MODIFIED_END_DATE,
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

  const initialFormValue: CustomFilterPOPaymentAndChangeFormFormValue = React.useMemo(
    () => ({
      number: searchValues.number || '',
      projectNumber: searchValues.projectNumber || '',
      vendorName: searchValues.vendorName || '',
      faReviewer: searchValues.faReviewer || '',
      piName: searchValues.piName || '',
      updatedAt:
        searchValues.modifiedStartDate && searchValues.modifiedEndDate
          ? [getDate(searchValues.modifiedStartDate), getDate(searchValues.modifiedEndDate)]
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
        ? (searchValues.documentType as PO_CHG_PMT_FORM_DOCUMENT_TYPE[])
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
    setValues(emptySearchPaymentAndChangeFormValue);

    Object.keys(emptySearchPaymentAndChangeFormValue).forEach((key) => {
      query.delete(key);
    });

    history.push({ search: query.toString() });
  };

  const isPOPayment = React.useMemo(() => {
    return searchStatusText === PURCHASING_LIST_WORK_FLOW_STATUS_KEY.OUTSTANDING_PO_DOCUMENTS;
  }, [searchStatusText]);

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
          <Grid item xs={2.5}>
            <Input
              label={'Search by FA Staff'}
              placeholder="Search"
              {...getFieldProps(PO_LIST_QUERY_KEY.FA_REVIEWER)}
            />
          </Grid>
          <Grid item xs={2.5}>
            <Input
              label={'Search by PI Name'}
              placeholder="Search"
              {...getFieldProps(PO_LIST_QUERY_KEY.PI_NAME)}
            />
          </Grid>
          {isPOPayment ? (
            <Grid item xs={3.5}>
              <DateRangePicker
                label={'Modified Date'}
                placeholder="From - To"
                {...getFieldProps(PO_LIST_QUERY_KEY.MODIFIED_DATE)}
                selecteds={values.updatedAt}
                onChange={setFieldValue}
                monthsShown={2}
              />
            </Grid>
          ) : (
            <>
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
            </>
          )}

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
              options={documentTypePaymentAndChangeForm}
            />
          </Grid>
        </Grid>
      }
    />
  );
};

export default React.memo(SearchPOChangePayment);
