import { Box, Grid } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Input } from 'src/components/common';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import { POSoleSourcePayload } from 'src/queries/PurchaseOrders';
import { setFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import { getErrorMessage, getUncontrolledInputFieldProps } from 'src/utils';
import { PO_ADDITIONAL_FORM_KEY, PO_ADDITIONAL_FORM_PARAMS } from '../enum';
import { PO_SOLE_SOURCE_FORM_KEY } from './enum';

const SoleSourceForm: React.FC<Props> = ({ formRef, formData, onSetFormData, disabled }) => {
  const history = useHistory();

  const handleFormSubmit = () => {
    handleSaveForm();
    Navigator.navigate(
      `${PATHS.createPurchaseOrders}?${PO_ADDITIONAL_FORM_PARAMS.SCROLL_TO}=${PO_ADDITIONAL_FORM_KEY.ADDITIONAL_FORMS}`
    );
  };

  const formik = useFormik<POSoleSourcePayload>({
    initialValues: formData?.soleSource,
    validationSchema: null,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
  });

  React.useImperativeHandle(formRef, () => ({
    ...formik,
  }));

  const { values, errors, touched, setFieldValue, setFieldTouched } = formik;

  const _getUncontrolledFieldProps = getUncontrolledInputFieldProps({
    values,
    setFieldTouched,
    setFieldValue,
  });

  // const _handleScrollToTopError = React.useCallback(() => {
  //   handleScrollToTopError(errors);
  // }, [errors]);

  const handleSaveForm = React.useCallback(() => {
    onSetFormData<UpsertPOFormValue>({ ...formData, soleSource: values });
  }, [formData, onSetFormData, values]);

  React.useEffect(() => {
    return history.listen(() => {
      if (history.action === 'POP') {
        handleSaveForm();
      }
    });
  }, [history, handleSaveForm]);

  const _getErrorMessage = (fieldName: PO_SOLE_SOURCE_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Department Head'}
              errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.DEPARTMENT_HEAD)}
              {..._getUncontrolledFieldProps(PO_SOLE_SOURCE_FORM_KEY.DEPARTMENT_HEAD)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Prior Reference Number'}
              errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.PRIOR_REFERENCE_NUMBER)}
              {..._getUncontrolledFieldProps(PO_SOLE_SOURCE_FORM_KEY.PRIOR_REFERENCE_NUMBER)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Service Unacceptable Reasons'}
              errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.SERVICE_UNACCEPTABLE_REASONS)}
              {..._getUncontrolledFieldProps(PO_SOLE_SOURCE_FORM_KEY.SERVICE_UNACCEPTABLE_REASONS)}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Grid>
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

const ForwardRefSoleSourceForm = React.forwardRef((props: Props, _ref) => (
  <SoleSourceForm {...props} />
));

export default connect(mapStateToProps, mapDispatchToProps)(ForwardRefSoleSourceForm);
