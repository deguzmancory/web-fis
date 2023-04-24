import { Add } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import { debounce } from 'lodash';
import { FC, memo, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import {
  DatePicker,
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
import { NON_EMPLOYEE_TRAVEL_FORM_KEY } from '../enums';
import { UpsertNonEmployeeTravelFormikProps } from '../types';
import {
  isInGroup1Payee,
  isServiceProviderPayeeCategory,
} from 'src/queries/NonPOPayment/NonEmployeeTravel/helpers';

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

  const isPayee1Group = isInGroup1Payee(values.payeeCategory);

  const currentVendorName = useMemo(() => values.vendorName, [values.vendorName]);
  const currentVendorCode = useMemo(() => values.vendorCode, [values.vendorCode]);

  const {
    isLoadingSearchVendors,
    searchedVendorNameOptions,
    searchedVendorCodeOptions,
    setSearchVendors,
  } = usePOSearchVender({ currentVendorName, currentVendorCode });

  const vendorNameOptions = useMemo(() => {
    return getVendorNameOrVendorCodeOptions({
      isLoadingSearchVendors,
      searchedVendorNameOrCodeOptions: searchedVendorNameOptions,
      currentVendorNameOrCode: currentVendorName,
    });
  }, [isLoadingSearchVendors, searchedVendorNameOptions, currentVendorName]);

  const vendorCodeOptions = useMemo(() => {
    return getVendorNameOrVendorCodeOptions({
      isLoadingSearchVendors,
      searchedVendorNameOrCodeOptions: searchedVendorCodeOptions,
      currentVendorNameOrCode: currentVendorCode,
    });
  }, [isLoadingSearchVendors, searchedVendorCodeOptions, currentVendorCode]);

  const _getErrorMessage = (fieldName: NON_EMPLOYEE_TRAVEL_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleCreateNewVenderLinkClick = () => {
    const callingFromParam = `?${VENDOR_REGISTRATION_PARAMS.CALLING_FROM}=${VENDOR_REGISTRATION_NAVIGATE_FROM.NON_EMPLOYEE_TRAVEL_PAYMENT}`;
    const documentIdParam = !!id ? `&${VENDOR_REGISTRATION_PARAMS.DOCUMENT_ID}=${id}` : '';

    dispatch(setFormData(values));
    Navigator.navigate(`${PATHS.addVendorRegistration}${callingFromParam}${documentIdParam}`, {
      isFromForm: VENDOR_REGISTRATION_NAVIGATE_FROM.NON_EMPLOYEE_TRAVEL_PAYMENT,
    });
  };

  const updateVendorFields = (value: Vendor) => {
    setFieldValue(NON_EMPLOYEE_TRAVEL_FORM_KEY.VENDOR_NAME, value);
    setFieldValue(NON_EMPLOYEE_TRAVEL_FORM_KEY.VENDOR_CODE, value);
    if (value) {
      const formattedAddress = getVendorAddress(value);
      setFieldValue(NON_EMPLOYEE_TRAVEL_FORM_KEY.VENDOR_ADDRESS, formattedAddress);
    } else {
      setFieldValue(NON_EMPLOYEE_TRAVEL_FORM_KEY.VENDOR_ADDRESS, '');
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
        <Grid item xs={12} sm={8}>
          <Select
            {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.VENDOR_NAME)}
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.VENDOR_NAME)}
            onBlur={setFieldTouched}
            label={'Vendor Name'}
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
            isDisabled={disabled || isReviewMode}
            menuStyle={{
              width: '800px',
            }}
            labelStyle={{
              width: '65%',
            }}
            subLabelStyle={{
              width: '30%',
            }}
            footer={
              showActionLink ? (
                <Link
                  type="icon-link"
                  icon={<Add fontSize="small" />}
                  textVariant="body2"
                  onClick={handleCreateNewVenderLinkClick}
                >
                  Create New Vendor
                </Link>
              ) : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Select
            {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.VENDOR_CODE)}
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.VENDOR_CODE)}
            onBlur={setFieldTouched}
            label={'Vendor Code'}
            placeholder={'Search'}
            extraRequired
            options={vendorCodeOptions}
            isLoading={isLoadingSearchVendors}
            onInputChange={(value: string) => {
              debounceSearchVendorsInput('code', value);
            }}
            getOptionLabel={(option: SelectOption<Vendor | string>) => {
              return isString(option.value) ? option.value : option.value.code;
            }}
            customSelectedOptionValue={
              vendorCodeOptions.find(
                (option: SelectOption<Vendor>) => option.value?.code === values.vendorCode
              ) || null
            }
            filterOption={(_option, _inputValue) => {
              return true; //ignore default filter option by label
            }}
            menuStyle={{
              width: '800px',
            }}
            labelStyle={{
              width: '65%',
            }}
            subLabelStyle={{
              width: '30%',
            }}
            menuOptionPosition="right"
            hideSearchIcon
            isClearable={true}
            onChange={(_name, value) => updateVendorFields(value)}
            optionWithSubLabel
            isDisabled={disabled || isReviewMode}
          />
        </Grid>
        {isPayee1Group && (
          <Grid item xs={12} sm={6}>
            <Input
              label={'Position Title'}
              errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.POSITION_TITLE)}
              {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.POSITION_TITLE)}
              disabled={disabled || isReviewMode}
              required={isServiceProviderPayeeCategory(values.payeeCategory)}
              footer={
                <Typography variant="subtitle1">
                  (Job title with employing organization, Not RCUH, UH, or Project.) (if any)
                </Typography>
              }
            />
          </Grid>
        )}
        {isPayee1Group && (
          <Grid item xs={12} sm={6}>
            <Input
              label={'Employer'}
              errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.EMPLOYER)}
              {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.EMPLOYER)}
              disabled={disabled || isReviewMode}
              required={isServiceProviderPayeeCategory(values.payeeCategory)}
              footer={
                <Typography variant="subtitle1">
                  (Name of research institute/university/college or employer, Not RCUH, UH, or
                  Project.) (if any)
                </Typography>
              }
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <TextareaAutosize
            label={"Payee's Permanent Address, Street/PO Box, City, State, Zip"}
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.VENDOR_ADDRESS)}
            {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.VENDOR_ADDRESS)}
            disabled
            minRows={2}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Input
            label={'Document Number'}
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.DOCUMENT_NUMBER)}
            {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.DOCUMENT_NUMBER)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Input
            label={'FA Staff to Review'}
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.FA_STAFF_REVIEWER)}
            {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.FA_STAFF_REVIEWER)}
            disabled={disabled}
            required
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Input
            label={'Project Contact'}
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.PROJECT_CONTACT)}
            {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.PROJECT_CONTACT)}
            disabled={disabled || isReviewMode}
            required
            footer={
              <Typography variant="subtitle1">(Preparer's name and phone number.)</Typography>
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputUSPhone
            label={'Phone Number'}
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.PROJECT_CONTACT_PHONE)}
            {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.PROJECT_CONTACT_PHONE)}
            onChange={setFieldValue}
            disabled={disabled || isReviewMode}
            required
          />
        </Grid>
        {isPayee1Group && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6">Dates of Service: </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label={'Start Date'}
                errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.FROM_SERVICE_DATE)}
                {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.FROM_SERVICE_DATE)}
                onChange={setFieldValue}
                selected={values.fromServiceDate}
                disabled={disabled || isReviewMode}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label={'End Date'}
                errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.TO_SERVICE_DATE)}
                {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.TO_SERVICE_DATE)}
                onChange={setFieldValue}
                selected={values.toServiceDate}
                disabled={disabled || isReviewMode}
                required
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpsertNonEmployeeTravelFormikProps;
  disabled?: boolean;
  currentMode: PO_MODE;
};

// Always need the latest formikProps to jump to vendor page without losing data
export default memo(GeneralInfo);
