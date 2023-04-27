import { Search } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash';
import React, { memo, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import CustomFilter from 'src/components/CustomFilter';
import { Checkbox, DateRangePicker, Input } from 'src/components/common';
import { PO_LIST_QUERY_KEY } from 'src/containers/POListing/enum';
import { PO_DETAIL_STATUS, PO_DOCUMENT_TYPE } from 'src/queries';
import { getDate, getDateDisplay, getEndOfDayDisplay, isoFormat } from 'src/utils';
import {
  CustomFilterPOFormValue,
  CustomFilterPOQueryValue,
  documentTypePendingApproveReviewOptions,
  emptySearchPendingReviewApproveFormValue,
  poStatusOptions,
} from './helpers';

const SearchPendingReviewApprove = ({
  searchValues,
}: {
  searchValues: Partial<CustomFilterPOQueryValue>;
}) => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const handleSubmitSearchAndFilter = (values: CustomFilterPOFormValue) => {
    const { status, documentType, ...searchInputValues } = values;
    const filterValues = { status, documentType };

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

  const initialFormValue: CustomFilterPOFormValue = useMemo(
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

      documentType: searchValues.documentType
        ? (searchValues.documentType as PO_DOCUMENT_TYPE[])
        : [],
      status: searchValues.status ? (searchValues.status as PO_DETAIL_STATUS[]) : [],
    }),
    [searchValues]
  );

  const { values, setValues, setFieldValue, handleSubmit, getFieldProps } = useFormik({
    initialValues: initialFormValue,
    enableReinitialize: true,
    onSubmit: handleSubmitSearchAndFilter,
  });

  const handleClearAll = () => {
    setValues(emptySearchPendingReviewApproveFormValue);

    Object.keys(emptySearchPendingReviewApproveFormValue).forEach((key) => {
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
          <Grid item xs={4}>
            <Input
              label={'Search by Vendor Name'}
              placeholder="Search"
              {...getFieldProps(PO_LIST_QUERY_KEY.VENDOR_NAME)}
            />
          </Grid>
          <Grid item xs={2}>
            {null}
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
          <Grid item xs={4}>
            <DateRangePicker
              label={'Modified Date'}
              placeholder="From - To"
              {...getFieldProps(PO_LIST_QUERY_KEY.MODIFIED_DATE)}
              onChange={setFieldValue}
              selecteds={values.updatedAt}
            />
          </Grid>
          <Grid item xs={2}>
            {null}
          </Grid>
          <Grid item xs={12}>
            <Checkbox.Group
              label={'Document Type'}
              {...getFieldProps(PO_LIST_QUERY_KEY.DOCUMENT_TYPE)}
              onChange={setFieldValue}
              columns={4}
              options={documentTypePendingApproveReviewOptions}
            />
          </Grid>
          <Grid item xs={12}>
            <Checkbox.Group
              label={'Status'}
              {...getFieldProps(PO_LIST_QUERY_KEY.STATUS)}
              onChange={setFieldValue}
              options={poStatusOptions}
              columns={4}
            />
          </Grid>
        </Grid>
      }
    />
  );
};

export default memo(SearchPendingReviewApprove);
