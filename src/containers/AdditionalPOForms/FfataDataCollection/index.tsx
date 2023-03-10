import { Box, Container, Grid, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import { optionYesNoValue } from 'src/appConfig/enum';
import { PATHS } from 'src/appConfig/paths';
import { Input, RadioButton, TextareaAutosize } from 'src/components/common';
import Layout from 'src/containers/CRUUSerContainer/layout';
import { emptyUpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/constants';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import { FfataPayload } from 'src/queries/PurchaseOrders';
import { setFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import { getErrorMessage, getUncontrolledInputFieldProps } from 'src/utils';
import { PO_ADDITIONAL_FORM_KEY, PO_ADDITIONAL_FORM_PARAMS } from '../enum';
import { PO_FFATA_DATA_COLLECTION_KEY } from './enum';

const FfataDataCollectionForm: React.FC<Props> = ({
  formRef,
  formData,
  onSetFormData,
  disabled,
}) => {
  const history = useHistory();

  const handleFormSubmit = () => {
    handleSaveForm();
    Navigator.navigate(
      `${PATHS.createPurchaseOrders}?${PO_ADDITIONAL_FORM_PARAMS.SCROLL_TO}=${PO_ADDITIONAL_FORM_KEY.ADDITIONAL_FORMS}`
    );
  };

  const handleResetForm = () => {
    onSetFormData<UpsertPOFormValue>({ ...formData, ffata: emptyUpsertPOFormValue.ffata });
  };

  const formik = useFormik<FfataPayload>({
    initialValues: formData?.ffata,
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
  }, [formData, onSetFormData, values]);

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
        <Layout>
          <Typography variant="body2">
            The Federal Funding Accountability and Transparency Act (FFATA), passed in 2006 and
            amended in 2008, requires information disclosure concerning entities receiving financial
            assistance through Federal awards such as contracts, sub-contracts, grants, and
            sub-grants. Effective 10/1/10, prime awardees are required to report selected
            information. As a subcontractor / vendor to the University of Hawaii (UH), please
            complete all sections of the form below to facilitate required FFATA information
            reporting.
          </Typography>
        </Layout>
        <Layout>
          <Typography borderBottom={COLOR_CODE.DEFAULT_BORDER} variant="h5">
            Section A - To be completed by UH FO
          </Typography>
          <Grid item container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={3}>
              <Input label={'Purchase Order No'} defaultValue="To be Assigned" disabled={true} />
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
        </Layout>

        <Layout>
          <Typography borderBottom={COLOR_CODE.DEFAULT_BORDER} variant="h5">
            Section B - To be completed by Subcontractor / Vendor
          </Typography>
          <Typography variant="h5" sx={{ my: 2 }}>
            Please list entity data as it appears in your Central Contractor Registration (CCR)
            profile, as applicable.
          </Typography>
          <Grid item container spacing={2}>
            <>
              <Grid item xs={4}>
                <Typography variant="body1">1. Name/Doing Business As (DBA):</Typography>
              </Grid>
              <Grid item xs={8}>
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
              <RadioButton
                label={
                  '4. Did your gross income, from all sources, in the previous tax year exceed $300,000?'
                }
                options={optionYesNoValue}
                columns={2}
                errorMessage={_getErrorMessage(PO_FFATA_DATA_COLLECTION_KEY.EXCEEDS_300000)}
                {...getFieldProps(PO_FFATA_DATA_COLLECTION_KEY.EXCEEDS_300000)}
                onChange={setFieldValue}
              />
              <Grid item container sx={{ px: 2, mb: 1 }}>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    If "No", please list Performance Site address:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextareaAutosize
                    errorMessage={_getErrorMessage(
                      PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_STREET
                    )}
                    {...getFieldProps(PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_STREET)}
                  />
                </Grid>
              </Grid>
              <Grid item container spacing={3} sx={{ px: 2 }}>
                <Grid item xs={3}>
                  <Input
                    label={'City'}
                    errorMessage={_getErrorMessage(
                      PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_CITY
                    )}
                    {..._getUncontrolledFieldProps(
                      PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_CITY
                    )}
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
                    {..._getUncontrolledFieldProps(
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
                    {..._getUncontrolledFieldProps(
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
                    {..._getUncontrolledFieldProps(
                      PO_FFATA_DATA_COLLECTION_KEY.PERFORMANCE_SITE_ADDRESS_ZIP
                    )}
                    maxLength={10}
                    disabled={disabled}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Layout>
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    disabled: boolean;
    formRef: RefObject<FormikProps<any>>;
  };

const mapStateToProps = (state: IRootState<UpsertPOFormValue>) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(FfataDataCollectionForm);