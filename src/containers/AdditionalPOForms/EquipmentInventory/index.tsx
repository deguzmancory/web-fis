import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  RadioGroup,
} from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Input, TextArea } from 'src/components/common';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import { POSoleSourcePayload } from 'src/queries/PurchaseOrders';
import { setFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import { getErrorMessage, getUncontrolledInputFieldProps } from 'src/utils';
import { PO_EQUIPMENT_INVENTORY_FORM_KEY } from './enum';
import { PO_FORM_KEY } from 'src/containers/PurchaseOrderContainer/enums';

const EquipmentInventoryForm: React.FC<Props> = ({
  formRef,
  formData,
  onSetFormData,
  disabled,
}) => {
  const history = useHistory();

  const handleFormSubmit = () => {
    handleSaveForm();
    Navigator.navigate(PATHS.createPurchaseOrders);
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

  const _getErrorMessage = (fieldName: PO_EQUIPMENT_INVENTORY_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Purchase Order No'}
              {..._getUncontrolledFieldProps(PO_FORM_KEY.NUMBER)}
              placeholder={'To be assigned'}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextArea
              label={
                '1. DESCRIPTION OF EQUIPMENT (provide a generic name describing the equipment and provide the manufacturer and model no.)'
              }
              errorMessage={_getErrorMessage(
                PO_EQUIPMENT_INVENTORY_FORM_KEY.DESCRIPTION_OF_EQUIPMENT
              )}
            />
          </Grid>
          <Grid item sm={12}>
            <TextArea
              label={
                '2. Indicate Building code (search for Building Code in UH KFS Maintenance tab, System Section, Building lookup) or address of where the equipment is to be located'
              }
              errorMessage={_getErrorMessage(
                PO_EQUIPMENT_INVENTORY_FORM_KEY.DESCRIPTION_OF_EQUIPMENT
              )}
            />
          </Grid>
          <Grid item sm={12}>
            <FormControl>
              <FormLabel id="equipment-inventory">Please select one of the following:</FormLabel>
              <RadioGroup aria-labelledby="equipment-inventory" name="equipment-inventory-group">
                <FormControlLabel
                  value="stand-alone"
                  control={<Checkbox />}
                  label="Stand-alone - defined as equipment which is $5000 and above and has a life expectancy of at least 1 year."
                />
                <FormControlLabel
                  value="interchangeable-equipment"
                  control={<Checkbox />}
                  label="Interchangeable Equipment - defined as equipment which is $5000 and above and has a life expectancy of 1 year but can be used interchangeably with other equipment and cannot function by itself."
                />
                <FormControlLabel
                  value="component"
                  control={<Checkbox />}
                  label="Component - an item that becomes a part of the existing equipment."
                />
              </RadioGroup>
              <Grid item sm={6} sx={{ paddingLeft: 4 }}>
                <Input
                  label={'Please indicate Decal or P.O. No. for component to be incorporated.'}
                />
              </Grid>
              <FormControlLabel
                sx={{ paddingLeft: 4 }}
                value="fabrication"
                control={<Checkbox />}
                label="Component is part of a Fabrication - an item that is to become part of something being built."
              />
              <Grid container spacing={3} sx={{ paddingLeft: 4 }}>
                <Grid item sm={6}>
                  <Input label={'Please provide the name of the finished product.'} />
                </Grid>
                <Grid item sm={6}>
                  <Input
                    label={'Please indicate Decal or P.O No. for component to be incorporated. '}
                  />
                </Grid>
              </Grid>
            </FormControl>
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

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentInventoryForm);
