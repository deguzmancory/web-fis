import { Add } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import { debounce } from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Input, Link, Select, TextareaAutosize, InputUSPhone } from 'src/components/common';
import { SelectOption } from 'src/components/common/Select';
import {
  UpdatePOPaymentFormValue,
  UpdatePOPaymentFormikProps,
} from 'src/containers/POPayment/types';
import {
  VENDOR_REGISTRATION_NAVIGATE_FROM,
  VENDOR_REGISTRATION_PARAMS,
} from 'src/containers/Vendors/VendorRegistration/enums';
import { PO_DOCUMENT_TYPE, PO_MODE } from 'src/queries';
import { isPOChangeAmountForm, isPOChangeDescriptionForm } from 'src/queries/POChange/helpers';
import { FinancialProject } from 'src/queries/Projects/types';
import {
  isCUReviewPOMode,
  isCreatePOMode,
  isFAReviewPOMode,
  isPOChangeDocumentType,
  isPODocumentType,
  isPOPaymentDocumentType,
  isPiSuEditPOMode,
} from 'src/queries/PurchaseOrders/helpers';
import { Vendor } from 'src/queries/Vendors';
import { showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { setFormData } from 'src/redux/form/formSlice';
import { Navigator } from 'src/services';
import {
  getDateDisplay,
  getErrorMessage,
  isEqualPrevAndNextFormikValues,
  isString,
} from 'src/utils';
import { isEmpty } from 'src/validations';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormValue, UpsertPOFormikProps } from '../types';
import {
  VARIOUS_PROJECT_LABEL,
  getVendorAddress,
  getVendorOptions,
  isVariousProject,
  shipViaOptions,
} from './helpers';
import usePOSearchProject, { SearchProjectsType } from './hooks/usePOSearchProject';
import usePOSearchVender, { SearchVendorsType } from './hooks/usePOSearchVender';
import SuperQuote from './superQuote';

const GeneralInfo = <T extends UpsertPOFormikProps | UpdatePOPaymentFormikProps>({
  formikProps,
  disabled = false,
  currentPOMode,
  documentType = PO_DOCUMENT_TYPE.PURCHASE_ORDER,
}: Props<T>) => {
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
  console.log('values: ', values);

  const isBlankDocument = isCreatePOMode(currentPOMode);
  const isPODocument = isPODocumentType(documentType);
  const isPOChangeDocument = isPOChangeDocumentType(documentType);
  const isPOPaymentDocument = isPOPaymentDocumentType(documentType);

  // show action link only on create PO and PI SU edit mode of PO document
  const showActionLink = isBlankDocument || (isPODocument && isPiSuEditPOMode(currentPOMode));

  //PO logic
  const inPOReviewMode =
    isPODocument && (isFAReviewPOMode(currentPOMode) || isCUReviewPOMode(currentPOMode));

  //PO CHANGE logic
  const isPOChangeEditMode =
    isPOChangeDocument &&
    isPiSuEditPOMode(currentPOMode) &&
    (isPOChangeDescriptionForm(values.formNumber) || isPOChangeAmountForm(values.formNumber));
  const isPOChangeReviewMode =
    isPOChangeDocument &&
    (isFAReviewPOMode(currentPOMode) || isCUReviewPOMode(currentPOMode)) &&
    (isPOChangeDescriptionForm(values.formNumber) || isPOChangeAmountForm(values.formNumber));

  const currentProjectTitle = React.useMemo(() => values.projectTitle, [values.projectTitle]);
  const currentProjectNumber = React.useMemo(() => values.projectNumber, [values.projectNumber]);
  const currentVendorName = React.useMemo(() => values.vendorName, [values.vendorName]);
  const currentVendorCode = React.useMemo(() => values.vendorCode, [values.vendorCode]);

  const {
    setSearchProjects,
    isLoadingSearchProjects,
    searchedProjectTitleOptions,
    searchedProjectNumberOptions,
  } = usePOSearchProject({ currentProjectTitle, currentProjectNumber });

  const {
    isLoadingSearchVendors,
    searchedVendorNameOptions,
    searchedVendorCodeOptions,
    setSearchVendors,
  } = usePOSearchVender({ currentVendorName, currentVendorCode });

  // check for case vendor first mounted with data from get PO response
  // check for case vendor first mounted when just back from additional forms
  // do not check the project because strange behavior of default Various project => fetch project when did mount in usePOSearchProject hook
  const hasVendorNameValueButOptions =
    !!currentVendorName && isEmpty(searchedVendorNameOptions) && !isLoadingSearchVendors;
  const hasVendorCodeValueButOptions =
    !!currentVendorCode && isEmpty(searchedVendorCodeOptions) && !isLoadingSearchVendors;

  const vendorNameOptions = React.useMemo(() => {
    if (hasVendorNameValueButOptions) {
      return isString(currentVendorName)
        ? [{ label: currentVendorName, value: currentVendorName, isDisabled: true }]
        : getVendorOptions({ vendors: [currentVendorName] });
    }

    return searchedVendorNameOptions;
  }, [currentVendorName, hasVendorNameValueButOptions, searchedVendorNameOptions]);

  const vendorCodeOptions = React.useMemo(() => {
    if (hasVendorCodeValueButOptions) {
      return isString(currentVendorCode)
        ? [{ label: currentVendorCode, value: currentVendorCode, isDisabled: true }]
        : getVendorOptions({ vendors: [currentVendorCode] });
    }

    return searchedVendorCodeOptions;
  }, [currentVendorCode, hasVendorCodeValueButOptions, searchedVendorCodeOptions]);

  const updateProjectFields = (value: FinancialProject) => {
    setFieldValue(PO_FORM_KEY.PROJECT_TITLE, value);
    setFieldValue(PO_FORM_KEY.PROJECT_NUMBER, value);
    setFieldValue(PO_FORM_KEY.PI_NAME, value?.piName || '');
    setFieldValue(
      PO_FORM_KEY.PROJECT_PERIOD,
      value
        ? isVariousProject(value.number)
          ? VARIOUS_PROJECT_LABEL
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
      const formattedAddress = getVendorAddress(value);
      setFieldValue(PO_FORM_KEY.VENDOR_ADDRESS, formattedAddress);
    } else {
      setFieldValue(PO_FORM_KEY.VENDOR_ADDRESS, '');
    }
  };

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleCreateNewVenderLinkClick = () => {
    const callingFromParam = `?${VENDOR_REGISTRATION_PARAMS.CALLING_FROM}=${VENDOR_REGISTRATION_NAVIGATE_FROM.PO}`;
    const documentIdParam = !!id ? `&${VENDOR_REGISTRATION_PARAMS.DOCUMENT_ID}=${id}` : '';

    dispatch(setFormData(values));
    Navigator.navigate(`${PATHS.addVendorRegistration}${callingFromParam}${documentIdParam}`, {
      isFromForm: VENDOR_REGISTRATION_NAVIGATE_FROM.PO,
    });
  };

  const handleImportSuperQuoteClick = () => {
    if (disabled || inPOReviewMode) return;

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
      if (!value) return;

      setSearchVendors((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }, 300),
    []
  );

  const disabledProjectFields =
    disabled || inPOReviewMode || isPOChangeEditMode || isPOChangeReviewMode;

  return (
    <Box>
      <Grid container spacing={2}>
        {/* PO, PO Payment logic */}
        {(isPODocument || isPOPaymentDocument || isBlankDocument) && (
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Date'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.DATE)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.DATE)}
            disabled
          />
        </Grid>

        {/* PO, PO Payment logic */}
        {(isPODocument || isPOPaymentDocument || isBlankDocument) && (
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Purchase Order No.'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.NUMBER)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.NUMBER)}
              placeholder={'To be assigned'}
              disabled
            />
          </Grid>
        )}

        {/* PO Change logic */}
        {isPOChangeDocument && (
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Purchase Order No. (Origin)'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.PREVIOUS_PO_NUMBER)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.PREVIOUS_PO_NUMBER)}
              placeholder={'To be assigned'}
              disabled
            />
          </Grid>
        )}

        {/* PO Change logic */}
        {isPOChangeDocument && (
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Purchase Order No. (New)'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.NUMBER)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.NUMBER)}
              placeholder={'To be assigned'}
              disabled
            />
          </Grid>
        )}

        <Grid item xs={12} sm={8}>
          {disabledProjectFields ? (
            <Input
              label={'Project Title'}
              value={
                isString(values.projectTitle) ? values.projectTitle : values.projectTitle?.name
              }
              disabled
              extraRequired
            />
          ) : (
            <Select
              {...getFieldProps(PO_FORM_KEY.PROJECT_TITLE)}
              errorMessage={_getErrorMessage(PO_FORM_KEY.PROJECT_TITLE)}
              onBlur={setFieldTouched}
              label={'Project Title'}
              placeholder={'Search'}
              extraRequired
              options={searchedProjectTitleOptions}
              isLoading={isLoadingSearchProjects}
              onInputChange={(value: string) => {
                debounceSearchProjectsInput('title', value);
              }}
              getOptionLabel={(option: SelectOption<FinancialProject>) => {
                return option.value.name;
              }}
              customSelectedOptionValue={
                searchedProjectTitleOptions.find(
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
              footer={
                <Typography variant="body2">
                  Use “Various" if you want to use multiple projects.
                </Typography>
              }
            />
          )}
        </Grid>
        <Grid item xs={12} sm={4}>
          {disabledProjectFields ? (
            <Input
              label={'Project #'}
              value={
                isString(values.projectNumber) ? values.projectNumber : values.projectNumber?.number
              }
              disabled
              extraRequired
            />
          ) : (
            <Select
              {...getFieldProps(PO_FORM_KEY.PROJECT_NUMBER)}
              errorMessage={_getErrorMessage(PO_FORM_KEY.PROJECT_NUMBER)}
              onBlur={setFieldTouched}
              label={'Project #'}
              placeholder={'Search'}
              extraRequired
              options={searchedProjectNumberOptions}
              isLoading={isLoadingSearchProjects}
              onInputChange={(value: string) => {
                debounceSearchProjectsInput('number', value);
              }}
              getOptionLabel={(option: SelectOption<FinancialProject>) => {
                return option.value.number;
              }}
              customSelectedOptionValue={
                searchedProjectNumberOptions.find(
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
              isDisabled={disabled || inPOReviewMode || isPOChangeEditMode || isPOChangeReviewMode}
              menuOptionPosition="right"
            />
          )}
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
            isDisabled={disabled || inPOReviewMode || isPOChangeEditMode || isPOChangeReviewMode}
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
            isDisabled={disabled || inPOReviewMode || isPOChangeEditMode || isPOChangeReviewMode}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextareaAutosize
            label={'Vendor Address, Street/PO Box, City, State, Zip Code'}
            required
            errorMessage={_getErrorMessage(PO_FORM_KEY.VENDOR_ADDRESS)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.VENDOR_ADDRESS)}
            disabled={disabled || inPOReviewMode || isPOChangeEditMode || isPOChangeReviewMode}
            style={{ minHeight: '100px' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextareaAutosize
            label={'Ship To Information (Name, Address)'}
            required
            errorMessage={_getErrorMessage(PO_FORM_KEY.SHIP_TO)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.SHIP_TO)}
            disabled={disabled || inPOReviewMode || isPOChangeEditMode || isPOChangeReviewMode}
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
            isDisabled={disabled || inPOReviewMode || isPOChangeReviewMode}
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
            disabled={disabled || inPOReviewMode || isPOChangeReviewMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Delivery Required By'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.DELIVERY_BY)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.DELIVERY_BY)}
            disabled={disabled || inPOReviewMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Discount Terms'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.DISCOUNT_TERMS)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.DISCOUNT_TERMS)}
            disabled={disabled || inPOReviewMode || isPOChangeEditMode || isPOChangeReviewMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Quotation No.'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.QUOTATION_NUMBER)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.QUOTATION_NUMBER)}
            disabled={disabled || inPOReviewMode || isPOChangeEditMode || isPOChangeReviewMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Direct Inquiries on This Request To'}
            required
            errorMessage={_getErrorMessage(PO_FORM_KEY.DIRECT_INQUIRIES_TO)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.DIRECT_INQUIRIES_TO)}
            disabled={disabled || isPOChangeReviewMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputUSPhone
            label={'Phone Number'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.PHONE_NUMBER)}
            {...getFieldProps(PO_FORM_KEY.PHONE_NUMBER)}
            disabled={disabled || isPOChangeReviewMode}
            onChange={setFieldValue}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'FA Staff to Review'}
            required
            errorMessage={_getErrorMessage(PO_FORM_KEY.FA_STAFF_REVIEWER)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.FA_STAFF_REVIEWER)}
            disabled={disabled || isPOChangeReviewMode}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props<T extends UpsertPOFormikProps | UpdatePOPaymentFormikProps> = {
  formikProps: T extends UpsertPOFormikProps ? UpsertPOFormikProps : UpdatePOPaymentFormikProps;
  disabled?: boolean;
  currentPOMode: PO_MODE;
  documentType: PO_DOCUMENT_TYPE;
};

export default React.memo(GeneralInfo, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  // always update formikValues for jump to create new vendor registration purpose
  const showActionLink =
    isCreatePOMode(nextProps.currentPOMode) || isPiSuEditPOMode(nextProps.currentPOMode);
  if (showActionLink) return false;

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
    PO_FORM_KEY.DOCUMENT_TYPE,
    PO_FORM_KEY.FORM_NUMBER,
    PO_FORM_KEY.PREVIOUS_PO_NUMBER,
  ]; // only re-render if keys using in this component change

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentPOMode === nextProps.currentPOMode &&
    prevProps.documentType === nextProps.documentType &&
    isEqualPrevAndNextFormikValues<UpsertPOFormValue | UpdatePOPaymentFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
