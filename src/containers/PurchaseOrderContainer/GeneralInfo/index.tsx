import { Add } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import { debounce } from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Input, InputPhone, Link, Select, TextArea } from 'src/components/common';
import { SelectOption } from 'src/components/common/Select';
import { useContents } from 'src/queries';
import { FinancialProject } from 'src/queries/Projects/types';
import { Vendor } from 'src/queries/Vendors';
import { showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { getDateDisplay, getErrorMessage, isEqualPrevAndNextObjByPath } from 'src/utils';
import { getContentOptions } from 'src/utils/contentUtils';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormikProps } from '../types';
import SuperQuote from './superQuote';
import usePOSearchProject, { SearchProjectsType } from '../hooks/usePOSearchProject';
import usePOSearchVender, { SearchVendorsType } from '../hooks/usePOSearchVender';
import { isVariousProject, VARIOUS_PROJECT_VALUE } from './helpers';

const GeneralInfo: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const dispatch = useDispatch();

  const { values, errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } =
    formikProps;
  const currentProjectTitle = React.useMemo(() => values.projectTitle, [values.projectTitle]);
  const currentProjectNumber = React.useMemo(() => values.projectNumber, [values.projectNumber]);
  const currentVendorName = React.useMemo(() => values.vendorName, [values.vendorName]);
  const currentVendorCode = React.useMemo(() => values.vendorCode, [values.vendorCode]);

  const { setSearchProjects, isLoadingSearchProjects, projectTitleOptions, projectNumberOptions } =
    usePOSearchProject({ currentProjectTitle, currentProjectNumber });

  const { setSearchVendors, isLoadingSearchVendors, vendorNameOptions, vendorCodeOptions } =
    usePOSearchVender({ currentVendorName, currentVendorCode });

  const { contents } = useContents();

  const shipViaOptions = getContentOptions(contents, 'shipVia');

  const updateProjectFields = (value: FinancialProject) => {
    setFieldValue(PO_FORM_KEY.PROJECT_TITLE, value);
    setFieldValue(PO_FORM_KEY.PROJECT_NUMBER, value);
    setFieldValue(PO_FORM_KEY.PI_NAME, value.piName || '');
    setFieldValue(
      PO_FORM_KEY.PROJECT_PERIOD,
      value
        ? isVariousProject(value.number)
          ? VARIOUS_PROJECT_VALUE
          : `${getDateDisplay(value.startDate)} - ${getDateDisplay(value.endDate)}`
        : null
    );
  };

  const updateVendorFields = (value: Vendor) => {
    setFieldValue(PO_FORM_KEY.VENDOR_NAME, value);
    setFieldValue(PO_FORM_KEY.VENDOR_CODE, value);
    const { name2, address1, address2, address3 } = value || {};
    const formattedAddress = value
      ? `${name2 && `${name2}\n`}${address1 && `${address1}\n`}${
          address2 && `${address2}\n`
        }${address3}`
      : '';
    setFieldValue(PO_FORM_KEY.VENDOR_ADDRESS, formattedAddress);
  };

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleCreateNewVenderLinkClick = () => {
    console.log('createNewVenderLinkClick');
  };

  const handleImportSuperQuoteClick = () => {
    if (disabled) return;

    dispatch(
      showDialog({
        type: DIALOG_TYPES.YESNO_DIALOG,
        data: {
          title: 'Import Data from SuperQUOTE',
          content: <SuperQuote formikProps={formikProps} disabled={disabled} />,
          showTitleDivider: true,
          okText: 'Import',
        },
      })
    );
  };

  // Debouncing search projects inputs
  const debounceSearchProjectsInput = debounce((key: keyof SearchProjectsType, value: string) => {
    setSearchProjects((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }, 300);

  // Debouncing search vendors inputs
  const debounceSearchVendorsInput = debounce((key: keyof SearchVendorsType, value: string) => {
    setSearchVendors((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }, 300);

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
              isDisabled={disabled}
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
              isDisabled={disabled}
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
                <Link
                  type="icon-link"
                  icon={<Add fontSize="small" />}
                  textVariant="body2"
                  onClick={handleImportSuperQuoteClick}
                >
                  Import from SuperQUOTE
                </Link>
              }
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Select
              {...getFieldProps(PO_FORM_KEY.VENDOR_NAME)}
              label={'Vendor Name'}
              placeholder={'Search'}
              extraRequired
              options={vendorNameOptions}
              isLoading={isLoadingSearchVendors}
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
                <Link
                  type="icon-link"
                  icon={<Add fontSize="small" />}
                  textVariant="body2"
                  onClick={handleCreateNewVenderLinkClick}
                >
                  Create New Vendor
                </Link>
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Select
              {...getFieldProps(PO_FORM_KEY.VENDOR_CODE)}
              label={'Vendor Code'}
              placeholder={'Search'}
              extraRequired
              options={vendorCodeOptions}
              isLoading={isLoadingSearchVendors}
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
              isDisabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextArea
              label={'Vendor Address, Street/PO Box, City, State, Zip Code'}
              required
              errorMessage={_getErrorMessage(PO_FORM_KEY.VENDOR_ADDRESS)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.VENDOR_ADDRESS)}
              disabled={disabled}
              style={{ minHeight: '100px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextArea
              label={'Ship To Information (Name, Address)'}
              required
              errorMessage={_getErrorMessage(PO_FORM_KEY.SHIP_TO)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.SHIP_TO)}
              disabled={disabled}
              style={{ minHeight: '100px' }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Select
              {...getFieldProps(PO_FORM_KEY.SHIP_VIA)}
              label={'Ship Via'}
              placeholder={'Select'}
              options={shipViaOptions}
              isDisabled={disabled}
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
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Delivery Required By'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.DELIVERY_BY)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.DELIVERY_BY)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Discount Terms'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.DISCOUNT_TERMS)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.DISCOUNT_TERMS)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Quotation No.'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.QUOTATION_NUMBER)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.QUOTATION_NUMBER)}
              disabled={disabled}
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
};

export default React.memo(GeneralInfo, (prevProps, nextProps) => {
  const prevFormikValues = prevProps.formikProps.values;
  const nextFormikValues = nextProps.formikProps.values;

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
    PO_FORM_KEY.DELIVERY_BY,
    PO_FORM_KEY.DISCOUNT_TERMS,
    PO_FORM_KEY.QUOTATION_NUMBER,
    PO_FORM_KEY.DIRECT_INQUIRIES_TO,
    PO_FORM_KEY.PHONE_NUMBER,
    PO_FORM_KEY.FA_STAFF_REVIEWER,
  ]; // only re-render if keys using in this component change

  return formKeysNeedRender.every((key) =>
    isEqualPrevAndNextObjByPath({
      prevValues: prevFormikValues,
      nextValues: nextFormikValues,
      path: key,
    })
  );
});
