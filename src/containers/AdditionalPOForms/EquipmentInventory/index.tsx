import { Box, Container, Grid, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Checkbox, EllipsisTooltipInput, Input, TextareaAutosize } from 'src/components/common';
import { initialEquipmentInventoryValue } from 'src/containers/PurchaseOrderContainer/constants';
import { PO_FORM_ELEMENT_ID, PO_FORM_PARAMS } from 'src/containers/PurchaseOrderContainer/enums';
import {
  POEquipmentInventoryFormValue,
  UpsertPOFormValue,
} from 'src/containers/PurchaseOrderContainer/types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import { getErrorMessage, getUncontrolledInputFieldProps } from 'src/utils';
import urljoin from 'url-join';
import HeaderOfSection from '../headerSection';
import {
  EQUIPMENT_INVENTORY_LABEL,
  optionCheckboxValue,
  PO_EQUIPMENT_INVENTORY_FORM_KEY,
} from './enum';

const EquipmentInventoryForm: React.FC<Props> = ({
  formRef,
  formData,
  onSetFormData,
  disabled = false,
  documentId,
  onSetIsImmutableFormData,
  hrefNavigationForm,
}) => {
  const history = useHistory();

  const handleFormSubmit = () => {
    handleSaveForm();
    if (documentId) {
      Navigator.navigate(
        `${urljoin(PATHS.purchaseOrderDetail, documentId)}?${PO_FORM_PARAMS.SCROLL_TO}=${
          PO_FORM_ELEMENT_ID.ADDITIONAL_FORMS
        }`
      );
    } else if (hrefNavigationForm) {
      Navigator.navigate(hrefNavigationForm);
    } else {
      Navigator.navigate(
        `${PATHS.createPurchaseOrders}?${PO_FORM_PARAMS.SCROLL_TO}=${PO_FORM_ELEMENT_ID.ADDITIONAL_FORMS}`
      );
    }
  };

  const handleResetForm = () => {
    onSetFormData<UpsertPOFormValue>({
      ...formData,
      equipmentInventory: initialEquipmentInventoryValue,
    });
    onSetIsImmutableFormData(true);
  };

  const formik = useFormik<POEquipmentInventoryFormValue>({
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
    onSetFormData<UpsertPOFormValue>({
      ...formData,
      equipmentInventory: values,
    });
    onSetIsImmutableFormData(true);
  }, [formData, onSetFormData, onSetIsImmutableFormData, values]);

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

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target?.checked;
    const nameFieldValue = event.target.name;

    // eslint-disable-next-line security/detect-object-injection
    if (checked && !values[nameFieldValue]) {
      setFieldValue(
        nameFieldValue,
        // eslint-disable-next-line security/detect-object-injection
        EQUIPMENT_INVENTORY_LABEL[nameFieldValue]
      );
    } else setFieldValue(nameFieldValue, '');
  };

  return (
    <Box>
      <Container maxWidth="lg">
        <SectionLayout
          header={
            <HeaderOfSection
              href={'https://www.rcuh.com/2-000/2-200/2-212/'}
              label={'RCUH Policy 2.212'}
            />
          }
        >
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
                  {..._getUncontrolledFieldProps(
                    PO_EQUIPMENT_INVENTORY_FORM_KEY.EQUIPMENT_DESCRIPTION
                  )}
                  disabled={disabled}
                />
              </Grid>

              <Grid item>
                <div style={{ display: 'contents', lineHeight: '2.5' }}>
                  <div style={{ display: 'contents' }}>2. Indicate Building Code</div>
                  <span> </span>
                  <div style={{ display: 'inline-block', width: '20%' }}>
                    <TextareaAutosize
                      maxLength={25}
                      resize="none"
                      style={{ padding: '0 2px', marginTop: '2px' }}
                      errorMessage={_getErrorMessage(PO_EQUIPMENT_INVENTORY_FORM_KEY.BUILDING_CODE)}
                      {..._getUncontrolledFieldProps(PO_EQUIPMENT_INVENTORY_FORM_KEY.BUILDING_CODE)}
                      disabled={disabled}
                    />
                  </div>
                  <span> </span>
                  <div style={{ display: 'contents' }}>
                    {' '}
                    (search for Building code in UH KFS Maintenance tab, System section, Building
                    lookup) or address of where the equipment is to be located:
                  </div>
                </div>

                <TextareaAutosize
                  errorMessage={_getErrorMessage(
                    PO_EQUIPMENT_INVENTORY_FORM_KEY.EQUIPMENT_LOCATION
                  )}
                  {..._getUncontrolledFieldProps(
                    PO_EQUIPMENT_INVENTORY_FORM_KEY.EQUIPMENT_LOCATION
                  )}
                  disabled={disabled}
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
                    <EllipsisTooltipInput
                      label={'Please indicate Decal or P.O. No. for component to be incorporated.'}
                      errorMessage={_getErrorMessage(PO_EQUIPMENT_INVENTORY_FORM_KEY.DECAL)}
                      {...getFieldProps(PO_EQUIPMENT_INVENTORY_FORM_KEY.DECAL)}
                      maxLength={250}
                      disabled={disabled}
                      lengthShowTooltip={65}
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
                    onChange={handleChangeValue}
                  />
                  <Grid item container spacing={2} sx={{ py: 1, flexDirection: 'column' }}>
                    <Grid item xs={6}>
                      <EllipsisTooltipInput
                        label={'Please provide the name of the finished product.'}
                        errorMessage={_getErrorMessage(
                          PO_EQUIPMENT_INVENTORY_FORM_KEY.FINISHED_PRODUCT_NAME
                        )}
                        {..._getUncontrolledFieldProps(
                          PO_EQUIPMENT_INVENTORY_FORM_KEY.FINISHED_PRODUCT_NAME
                        )}
                        maxLength={250}
                        disabled={disabled}
                        lengthShowTooltip={65}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <EllipsisTooltipInput
                        label={
                          'Please indicate Decal or P.O. No. for component to be incorporated.'
                        }
                        errorMessage={_getErrorMessage(PO_EQUIPMENT_INVENTORY_FORM_KEY.DECAL2)}
                        {..._getUncontrolledFieldProps(PO_EQUIPMENT_INVENTORY_FORM_KEY.DECAL2)}
                        maxLength={250}
                        disabled={disabled}
                        lengthShowTooltip={65}
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
        </SectionLayout>
        <SectionLayout>
          <Grid item container spacing={2}>
            <Grid item xs={6}>
              <EllipsisTooltipInput
                label={'Form Completed by'}
                errorMessage={_getErrorMessage(PO_EQUIPMENT_INVENTORY_FORM_KEY.COMPLETED_BY)}
                {..._getUncontrolledFieldProps(PO_EQUIPMENT_INVENTORY_FORM_KEY.COMPLETED_BY)}
                maxLength={250}
                disabled={disabled}
                lengthShowTooltip={65}
              />
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
  hrefNavigationForm: state.form.hrefNavigationForm,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentInventoryForm);
