import { Add } from '@mui/icons-material';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { debounce } from 'lodash';
import { FC, memo, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Checkbox, Input, InputPhone, Link, Select, TextareaAutosize } from 'src/components/common';
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
import { EmployeeStatus, PO_MODE, Vendor } from 'src/queries';
import { isCreateMode, isPiSuEditMode } from 'src/queries/PurchaseOrders/helpers';
import { setFormData } from 'src/redux/form/formSlice';
import { Navigator } from 'src/services';
import { getErrorMessage, isString } from 'src/utils';
import { NO_OPENER } from '../../../../appConfig/constants';
import { PERSONAL_AUTOMOBILE_FORM_KEY } from '../enums';
import { PersonalAutomobileFormikProps } from '../types';
import { EmployeeStatusOptions, UHBUNumberOptions, UHPRNumberOptions } from './helpers';

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
  console.log('🚀 ~ file: index.tsx:44 ~ errors:', errors);
  console.log('🚀 ~ file: index.tsx:52 ~ values:', values);

  // show action link only on create PO and PI SU edit mode of PO document
  const showActionLink = isCreateMode(currentMode) || isPiSuEditMode(currentMode);

  const isUHEmployeeStatus = values.employeeStatus === EmployeeStatus.UH;

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

  const _getErrorMessage = (fieldName: PERSONAL_AUTOMOBILE_FORM_KEY) => {
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

  const updateEmployeeStatusAndNumberFields = (name: string, value: string) => {
    setFieldValue(name, value);
    const { uhEmpNumber, rcuhEmpNumber } = (values.vendorName as Vendor) || {};
    return value === EmployeeStatus.RCUH
      ? setFieldValue(PERSONAL_AUTOMOBILE_FORM_KEY.EMPLOYEE_NUMBER, rcuhEmpNumber)
      : setFieldValue(PERSONAL_AUTOMOBILE_FORM_KEY.EMPLOYEE_NUMBER, uhEmpNumber);
  };

  const updateVendorFields = (value: Vendor) => {
    const { uhEmpNumber, ...rest } = value;
    setFieldValue(PERSONAL_AUTOMOBILE_FORM_KEY.VENDOR_NAME, value);
    setFieldValue(PERSONAL_AUTOMOBILE_FORM_KEY.VENDOR_CODE, value);
    setFieldValue(PERSONAL_AUTOMOBILE_FORM_KEY.EMPLOYEE_NUMBER, uhEmpNumber);
    if (value) {
      const formattedAddress = getVendorAddress(rest);
      setFieldValue(PERSONAL_AUTOMOBILE_FORM_KEY.VENDOR_ADDRESS, formattedAddress);
      setFieldValue(PERSONAL_AUTOMOBILE_FORM_KEY.EMPLOYEE_STATUS, '');
      setFieldValue(PERSONAL_AUTOMOBILE_FORM_KEY.EMPLOYEE_NUMBER, '');
    } else {
      setFieldValue(PERSONAL_AUTOMOBILE_FORM_KEY.VENDOR_ADDRESS, '');
    }
  };

  const handleChangeCheckboxValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target || {};
    setFieldValue(name, checked);
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
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Login Name'}
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.LOGIN_NAME)}
            {...getUncontrolledFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.LOGIN_NAME)}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Date'}
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.DATE)}
            {...getUncontrolledFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.DATE)}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Payment Req. No.'}
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.REQUEST_NUMBER)}
            {...getUncontrolledFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.REQUEST_NUMBER)}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Select
            {...getFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.VENDOR_NAME)}
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.VENDOR_NAME)}
            onBlur={setFieldTouched}
            label={'Employee Name'}
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
            {...getFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.VENDOR_CODE)}
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.VENDOR_CODE)}
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
          <Input
            label={'Position Title'}
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.POSITION_TITLE)}
            {...getUncontrolledFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.POSITION_TITLE)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Input
            label={'Document Number'}
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.DOCUMENT_NUMBER)}
            {...getUncontrolledFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.DOCUMENT_NUMBER)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Select
            required
            isClearable
            hideSearchIcon
            label={'Employee Status'}
            placeholder={'Select'}
            options={EmployeeStatusOptions}
            {...getFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.EMPLOYEE_STATUS)}
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.EMPLOYEE_STATUS)}
            onBlur={setFieldTouched}
            onChange={updateEmployeeStatusAndNumberFields}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Input
            label={'Employee Number'}
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.EMPLOYEE_NUMBER)}
            {...getUncontrolledFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.EMPLOYEE_NUMBER)}
            disabled
          />
        </Grid>
        {isUHEmployeeStatus ? (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Select
                required
                isClearable
                hideSearchIcon
                label={'UH BU Number'}
                placeholder={'Select'}
                options={UHBUNumberOptions}
                {...getFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.BU_NUMBER)}
                errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.BU_NUMBER)}
                onBlur={setFieldTouched}
                getOptionLabel={(option: SelectOption<Vendor | string>) => {
                  return isString(option.value) ? option.value : option.value.name;
                }}
                filterOption={(_option, _inputValue) => {
                  return true; //ignore default filter option by label
                }}
                onChange={setFieldValue}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Select
                required
                isClearable
                hideSearchIcon
                label={'UH PR Number'}
                placeholder={'Select'}
                options={UHPRNumberOptions}
                {...getFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.PR_NUMBER)}
                errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.PR_NUMBER)}
                onBlur={setFieldTouched}
                getOptionLabel={(option: SelectOption<Vendor | string>) => {
                  return isString(option.value) ? option.value : option.value.name;
                }}
                filterOption={(_option, _inputValue) => {
                  return true; //ignore default filter option by label
                }}
                onChange={setFieldValue}
              />
            </Grid>
          </>
        ) : (
          <Grid item sm={6} md={6} />
        )}

        <Grid item xs={12} sm={6}>
          <TextareaAutosize
            label={'Project Address'}
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.VENDOR_ADDRESS)}
            {...getUncontrolledFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.VENDOR_ADDRESS)}
            disabled
            minRows={2}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextareaAutosize
            label={`Traveler's Home Address (If claim from home)`}
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.TRAVELER_ADDRESS)}
            {...getUncontrolledFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.TRAVELER_ADDRESS)}
            minRows={2}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Checkbox.Item
            label={
              <Stack direction={'row'} alignItems="center">
                <Typography>
                  The principal investigator authorizes mileage claims from the employee's
                  residence. See&nbsp;
                </Typography>
                <Link
                  href="https://www.rcuh.com/2-000/2-600/2-602/"
                  target={'_blank'}
                  rel={NO_OPENER}
                >
                  RCUH Policy 2.602
                </Link>
              </Stack>
            }
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.MILEAGE_CLAIM_FLAG)}
            {...getFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.MILEAGE_CLAIM_FLAG)}
            onChange={handleChangeCheckboxValue}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Input
            label={'Direct Inquiries on This Request To'}
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.DIRECT_INQUIRIES_TO)}
            {...getUncontrolledFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.DIRECT_INQUIRIES_TO)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputPhone
            label={'Phone Number'}
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.PHONE_NUMBER)}
            {...getFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.PHONE_NUMBER)}
            onChange={setFieldValue}
            disabled={disabled}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Input
            label={'FA Staff to Review'}
            errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.FA_STAFF_REVIEWER)}
            {...getUncontrolledFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.FA_STAFF_REVIEWER)}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: PersonalAutomobileFormikProps;
  disabled?: boolean;
  currentMode: PO_MODE;
};

// Always need the latest formikProps to jump to vendor page without losing data
export default memo(GeneralInfo);
