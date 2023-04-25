import { Search } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash';
import { memo, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import CustomFilter from 'src/components/CustomFilter';
import { Checkbox, DateRangePicker, Input } from 'src/components/common';
import { NON_PO_PAYMENT_DOCUMENT_TYPE, PO_DETAIL_STATUS } from 'src/queries';
import { getDate, getDateDisplay, getEndOfDayDisplay, isoFormat } from 'src/utils';
import {
  CustomFilterNonPOFormValue,
  CustomFilterPOQueryValue,
  emptySearchPendingReviewApproveNonPOFormValue,
  nonPODocumentTypePendingApproveReviewOptions,
  nonPoStatusOptions,
} from './helpers';
import { NON_PO_LISTING_QUERY_KEY } from 'src/containers/NonPOListing/enum';

const SearchPendingReviewApprove = ({
  searchValues,
}: {
  searchValues: Partial<CustomFilterPOQueryValue>;
}) => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const handleSubmitSearchAndFilter = (values: CustomFilterNonPOFormValue) => {
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
            case NON_PO_LISTING_QUERY_KEY.MODIFIED_DATE: {
              if (value.length < 2 || !value[0] || !value[1]) {
                query.delete(NON_PO_LISTING_QUERY_KEY.MODIFIED_START_DATE);
                query.delete(NON_PO_LISTING_QUERY_KEY.MODIFIED_END_DATE);
                return;
              }

              query.set(
                NON_PO_LISTING_QUERY_KEY.MODIFIED_START_DATE,
                getDateDisplay(value[0], isoFormat)
              );
              query.set(
                NON_PO_LISTING_QUERY_KEY.MODIFIED_END_DATE,
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

  const initialFormValue: CustomFilterNonPOFormValue = useMemo(
    () => ({
      requestNumber: searchValues.requestNumber || '',
      documentNumber: searchValues.documentNumber || '',
      listedProjectNumber: searchValues.listedProjectNumber || '',
      vendorName: searchValues.vendorName || '',
      faStaffReviewer: searchValues.faStaffReviewer || '',
      piName: searchValues.piName || '',
      modifiedDate:
        searchValues.modifiedStartDate && searchValues.modifiedEndDate
          ? [getDate(searchValues.modifiedStartDate), getDate(searchValues.modifiedEndDate)]
          : null,

      documentType: searchValues.documentType
        ? (searchValues.documentType as NON_PO_PAYMENT_DOCUMENT_TYPE[])
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
    setValues(emptySearchPendingReviewApproveNonPOFormValue);

    Object.keys(emptySearchPendingReviewApproveNonPOFormValue).forEach((key) => {
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
            <DateRangePicker
              label={'Modified Date'}
              placeholder="Search"
              {...getFieldProps(NON_PO_LISTING_QUERY_KEY.MODIFIED_DATE)}
              onChange={setFieldValue}
              selecteds={values.modifiedDate}
            />
          </Grid>
          <Grid item xs={2}>
            {null}
          </Grid>
          <Grid item xs={12}>
            <Checkbox.Group
              label={'Document Type'}
              {...getFieldProps(NON_PO_LISTING_QUERY_KEY.DOCUMENT_TYPE)}
              onChange={setFieldValue}
              columns={4}
              options={nonPODocumentTypePendingApproveReviewOptions}
            />
          </Grid>
          <Grid item xs={12}>
            <Checkbox.Group
              label={'Status'}
              {...getFieldProps(NON_PO_LISTING_QUERY_KEY.STATUS)}
              onChange={setFieldValue}
              options={nonPoStatusOptions}
              columns={4}
            />
          </Grid>
        </Grid>
      }
    />
  );
};

export default memo(SearchPendingReviewApprove);
