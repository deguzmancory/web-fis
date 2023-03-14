import { Box, Container, Grid, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Checkbox, Input, TextareaAutosize } from 'src/components/common';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import { POEquipmentInventoryPayload } from 'src/queries/PurchaseOrders';
import { setFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import { getErrorMessage, getUncontrolledInputFieldProps } from 'src/utils';
import { PO_EQUIPMENT_INVENTORY_FORM_KEY, optionCheckboxValue } from './enum';
import { PO_ADDITIONAL_FORM_KEY, PO_ADDITIONAL_FORM_PARAMS } from '../enum';
import { initialEquipmentInventoryValue } from 'src/containers/PurchaseOrderContainer/constants';
import Layout from 'src/containers/CRUUSerContainer/layout';

const EquipmentInventoryForm: React.FC<Props> = ({
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
    onSetFormData<UpsertPOFormValue>({
      ...formData,
      equipmentInventory: initialEquipmentInventoryValue,
    });
  };

  const formik = useFormik<POEquipmentInventoryPayload>({
    initialValues: formData?.equipmentInventory || initialEquipmentInventoryValue,
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
    onSetFormData<UpsertPOFormValue>({ ...formData, equipmentInventory: values });
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
      <Container maxWidth="lg">
        <Layout>
          <Grid container spacing={2}>
            <Grid item container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Input label={'Purchase Order No'} value={formData?.number} name="" disabled />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  1. DESCRIPTION OF EQUIPMENT (provide a generic name describing the equipment and
                  provide the manufacturer and model no.)
                </Typography>
                <TextareaAutosize
                  errorMessage={_getErrorMessage(
                    PO_EQUIPMENT_INVENTORY_FORM_KEY.EQUIPMENT_DESCRIPTION
                  )}
                  {...getFieldProps(PO_EQUIPMENT_INVENTORY_FORM_KEY.EQUIPMENT_DESCRIPTION)}
                />
              </Grid>

              <Grid item xs={2.29} className="justify-flex-end">
                <Typography variant="body1">2. Indicate Building Code</Typography>
              </Grid>
              <Grid item xs={3} sx={{ marginLeft: -2 }}>
                <Input
                  errorMessage={_getErrorMessage(PO_EQUIPMENT_INVENTORY_FORM_KEY.BUILDING_CODE)}
                  {...getFieldProps(PO_EQUIPMENT_INVENTORY_FORM_KEY.BUILDING_CODE)}
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs={6.6} className="justify-flex-end" sx={{ marginLeft: -3 }}>
                <Typography variant="body1">
                  (search for Building code in UH KFS Maintenance tab, System section, Building
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ marginTop: -2 }}>
                <Typography variant="body1">
                  lookup) or address of where the equipment is to be located:
                </Typography>
                <TextareaAutosize
                  errorMessage={_getErrorMessage(
                    PO_EQUIPMENT_INVENTORY_FORM_KEY.EQUIPMENT_LOCATION
                  )}
                  {...getFieldProps(PO_EQUIPMENT_INVENTORY_FORM_KEY.EQUIPMENT_LOCATION)}
                />
              </Grid>
            </Grid>
            <Grid item container>
              <Grid item xs={12}>
                <Typography sx={{ paddingBottom: 1 }} variant="body1">
                  3. Please check one of the following:
                </Typography>
                <Checkbox.Group
                  columns={1}
                  options={optionCheckboxValue}
                  errorMessage={_getErrorMessage(PO_EQUIPMENT_INVENTORY_FORM_KEY.EQUIPMENT_TYPE)}
                  {...getFieldProps(PO_EQUIPMENT_INVENTORY_FORM_KEY.EQUIPMENT_TYPE)}
                  disabled={disabled}
                  onChange={setFieldValue}
                />
                <Grid item container sx={{ px: 2 }}>
                  <Grid item xs={6} sx={{ mb: 1 }}>
                    <Input
                      label={'Please indicate Decal or P.O. No. for component to be incorporated.'}
                      errorMessage={_getErrorMessage(PO_EQUIPMENT_INVENTORY_FORM_KEY.DECAL)}
                      {...getFieldProps(PO_EQUIPMENT_INVENTORY_FORM_KEY.DECAL)}
                      disabled={disabled}
                    />
                  </Grid>
                  <Checkbox.Item
                    label={
                      'Component is part of a Fabrication - an item that is to become part of something being built.'
                    }
                    {...getFieldProps(PO_EQUIPMENT_INVENTORY_FORM_KEY.PART_OF_FABRICATION)}
                    errorMessage={_getErrorMessage(
                      PO_EQUIPMENT_INVENTORY_FORM_KEY.PART_OF_FABRICATION
                    )}
                    disabled={disabled}
                  />
                  <Grid item container spacing={2} sx={{ py: 1 }}>
                    <Grid item xs={6}>
                      <Input
                        label={'Please provide the name of the finished product.'}
                        errorMessage={_getErrorMessage(
                          PO_EQUIPMENT_INVENTORY_FORM_KEY.FINISHED_PRODUCT_NAME
                        )}
                        {...getFieldProps(PO_EQUIPMENT_INVENTORY_FORM_KEY.FINISHED_PRODUCT_NAME)}
                        disabled={disabled}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Input
                        label={
                          'Please indicate Decal or P.O. No. for component to be incorporated.'
                        }
                        errorMessage={_getErrorMessage(PO_EQUIPMENT_INVENTORY_FORM_KEY.DECAL2)}
                        {...getFieldProps(PO_EQUIPMENT_INVENTORY_FORM_KEY.DECAL2)}
                        disabled={disabled}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              NOTE: A FORM MUST BE SUBMITTED FOR EACH PIECE OF EQUIPMENT TO BE ISSUED A DECAL.
              FAILURE TO COMPLETE THIS FORM AND ATTACH TO ALL EQUIPMENT PURCHASE ORDERS WILL DELAY
              PROCESSING.
            </Typography>
          </Grid>
        </Layout>
        <Layout>
          <Grid item container spacing={2}>
            <Grid item xs={6}>
              <Input
                label={'Form Completed By'}
                errorMessage={_getErrorMessage(PO_EQUIPMENT_INVENTORY_FORM_KEY.COMPLETED_BY)}
                {...getFieldProps(PO_EQUIPMENT_INVENTORY_FORM_KEY.COMPLETED_BY)}
                disabled={disabled}
              />
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

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentInventoryForm);
