import { Add } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import { debounce } from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { PATHS } from 'src/appConfig/paths';
import { Input, InputPhone, Link, Select, TextareaAutosize } from 'src/components/common';
import { SelectOption } from 'src/components/common/Select';
import { VENDOR_REGISTRATION_NAVIGATE_FROM } from 'src/containers/Vendors/VendorRegistration/enums';
import { FinancialProject } from 'src/queries/Projects/types';
import { Vendor } from 'src/queries/Vendors';
import { showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { Navigator } from 'src/services';
import { getDateDisplay, getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { isEmpty } from 'src/validations';
import { PO_FORM_KEY, PO_MODE } from '../enums';
import { isCreatePOMode, isCUReviewPOMode, isFAReviewPOMode, isPiSuEditPOMode } from '../helpers';
import usePOSearchProject, { SearchProjectsType } from './hooks/usePOSearchProject';
import usePOSearchVender, { SearchVendorsType } from './hooks/usePOSearchVender';
import { UpsertPOFormikProps, UpsertPOFormValue } from '../types';
import { isVariousProject, shipViaOptions, VARIOUS_PROJECT_VALUE } from './helpers';
import SuperQuote from './superQuote';

const GeneralInfo: React.FC<Props> = ({ formikProps, disabled = false, currentPOMode }) => {
  const dispatch = useDispatch();
  const inReviewMode = isFAReviewPOMode(currentPOMode) || isCUReviewPOMode(currentPOMode);
  const showActionLink = isCreatePOMode(currentPOMode) || isPiSuEditPOMode(currentPOMode);

  const {
    values,
    errors,
    touched,
    getUncontrolledFieldProps,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
  } = formikProps;

  // ===============
  const currentProjectTitle = React.useMemo(() => values.projectTitle, [values.projectTitle]);
  const currentProjectNumber = React.useMemo(() => values.projectNumber, [values.projectNumber]);
  const currentVendorName = React.useMemo(() => values.vendorName, [values.vendorName]);
  const currentVendorCode = React.useMemo(() => values.vendorCode, [values.vendorCode]);

  // check for case vendor first mounted with data from get PO response
  // check for case vendor first mounted when just back from additional forms
  // do not check the project because strange behavior of default Various project => fetch project when did mount in usePOSearchProject hook
  const currentVendorNameInputValue =
    typeof currentVendorName === 'string' ? currentVendorName : currentVendorName?.name;
  const currentVendorCodeInputValue =
    typeof currentVendorCode === 'string' ? currentVendorCode : currentVendorCode?.code;

  const { setSearchProjects, isLoadingSearchProjects, projectTitleOptions, projectNumberOptions } =
    usePOSearchProject({ currentProjectTitle, currentProjectNumber });

  const {
    isClearedDefaultVendors,
    isLoadingSearchVendors,
    vendorNameOptions,
    vendorCodeOptions,
    setIsClearedDefaultVendors,
    setSearchVendors,
  } = usePOSearchVender({ currentVendorName, currentVendorCode });

  const haveVendorNameValueButOptions =
    !!currentVendorName && isEmpty(vendorNameOptions) && !isLoadingSearchVendors;
  const haveVendorCodeValueButOptions =
    !!currentVendorCode && isEmpty(vendorCodeOptions) && !isLoadingSearchVendors;
  // ==============

  const updateProjectFields = (value: FinancialProject) => {
    setFieldValue(PO_FORM_KEY.PROJECT_TITLE, value);
    setFieldValue(PO_FORM_KEY.PROJECT_NUMBER, value);
    setFieldValue(PO_FORM_KEY.PI_NAME, value?.piName || '');
    setFieldValue(
      PO_FORM_KEY.PROJECT_PERIOD,
      value
        ? isVariousProject(value.number)
          ? VARIOUS_PROJECT_VALUE
          : `${getDateDisplay(value.startDate)} - ${getDateDisplay(value.endDate)}`
        : ''
    );
  };

  const updateVendorFields = (value: Vendor) => {
    setFieldValue(PO_FORM_KEY.VENDOR_NAME, value);
    setFieldValue(PO_FORM_KEY.VENDOR_CODE, value);
    setFieldValue(PO_FORM_KEY.ADDRESS_1, value?.address1 || null);
    setFieldValue(PO_FORM_KEY.ADDRESS_2, value?.address2 || null);
    setFieldValue(PO_FORM_KEY.ADDRESS_3, value?.address3 || null);
    if (value) {
      const { name2, address1, address2, address3 } = value || {};
      const formattedAddress = `${name2 && `${name2}\n`}${address1 && `${address1}\n`}${
        address2 && `${address2}\n`
      }${address3}`;

      setFieldValue(PO_FORM_KEY.VENDOR_ADDRESS, formattedAddress);
    } else {
      setFieldValue(PO_FORM_KEY.VENDOR_ADDRESS, '');
    }
  };

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleCreateNewVenderLinkClick = () => {
    Navigator.navigate(`${PATHS.addVendorRegistration}?calling`, {
      isFromForm: VENDOR_REGISTRATION_NAVIGATE_FROM.PO,
    });
  };

  const handleImportSuperQuoteClick = () => {
    if (disabled || inReviewMode) return;

    dispatch(
      showDialog({
        type: DIALOG_TYPES.CONTENT_DIALOG,
        data: {
          title: 'Import Data from SuperQUOTE',
          content: <SuperQuote formikProps={formikProps} disabled={disabled} />,
          showTitleDivider: true,
          hideFooter: true,
        },
      })
    );
  };

  // Debouncing search projects inputs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchProjectsInput = React.useCallback(
    debounce((key: keyof SearchProjectsType, value: string) => {
      if (!value) return;

      setSearchProjects((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }, 300),
    []
  );

  // Debouncing search vendors inputs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchVendorsInput = React.useCallback(
    debounce((key: keyof SearchVendorsType, value: string) => {
      if (!value) {
        if (haveVendorCodeValueButOptions || haveVendorNameValueButOptions) {
          setIsClearedDefaultVendors(true);
          updateVendorFields(null);
        }

        return;
      }

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
        <Grid item container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Date'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.DATE)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.DATE)}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Purchase Order No.'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.NUMBER)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.NUMBER)}
              placeholder={'To be assigned'}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Select
              {...getFieldProps(PO_FORM_KEY.PROJECT_TITLE)}
              errorMessage={_getErrorMessage(PO_FORM_KEY.PROJECT_TITLE)}
              onBlur={setFieldTouched}
              label={'Project Title'}
              placeholder={'Search'}
              extraRequired
              options={projectTitleOptions}
              isLoading={isLoadingSearchProjects}
              onInputChange={(value: string) => {
                debounceSearchProjectsInput('title', value);
              }}
              getOptionLabel={(option: SelectOption<FinancialProject>) => {
                return option.value.name;
              }}
              customSelectedOptionValue={
                projectNumberOptions.find(
                  (option: SelectOption<FinancialProject>) =>
                    option.value?.name === values.projectTitle
                ) || null
              }
              filterOption={(_option, _inputValue) => {
                return true; //ignore default filter option by label
              }}
              hideSearchIcon
              isClearable={true}
              onChange={(_name, value) => updateProjectFields(value)}
              optionWithSubLabel
              isDisabled={disabled || inReviewMode}
              footer={
                <Typography variant="body2">
                  Use “Various" if you want to use multiple projects.
                </Typography>
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Select
              {...getFieldProps(PO_FORM_KEY.PROJECT_NUMBER)}
              errorMessage={_getErrorMessage(PO_FORM_KEY.PROJECT_NUMBER)}
              onBlur={setFieldTouched}
              label={'Project #'}
              placeholder={'Search'}
              extraRequired
              options={projectNumberOptions}
              isLoading={isLoadingSearchProjects}
              onInputChange={(value: string) => {
                debounceSearchProjectsInput('number', value);
              }}
              getOptionLabel={(option: SelectOption<FinancialProject>) => {
                return option.value.number;
              }}
              customSelectedOptionValue={
                projectNumberOptions.find(
                  (option: SelectOption<FinancialProject>) =>
                    option.value?.number === values.projectNumber
                ) || null
              }
              filterOption={(_option, _inputValue) => {
                return true; //ignore default filter option by label
              }}
              menuStyle={{
                width: '760px',
              }}
              hideSearchIcon
              isClearable={true}
              onChange={(_name, value) => updateProjectFields(value)}
              optionWithSubLabel
              isDisabled={disabled || inReviewMode}
              menuOptionPosition="right"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'PI Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.PI_NAME)}
              {...getFieldProps(PO_FORM_KEY.PI_NAME)}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Project Period'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.PROJECT_PERIOD)}
              {...getFieldProps(PO_FORM_KEY.PROJECT_PERIOD)}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'SuperQUOTE No.'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.SUPER_QUOTE_NUMBER)}
              {...getFieldProps(PO_FORM_KEY.SUPER_QUOTE_NUMBER)}
              disabled
              footer={
                showActionLink ? (
                  <Link
                    type="icon-link"
                    icon={<Add fontSize="small" />}
                    textVariant="body2"
                    onClick={handleImportSuperQuoteClick}
                  >
                    Import from SuperQUOTE
                  </Link>
                ) : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Select
              {...getFieldProps(PO_FORM_KEY.VENDOR_NAME)}
              errorMessage={_getErrorMessage(PO_FORM_KEY.VENDOR_NAME)}
              onBlur={setFieldTouched}
              label={'Vendor Name'}
              placeholder={'Search'}
              extraRequired
              options={vendorNameOptions}
              isLoading={isLoadingSearchVendors}
              defaultInputValue={currentVendorNameInputValue}
              {...(!isClearedDefaultVendors && {
                inputValue: haveVendorNameValueButOptions ? currentVendorNameInputValue : undefined,
              })}
              onInputChange={(value: string) => {
                debounceSearchVendorsInput('name', value);
              }}
              getOptionLabel={(option: SelectOption<Vendor>) => {
                return option.value.name;
              }}
              customSelectedOptionValue={
                vendorNameOptions.find(
                  (option: SelectOption<Vendor>) => option.value?.name === values.vendorName
                ) || null
              }
              filterOption={(_option, _inputValue) => {
                return true; //ignore default filter option by label
              }}
              hideSearchIcon
              isClearable={true}
              onChange={(_name, value) => updateVendorFields(value)}
              optionWithSubLabel
              isDisabled={disabled || inReviewMode}
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
              {...getFieldProps(PO_FORM_KEY.VENDOR_CODE)}
              errorMessage={_getErrorMessage(PO_FORM_KEY.VENDOR_CODE)}
              onBlur={setFieldTouched}
              label={'Vendor Code'}
              placeholder={'Search'}
              extraRequired
              options={vendorCodeOptions}
              isLoading={isLoadingSearchVendors}
              defaultInputValue={currentVendorCodeInputValue}
              {...(!isClearedDefaultVendors && {
                inputValue: haveVendorCodeValueButOptions ? currentVendorCodeInputValue : undefined,
              })}
              onInputChange={(value: string) => {
                debounceSearchVendorsInput('code', value);
              }}
              getOptionLabel={(option: SelectOption<Vendor>) => {
                return option.value.code;
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
              isDisabled={disabled || inReviewMode}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextareaAutosize
              label={'Vendor Address, Street/PO Box, City, State, Zip Code'}
              required
              errorMessage={_getErrorMessage(PO_FORM_KEY.VENDOR_ADDRESS)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.VENDOR_ADDRESS)}
              disabled={disabled || inReviewMode}
              style={{ minHeight: '100px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextareaAutosize
              label={'Ship To Information (Name, Address)'}
              required
              errorMessage={_getErrorMessage(PO_FORM_KEY.SHIP_TO)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.SHIP_TO)}
              disabled={disabled || inReviewMode}
              style={{ minHeight: '100px' }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Select
              {...getFieldProps(PO_FORM_KEY.SHIP_VIA)}
              errorMessage={_getErrorMessage(PO_FORM_KEY.SHIP_VIA)}
              label={'Ship Via'}
              placeholder={'Select'}
              options={shipViaOptions}
              isDisabled={disabled || inReviewMode}
              onChange={setFieldValue}
              isSearchable={false}
              hideSearchIcon
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Input
              label={'Ship Via Instructions'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.SHIP_OTHER)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.SHIP_OTHER)}
              disabled={disabled || inReviewMode}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Delivery Required By'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.DELIVERY_BY)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.DELIVERY_BY)}
              disabled={disabled || inReviewMode}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Discount Terms'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.DISCOUNT_TERMS)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.DISCOUNT_TERMS)}
              disabled={disabled || inReviewMode}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Quotation No.'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.QUOTATION_NUMBER)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.QUOTATION_NUMBER)}
              disabled={disabled || inReviewMode}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Direct Inquiries on This Request To'}
              required
              errorMessage={_getErrorMessage(PO_FORM_KEY.DIRECT_INQUIRIES_TO)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.DIRECT_INQUIRIES_TO)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputPhone
              label={'Phone Number'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.PHONE_NUMBER)}
              {...getFieldProps(PO_FORM_KEY.PHONE_NUMBER)}
              disabled={disabled}
              onChange={setFieldValue}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'FA Staff to Review'}
              required
              errorMessage={_getErrorMessage(PO_FORM_KEY.FA_STAFF_REVIEWER)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.FA_STAFF_REVIEWER)}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpsertPOFormikProps;
  disabled?: boolean;
  currentPOMode: PO_MODE;
};

export default React.memo(GeneralInfo, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_FORM_KEY.LOGIN_NAME,
    PO_FORM_KEY.DATE,
    PO_FORM_KEY.NUMBER,
    PO_FORM_KEY.PROJECT_TITLE,
    PO_FORM_KEY.PHONE_NUMBER,
    PO_FORM_KEY.PI_NAME,
    PO_FORM_KEY.PROJECT_PERIOD,
    PO_FORM_KEY.SUPER_QUOTE_NUMBER,
    PO_FORM_KEY.SUPER_QUOTE_BID_ID,
    PO_FORM_KEY.VENDOR_NAME,
    PO_FORM_KEY.VENDOR_CODE,
    PO_FORM_KEY.VENDOR_ADDRESS,
    PO_FORM_KEY.SHIP_OTHER,
    PO_FORM_KEY.SHIP_VIA,
    PO_FORM_KEY.SHIP_TO,
    PO_FORM_KEY.DELIVERY_BY,
    PO_FORM_KEY.DISCOUNT_TERMS,
    PO_FORM_KEY.QUOTATION_NUMBER,
    PO_FORM_KEY.DIRECT_INQUIRIES_TO,
    PO_FORM_KEY.PHONE_NUMBER,
    PO_FORM_KEY.FA_STAFF_REVIEWER,
  ]; // only re-render if keys using in this component change

  return isEqualPrevAndNextFormikValues<UpsertPOFormValue>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender,
  });
});
