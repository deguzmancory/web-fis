import { Add } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import { debounce } from 'lodash';
import { FC, memo, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import {
  DatePicker,
  EllipsisTooltipInputCurrency,
  Input,
  InputUSPhone,
  Link,
  Select,
  TextareaAutosize,
} from 'src/components/common';
import { SelectOption } from 'src/components/common/Select';
import {
  getVendorAddress,
  getVendorNameOrVendorCodeOptions,
} from 'src/containers/PurchaseOrderContainer/PO/GeneralInfo/helpers';
import usePOSearchVender, {
  SearchVendorsType,
} from 'src/containers/PurchaseOrderContainer/PO/GeneralInfo/hooks/usePOSearchVender';
import {
  VENDOR_REGISTRATION_NAVIGATE_FROM,
  VENDOR_REGISTRATION_PARAMS,
} from 'src/containers/Vendors/VendorRegistration/enums';
import { PO_MODE, Vendor } from 'src/queries';
import {
  isCUReviewMode,
  isCreateMode,
  isFAReviewMode,
  isPiSuEditMode,
} from 'src/queries/PurchaseOrders/helpers';
import { setFormData } from 'src/redux/form/formSlice';
import { Navigator } from 'src/services';
import { getErrorMessage, isString } from 'src/utils';
import { PETTY_CASH_FORM_KEY } from '../enums';
import { UpsertPettyCashFormikProps } from '../types';
import RequiredSign from 'src/containers/shared/RequiredSign';

const GeneralInfo: FC<Props> = ({ formikProps, disabled = false, currentMode }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const {
    values,
    errors,
    touched,
    getUncontrolledFieldProps,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
  } = formikProps;

  // show action link only on create PO and PI SU edit mode of PO document
  const showActionLink = isCreateMode(currentMode) || isPiSuEditMode(currentMode);

  const isReviewMode = isFAReviewMode(currentMode) || isCUReviewMode(currentMode);

  const currentVendorName = useMemo(() => values.vendorName, [values.vendorName]);
  const currentVendorCode = useMemo(() => values.vendorCode, [values.vendorCode]);

  const { isLoadingSearchVendors, searchedVendorNameOptions, setSearchVendors } = usePOSearchVender(
    { currentVendorName, currentVendorCode }
  );

  const vendorNameOptions = useMemo(() => {
    return getVendorNameOrVendorCodeOptions({
      isLoadingSearchVendors,
      searchedVendorNameOrCodeOptions: searchedVendorNameOptions,
      currentVendorNameOrCode: currentVendorName,
    });
  }, [isLoadingSearchVendors, searchedVendorNameOptions, currentVendorName]);

  const _getErrorMessage = (fieldName: PETTY_CASH_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleCreateNewVenderLinkClick = () => {
    const callingFromParam = `?${VENDOR_REGISTRATION_PARAMS.CALLING_FROM}=${VENDOR_REGISTRATION_NAVIGATE_FROM.PETTY_CASH_PAYMENT}`;
    const documentIdParam = !!id ? `&${VENDOR_REGISTRATION_PARAMS.DOCUMENT_ID}=${id}` : '';

    dispatch(setFormData(values));
    Navigator.navigate(`${PATHS.addVendorRegistration}${callingFromParam}${documentIdParam}`, {
      isFromForm: VENDOR_REGISTRATION_NAVIGATE_FROM.PETTY_CASH_PAYMENT,
    });
  };

  const updateVendorFields = (value: Vendor) => {
    setFieldValue(PETTY_CASH_FORM_KEY.VENDOR_NAME, value);
    setFieldValue(PETTY_CASH_FORM_KEY.VENDOR_CODE, value);
    if (value) {
      const formattedAddress = getVendorAddress(value);
      setFieldValue(PETTY_CASH_FORM_KEY.VENDOR_ADDRESS, formattedAddress);
    } else {
      setFieldValue(PETTY_CASH_FORM_KEY.VENDOR_ADDRESS, '');
    }
  };

  // Debouncing search vendors inputs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchVendorsInput = useCallback(
    debounce((key: keyof SearchVendorsType, value: string) => {
      if (!value) return;

      setSearchVendors((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }, 300),
    []
  );

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Input
            label={'Login Name'}
            errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.LOGIN_NAME)}
            {...getUncontrolledFieldProps(PETTY_CASH_FORM_KEY.LOGIN_NAME)}
            disabled
          />
        </Grid>
        <Grid item xs={4}>
          <Input
            label={'Date'}
            errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.DATE)}
            {...getUncontrolledFieldProps(PETTY_CASH_FORM_KEY.DATE)}
            disabled
          />
        </Grid>
        <Grid item xs={4}>
          <Input
            label={'Payment Req. No.'}
            errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.REQUEST_NUMBER)}
            {...getUncontrolledFieldProps(PETTY_CASH_FORM_KEY.REQUEST_NUMBER)}
            disabled
          />
        </Grid>

        <Grid item container xs={6} spacing={2} mb={1}>
          <Grid item xs={6}>
            <DatePicker
              label={'Period Beginning'}
              errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.BEGIN_DATE)}
              {...getFieldProps(PETTY_CASH_FORM_KEY.BEGIN_DATE)}
              onChange={setFieldValue}
              selected={values.beginDate}
              disabled={disabled}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label={'Period Ending'}
              errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.END_DATE)}
              {...getFieldProps(PETTY_CASH_FORM_KEY.END_DATE)}
              onChange={setFieldValue}
              selected={values.endDate}
              disabled={disabled}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              label={'Project Name'}
              errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.PROJECT_NAME)}
              {...getUncontrolledFieldProps(PETTY_CASH_FORM_KEY.PROJECT_NAME)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <TextareaAutosize
              label={'Project Address, Street/PO Box, City, State, Zip'}
              errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.PROJECT_ADDRESS)}
              {...getUncontrolledFieldProps(PETTY_CASH_FORM_KEY.PROJECT_ADDRESS)}
              disabled={disabled}
              minRows={2}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              label={'Document Number'}
              errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.DOCUMENT_NUMBER)}
              {...getUncontrolledFieldProps(PETTY_CASH_FORM_KEY.DOCUMENT_NUMBER)}
              disabled={disabled}
            />
          </Grid>
        </Grid>

        <Grid item xs={0.5}>
          {}
        </Grid>

        <Grid item container xs={5.5} alignItems={'center'} display={'flex'} spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2">1. Petty Cash Advanced</Typography>
          </Grid>
          <Grid item xs={6}>
            <EllipsisTooltipInputCurrency
              label={''}
              errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.ADVANCED_CASH)}
              {...getFieldProps(PETTY_CASH_FORM_KEY.ADVANCED_CASH)}
              disabled={disabled}
              onChange={setFieldValue}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">2. Cash on Hand</Typography>
          </Grid>
          <Grid item xs={6}>
            <EllipsisTooltipInputCurrency
              label={''}
              errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.CASH_ON_HAND)}
              {...getFieldProps(PETTY_CASH_FORM_KEY.CASH_ON_HAND)}
              disabled={disabled}
              onChange={setFieldValue}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">3. Expense (original receipt attached)</Typography>
          </Grid>
          <Grid item xs={6}>
            <EllipsisTooltipInputCurrency
              label={''}
              errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.EXPENSES)}
              {...getFieldProps(PETTY_CASH_FORM_KEY.EXPENSES)}
              disabled={disabled}
              onChange={setFieldValue}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">4. Cash Reimbursement in Transit</Typography>
          </Grid>
          <Grid item xs={6}>
            <EllipsisTooltipInputCurrency
              label={''}
              errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.CASH_IN_TRANSIT)}
              {...getFieldProps(PETTY_CASH_FORM_KEY.CASH_IN_TRANSIT)}
              disabled={disabled}
              onChange={setFieldValue}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" mb={3}>
              TOTAL PETTY CASH (line 2, 3 & 4)
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <EllipsisTooltipInputCurrency
              label={''}
              errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.TOTAL_PETTY_CASH)}
              {...getFieldProps(PETTY_CASH_FORM_KEY.TOTAL_PETTY_CASH)}
              disabled
              onChange={setFieldValue}
              footer={<Typography variant="subtitle1">Must equal to line 1</Typography>}
            />
          </Grid>
        </Grid>

        <Grid item xs={2}>
          <Typography variant="body2">
            Make Check Payable to <RequiredSign />
            <RequiredSign />
            {showActionLink && (
              <Link
                type="icon-link"
                icon={<Add fontSize="small" />}
                textVariant="body2"
                onClick={handleCreateNewVenderLinkClick}
                className="mt-1"
              >
                Create New Vendor
              </Link>
            )}
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Select
            {...getFieldProps(PETTY_CASH_FORM_KEY.VENDOR_NAME)}
            errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.VENDOR_NAME)}
            onBlur={setFieldTouched}
            label={''}
            placeholder={'Search'}
            extraRequired
            options={vendorNameOptions}
            isLoading={isLoadingSearchVendors}
            onInputChange={(value: string) => {
              debounceSearchVendorsInput('name', value);
            }}
            getOptionLabel={(option: SelectOption<Vendor | string>) => {
              return isString(option.value) ? option.value : option.value.name;
            }}
            filterOption={(_option, _inputValue) => {
              return true; //ignore default filter option by label
            }}
            customSelectedOptionValue={
              vendorNameOptions.find(
                (option: SelectOption<Vendor>) => option.value?.name === values.vendorName
              ) || null
            }
            hideSearchIcon
            isClearable={true}
            onChange={(_name, value) => updateVendorFields(value)}
            optionWithSubLabel
            isDisabled={disabled}
            menuStyle={{
              width: '800px',
            }}
            labelStyle={{
              width: '65%',
            }}
            subLabelStyle={{
              width: '30%',
            }}
          />
        </Grid>
        <Grid item xs={2.2} mt={1}>
          <Typography variant="body2">, Custodian, in the amount of</Typography>
        </Grid>
        <Grid item xs={2.8}>
          <EllipsisTooltipInputCurrency
            label={''}
            errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.EXPENSES)}
            {...getFieldProps(PETTY_CASH_FORM_KEY.EXPENSES)}
            disabled
            onChange={setFieldValue}
            footer={<Typography variant="subtitle1">(Reference in line 3).</Typography>}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Input
            label={'Direct Inquiries on This Request To'}
            errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.DIRECT_INQUIRIES_TO)}
            {...getUncontrolledFieldProps(PETTY_CASH_FORM_KEY.DIRECT_INQUIRIES_TO)}
            disabled={disabled}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputUSPhone
            label={'Phone Number'}
            errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.PHONE_NUMBER)}
            {...getFieldProps(PETTY_CASH_FORM_KEY.PHONE_NUMBER)}
            onChange={setFieldValue}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Input
            label={'FA Staff to Review'}
            errorMessage={_getErrorMessage(PETTY_CASH_FORM_KEY.FA_STAFF_REVIEWER)}
            {...getUncontrolledFieldProps(PETTY_CASH_FORM_KEY.FA_STAFF_REVIEWER)}
            disabled={disabled}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpsertPettyCashFormikProps;
  disabled?: boolean;
  currentMode: PO_MODE;
};

// Always need the latest formikProps to jump to vendor page without losing data
export default memo(GeneralInfo);
