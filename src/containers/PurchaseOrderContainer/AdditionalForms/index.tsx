import { Box, Grid, Typography } from '@mui/material';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Select } from 'src/components/common';
import { SelectOption } from 'src/components/common/Select';
import TypographyLink from 'src/components/TypographyLink';
import { AdditionalPOForm } from 'src/queries/PurchaseOrders';
import { Navigator } from 'src/services';
import { PO_FORM_KEY } from '../enums';
import { AdditionalPOFormValue, UpsertPOFormikProps } from '../types';
import { setFormData } from 'src/redux/form/formSlice';
import { PO_ADDITIONAL_FORM_KEY } from 'src/containers/AdditionalPOForms/enum';

const AdditionalForms: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const [selectedForm, setSelectedForm] = React.useState<AdditionalPOForm>(null);
  const dispatch = useDispatch();

  const { values, setFieldValue } = formikProps;

  const availableFormOptions: SelectOption[] = React.useMemo(
    () =>
      values.availableForms.map((form) => ({
        label: form.name,
        value: form,
      })),
    [values.availableForms]
  );

  const currentFormAttachments = React.useMemo(
    () => values.formAttachments,
    [values.formAttachments]
  );

  const handleAddForm = React.useCallback(() => {
    const currentAvailableAttachments = values.availableForms;

    if (!selectedForm) return;

    if (
      !currentFormAttachments.some((formAttachment) => formAttachment.code === selectedForm.code)
    ) {
      setFieldValue(`${PO_FORM_KEY.FORM_ATTACHMENTS}`, [...currentFormAttachments, selectedForm]);
      setFieldValue(
        `${PO_FORM_KEY.AVAILABLE_FORMS}`,
        currentAvailableAttachments.filter(
          (availableAttachment) => availableAttachment.code !== selectedForm.code
        )
      );
    }

    setSelectedForm(null);
  }, [values.availableForms, setFieldValue, currentFormAttachments, selectedForm]);

  const handleRemoveForm = React.useCallback(
    (targetFormAttachment: AdditionalPOFormValue) => {
      const currentAvailableAttachments = values.availableForms;

      setFieldValue(
        `${PO_FORM_KEY.FORM_ATTACHMENTS}`,
        currentFormAttachments.filter(
          (formAttachment) => formAttachment.code !== targetFormAttachment.code
        )
      );

      if (
        !currentAvailableAttachments.some(
          (availableAttachment) => availableAttachment.code === targetFormAttachment.code
        )
      ) {
        setFieldValue(`${PO_FORM_KEY.AVAILABLE_FORMS}`, [
          ...currentAvailableAttachments,
          targetFormAttachment,
        ]);
      }
    },
    [currentFormAttachments, setFieldValue, values.availableForms]
  );

  const handleEditFormClick = React.useCallback(
    (targetFormAttachment: AdditionalPOFormValue) => {
      if (targetFormAttachment.isExternalLink) {
        window.open(targetFormAttachment.href, '_blank', 'noreferrer');
      } else {
        dispatch(setFormData(values));
        Navigator.navigate(targetFormAttachment.href);
      }
    },
    [dispatch, values]
  );

  return (
    <Box id={PO_ADDITIONAL_FORM_KEY.ADDITIONAL_FORMS}>
      <Typography variant="h5">Additional Forms included:</Typography>

      <Grid container mt={2}>
        <Grid item xs={7}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Select
                label={''}
                placeholder={'Select'}
                options={availableFormOptions}
                value={selectedForm}
                hideSearchIcon
                isClearable={true}
                onChange={(_name, value) => setSelectedForm(value)}
                optionWithSubLabel
                isDisabled={disabled}
              />
            </Grid>
            {currentFormAttachments.map((formAttachment) => {
              return (
                <Fragment key={formAttachment.code}>
                  <Grid item xs={10}>
                    <Typography>{formAttachment.name}</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <TypographyLink onClick={() => handleEditFormClick(formAttachment)}>
                      {formAttachment.isExternalLink ? 'Link' : 'Edit'}
                    </TypographyLink>
                  </Grid>
                  <Grid item xs={1}>
                    <TypographyLink onClick={() => handleRemoveForm(formAttachment)}>
                      Remove
                    </TypographyLink>
                  </Grid>
                </Fragment>
              );
            })}
          </Grid>
        </Grid>

        <Grid item xs={1}>
          <Box alignSelf={'end'} ml={2}>
            <Button onClick={handleAddForm}>Add</Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpsertPOFormikProps;
  disabled?: boolean;
};
export default React.memo(AdditionalForms, (_prevProps, _nextProps) => {
  //return false will always re-render this component when props change (same as default behavior of not using React.memo)
  // => always update formikValues for jump to another additional form purpose
  return false;
});
