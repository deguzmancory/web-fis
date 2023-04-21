import { Box, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { UpsertAuthorizationPaymentFormikProps } from '../types';
import { Input, InputUSPhone, Link, Select, TextareaAutosize } from 'src/components/common';
import { getErrorMessage } from 'src/utils';
import { isCreateMode, isPiSuEditMode } from 'src/queries/PurchaseOrders/helpers';
import React from 'react';
import usePOSearchVender, {
  SearchVendorsType,
} from 'src/containers/PurchaseOrderContainer/PO/GeneralInfo/hooks/usePOSearchVender';
import {
  getVendorAddress,
  getVendorNameOrVendorCodeOptions,
} from 'src/containers/PurchaseOrderContainer/PO/GeneralInfo/helpers';
import { debounce, isString } from 'lodash';
import { Add } from '@mui/icons-material';
import { SelectOption } from 'src/components/common/Select';
import { Vendor } from 'src/queries';
import {
  VENDOR_REGISTRATION_NAVIGATE_FROM,
  VENDOR_REGISTRATION_PARAMS,
} from 'src/containers/Vendors/VendorRegistration/enums';
import { Navigator } from 'src/services';
import { setFormData } from 'src/redux/form/formSlice';
import { PATHS } from 'src/appConfig/paths';
import { useDispatch } from 'react-redux';
import { AUTHORIZATION_FOR_PAYMENT_KEY } from '../enum';

const GeneralInfo: React.FC<Props> = ({ formikProps, disabled = false, currentMode }) => {
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

  const currentVendorName = React.useMemo(() => values.vendorName, [values.vendorName]);
  const currentVendorCode = React.useMemo(() => values.vendorCode, [values.vendorCode]);

  const {
    isLoadingSearchVendors,
    searchedVendorNameOptions,
    searchedVendorCodeOptions,
    setSearchVendors,
  } = usePOSearchVender({ currentVendorName, currentVendorCode });

  const vendorNameOptions = React.useMemo(() => {
    return getVendorNameOrVendorCodeOptions({
      isLoadingSearchVendors,
      searchedVendorNameOrCodeOptions: searchedVendorNameOptions,
      currentVendorNameOrCode: currentVendorName,
    });
  }, [isLoadingSearchVendors, searchedVendorNameOptions, currentVendorName]);

  const vendorCodeOptions = React.useMemo(() => {
    return getVendorNameOrVendorCodeOptions({
      isLoadingSearchVendors,
      searchedVendorNameOrCodeOptions: searchedVendorCodeOptions,
      currentVendorNameOrCode: currentVendorCode,
    });
  }, [isLoadingSearchVendors, searchedVendorCodeOptions, currentVendorCode]);

  const _getErrorMessage = (fieldName: AUTHORIZATION_FOR_PAYMENT_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const updateVendorFields = (value: Vendor) => {
    setFieldValue(AUTHORIZATION_FOR_PAYMENT_KEY.VENDOR_NAME, value);
    setFieldValue(AUTHORIZATION_FOR_PAYMENT_KEY.VENDOR_CODE, value);
    if (value) {
      const formattedAddress = getVendorAddress(value);
      setFieldValue(AUTHORIZATION_FOR_PAYMENT_KEY.VENDOR_ADDRESS, formattedAddress);
    } else {
      setFieldValue(AUTHORIZATION_FOR_PAYMENT_KEY.VENDOR_ADDRESS, '');
    }
  };

  const handleCreateNewVenderLinkClick = () => {
    const callingFromParam = `?${VENDOR_REGISTRATION_PARAMS.CALLING_FROM}=${VENDOR_REGISTRATION_NAVIGATE_FROM.NON_EMPLOYEE_TRAVEL_PAYMENT}`;
    const documentIdParam = !!id ? `&${VENDOR_REGISTRATION_PARAMS.DOCUMENT_ID}=${id}` : '';

    dispatch(setFormData(values));
    Navigator.navigate(`${PATHS.addVendorRegistration}${callingFromParam}${documentIdParam}`, {
      isFromForm: VENDOR_REGISTRATION_NAVIGATE_FROM.NON_EMPLOYEE_TRAVEL_PAYMENT,
    });
  };

  // Debouncing search vendors inputs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchVendorsInput = React.useCallback(
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
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Login Name'}
            errorMessage={_getErrorMessage(AUTHORIZATION_FOR_PAYMENT_KEY.LOGIN_NAME)}
            {...getUncontrolledFieldProps(AUTHORIZATION_FOR_PAYMENT_KEY.LOGIN_NAME)}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Date'}
            errorMessage={_getErrorMessage(AUTHORIZATION_FOR_PAYMENT_KEY.DATE)}
            {...getUncontrolledFieldProps(AUTHORIZATION_FOR_PAYMENT_KEY.DATE)}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Payment Req. No.'}
            errorMessage={_getErrorMessage(AUTHORIZATION_FOR_PAYMENT_KEY.REQUEST_NUMBER)}
            {...getUncontrolledFieldProps(AUTHORIZATION_FOR_PAYMENT_KEY.REQUEST_NUMBER)}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Select
            {...getFieldProps(AUTHORIZATION_FOR_PAYMENT_KEY.VENDOR_NAME)}
            errorMessage={_getErrorMessage(AUTHORIZATION_FOR_PAYMENT_KEY.VENDOR_NAME)}
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
            {...getFieldProps(AUTHORIZATION_FOR_PAYMENT_KEY.VENDOR_CODE)}
            errorMessage={_getErrorMessage(AUTHORIZATION_FOR_PAYMENT_KEY.VENDOR_CODE)}
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
            isDisabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextareaAutosize
            label={"Payee's Permanent Address, Street/PO Box, City, State, Zip"}
            errorMessage={_getErrorMessage(AUTHORIZATION_FOR_PAYMENT_KEY.VENDOR_ADDRESS)}
            {...getUncontrolledFieldProps(AUTHORIZATION_FOR_PAYMENT_KEY.VENDOR_ADDRESS)}
            disabled
            minRows={2}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Input
            label={'Document Number'}
            errorMessage={_getErrorMessage(AUTHORIZATION_FOR_PAYMENT_KEY.DOCUMENT_NUMBER)}
            {...getUncontrolledFieldProps(AUTHORIZATION_FOR_PAYMENT_KEY.DOCUMENT_NUMBER)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Input
            label={'Direct Inquiries on This Request To'}
            errorMessage={_getErrorMessage(AUTHORIZATION_FOR_PAYMENT_KEY.DIRECT_INQUIRIES_TO)}
            {...getUncontrolledFieldProps(AUTHORIZATION_FOR_PAYMENT_KEY.DIRECT_INQUIRIES_TO)}
            disabled={disabled}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputUSPhone
            label={'Phone Number'}
            errorMessage={_getErrorMessage(AUTHORIZATION_FOR_PAYMENT_KEY.PHONE_NUMBER)}
            {...getFieldProps(AUTHORIZATION_FOR_PAYMENT_KEY.PHONE_NUMBER)}
            onChange={setFieldValue}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Input
            label={'FA Staff to Review'}
            errorMessage={_getErrorMessage(AUTHORIZATION_FOR_PAYMENT_KEY.FA_STAFF_REVIEWER)}
            {...getUncontrolledFieldProps(AUTHORIZATION_FOR_PAYMENT_KEY.FA_STAFF_REVIEWER)}
            disabled={disabled}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpsertAuthorizationPaymentFormikProps;
  disabled?: boolean;
  currentMode;
};

export default GeneralInfo;
