import { Box, Container, Grid, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import { optionYesNoValue } from 'src/appConfig/options';
import { Input, RadioButton, TextareaAutosize } from 'src/components/common';
import { initialFfataValue } from 'src/containers/PurchaseOrderContainer/PO/helpers';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/PO/types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { POFfata } from 'src/queries/PurchaseOrders';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Toastify } from 'src/services';
import { getErrorMessage, getUncontrolledInputFieldProps } from 'src/utils';
import HeaderOfSection from '../headerSection';
import { handleNavigateBackToMainForm } from '../helpers';
import { PO_FFATA_DATA_COLLECTION_KEY } from './enum';

const FfataDataCollectionForm: React.FC<Props> = ({
  formRef,
  formData,
  disabled,
  documentId,
  onSetFormData,
  onSetIsImmutableFormData,
  hrefNavigationForm,
}) => {
  const history = useHistory();

  const handleFormSubmit = () => {
    handleSaveForm();
    handleNavigateBackToMainForm({
      documentId,
      hrefNavigationForm,
      documentType: formData?.documentType,
    });
  };

  const handleResetForm = () => {
    onSetFormData<UpsertPOFormValue>({ ...formData, ffata: initialFfataValue });
    onSetIsImmutableFormData(true);
  };

  const formik = useFormik<POFfata>({
    initialValues: formData?.ffata || initialFfataValue,
    validationSchema: null,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    onReset: handleResetForm,
  });

  React.useImperativeHandle(formRef, () => ({
    ...formik,
  }));

  const { values, errors, touched, setFieldValue, setFieldTouched, getFieldProps } = formik;

  const _getUncontrolledFieldProps = getUncontrolledInputFieldProps({
    values,
    setFieldTouched,
    setFieldValue,
  });

  const handleSaveForm = React.useCallback(() => {
    onSetFormData<UpsertPOFormValue>({ ...formData, ffata: values });
    onSetIsImmutableFormData(true);
    if (!disabled) {
      Toastify.success('Save changes successfully.');
    }
  }, [formData, disabled, onSetFormData, onSetIsImmutableFormData, values]);

  React.useEffect(() => {
    return history.listen(() => {
      if (history.action === 'POP') {
        handleSaveForm();
      }
    });
  }, [history, handleSaveForm]);

  const _getErrorMessage = (fieldName: PO_FFATA_DATA_COLLECTION_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Container maxWidth="lg">
        <SectionLayout
          header={
            <HeaderOfSection
              href={'https://www.rcuh.com/2-000/2-300/2-304/'}
              label={'RCUH Policy 2.304'}
            />
          }
        >
          <Typography variant="body2">
            The Federal Funding Accountability and Transparency Act (FFATA), passed in 2006 and
            amended in 2008, requires information disclosure concerning entities receiving financial
            assistance through Federal awards such as contracts, sub-contracts, grants, and
            sub-grants. Effective 10/1/10, prime awardees are required to report selected
            information. As a subcontractor / vendor to the University of Hawaii (UH), please
            complete all sections of the form below to facilitate required FFATA information
            reporting.
          </Typography>
        </SectionLayout>

        <Typography
          borderBottom={COLOR_CODE.DEFAULT_BORDER}
          variant="h5"
          sx={{
            backgroundColor: COLOR_CODE.PRIMARY_500,
            color: COLOR_CODE.GRAY_LIGHT,
            py: 1.5,
            px: 3,
            mt: 2,
          }}
        >
          Section A - To be completed by UH FO
        </Typography>
        <SectionLayout sx={{ mt: 0 }}>
          <Grid item container spacing={2}>
            <Grid item xs={3}>
              <Input label={'Purchase Order No'} value={formData?.number} disabled />
            </Grid>
            <Grid item xs={3}>
              <Input
                label={'Prime Federal Award ID'}
                maxLength={25}
                errorMessage={_getErrorMessage(PO_FFATA_DATA_COLLECTION_KEY.AWARD_ID)}
                {..._getUncontrolledFieldProps(PO_FFATA_DATA_COLLECTION_KEY.AWARD_ID)}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={3}>
              <Input
                maxLength={25}
                label={'PO Date (Month/Year)'}
                errorMessage={_getErrorMessage(PO_FFATA_DATA_COLLECTION_KEY.PO_DATE)}
                {..._getUncontrolledFieldProps(PO_FFATA_DATA_COLLECTION_KEY.PO_DATE)}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={3}>
              <Input
                maxLength={25}
                label={'Subaward Amount'}
                errorMessage={_getErrorMessage(PO_FFATA_DATA_COLLECTION_KEY.SUB_AWARD_AMOUNT)}
                {..._getUncontrolledFieldProps(PO_FFATA_DATA_COLLECTION_KEY.SUB_AWARD_AMOUNT)}
                disabled={disabled}
              />
            </Grid>
          </Grid>
        </SectionLayout>

        <Typography
          borderBottom={COLOR_CODE.DEFAULT_BORDER}
          variant="h5"
          sx={{
            backgroundColor: COLOR_CODE.PRIMARY_500,
            color: COLOR_CODE.GRAY_LIGHT,
            py: 1.5,
            px: 3,
            mt: 2,
          }}
        >
          Section B - To be completed by Subcontractor / Vendor
        </Typography>
        <SectionLayout sx={{ mt: 0 }}>
          <Typography variant="h5" sx={{ my: 2 }}>
            Please list entity data as it appears in your Central Contractor Registration (CCR)
            profile, as applicable.
          </Typography>
          <Grid item alignItems="center" container spacing={2}>
            <>
              <Grid item xs={3}>
                <Typography variant="body1">1. Name/Doing Business As (DBA):</Typography>
              </Grid>
              <Grid item xs={9}>
                <Input
                  errorMessage={_getErrorMessage(PO_FFATA_DATA_COLLECTION_KEY.NAME_OR_DBA)}
                  {..._getUncontrolledFieldProps(PO_FFATA_DATA_COLLECTION_KEY.NAME_OR_DBA)}
                  disabled={disabled}
                />
              </Grid>
            </>
            <>
              <Grid item xs={7}>
                <Typography variant="body1">
                  2. Subawardee's DUNS (9-digit, Data Universal Numbering System number):
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Input
                  errorMessage={_getErrorMessage(PO_FFATA_DATA_COLLECTION_KEY.SUB_AWARDEE_DUNS)}
                  {..._getUncontrolledFieldProps(PO_FFATA_DATA_COLLECTION_KEY.SUB_AWARDEE_DUNS)}
                  disabled={disabled}
                  maxLength={9}
                />
              </Grid>
            </>
            <>
              <Grid item xs={7}>
                <Typography variant="body1">
                  3. Subawardee's DUNS+4 (the +4 extension to a DUNS number - optional):
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Input
                  errorMessage={_getErrorMessage(
                    PO_FFATA_DATA_COLLECTION_KEY.SUB_AWARDEE_DUNS_4_EXTENSION
                  )}
                  {..._getUncontrolledFieldProps(
                    PO_FFATA_DATA_COLLECTION_KEY.SUB_AWARDEE_DUNS_4_EXTENSION
                  )}
                  maxLength={5}
                  disabled={disabled}
                />
              </Grid>
            </>
            <Grid item container>
              <Grid item>
                <RadioButton
                  label={
                    <Typography variant="body1">
                      4. Did your gross income, from all sources, in the previous tax year exceed
                      $300,000?
                    </Typography>
                  }
                  options={optionYesNoValue}
                  isTrueFalseOptions
                  columns={2}
                  errorMessage={_getErrorMessage(PO_FFATA_DATA_COLLECTION_KEY.EXCEEDS_300000)}
                  {...getFieldProps(PO_FFATA_DATA_COLLECTION_KEY.EXCEEDS_300000)}
                  onChange={setFieldValue}
                  disabled={disabled}
                />
              </Grid>
              <Grid item sx={{ px: 2, mb: 1 }}>
                <Typography variant="body1">
                  If "No", this subaward is not subject to FFATA reporting and no additional
                  responses are required. If "Yes", proceed to No. 5 below.
                </Typography>
              </Grid>
            </Grid>

            <Grid item container>
              <Grid item xs={4}>
                <Typography variant="body1">
                  5. Subaward (subcontract) Title & Description:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <TextareaAutosize
                  resize="none"
                  style={{ padding: '0 2px', marginTop: '2px' }}
                  errorMessage={_getErrorMessage(
                    PO_FFATA_DATA_COLLECTION_KEY.SUB_AWARD_TITLE_AND_DESC
                  )}
                  {...getFieldProps(PO_FFATA_DATA_COLLECTION_KEY.SUB_AWARD_TITLE_AND_DESC)}
                  disabled={disabled}
                />
              </Grid>

              <Grid item container sx={{ pl: 2, mt: 2 }}>
                <Grid item>
                  <RadioButton
                    label={
                      <Typography variant="body1">
                        Is the Performance Site the same address as listed above in the address
                        information you provided?
                      </Typography>
                    }
                    options={optionYesNoValue}
                    isTrueFalseOptions
                    columns={2}
                    errorMessage={_getErrorMessage(PO_FFATA_DATA_COLLECTION_KEY.SAME_ADDRESS)}
                    {...getFieldProps(PO_FFATA_DATA_COLLECTION_KEY.SAME_ADDRESS)}
                    onChange={setFieldValue}
                    disabled={disabled}
                  />
                </Grid>

                <Grid item container>
                  <Grid item xs={4}>
                    <Typography variant="body1">
                      If "No", please list Performance Site address:
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextareaAutosize
                      style={{ padding: '0 2px', marginTop: '2px' }}
                      resize="none"
                      errorMessage={_getErrorMessage(
                        PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_STREET
                      )}
                      {...getFieldProps(
                        PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_STREET
                      )}
                      disabled={disabled}
                    />
                  </Grid>
                </Grid>

                <Grid item container spacing={3} sx={{ pt: 2 }}>
                  <Grid item xs={3}>
                    <Input
                      label={'City (County)'}
                      errorMessage={_getErrorMessage(
                        PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_CITY
                      )}
                      {...getFieldProps(PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_CITY)}
                      maxLength={20}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Input
                      label={'State'}
                      errorMessage={_getErrorMessage(
                        PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_STATE
                      )}
                      {...getFieldProps(
                        PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_STATE
                      )}
                      maxLength={2}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Input
                      label={'Country'}
                      errorMessage={_getErrorMessage(
                        PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_COUNTRY
                      )}
                      {...getFieldProps(
                        PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_COUNTRY
                      )}
                      maxLength={20}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Input
                      label={'Zip+4'}
                      errorMessage={_getErrorMessage(
                        PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_ZIP
                      )}
                      {...getFieldProps(PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_ZIP)}
                      maxLength={10}
                      disabled={disabled}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </SectionLayout>
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    disabled: boolean;
    formRef: RefObject<FormikProps<any>>;
    documentId: string;
  };

const mapStateToProps = (state: IRootState<UpsertPOFormValue>) => ({
  formData: state.form.formData,
  isImmutableFormData: state.form.isImmutableFormData,
  hrefNavigationForm: state.form.hrefNavigateAdditionalForm,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(FfataDataCollectionForm);
