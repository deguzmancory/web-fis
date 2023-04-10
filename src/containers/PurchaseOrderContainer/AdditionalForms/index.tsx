import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Select } from 'src/components/common';
import { SelectOption } from 'src/components/common/Select';
import { PO_ADDITIONAL_FORM_PARAMS } from 'src/containers/AdditionalPOForms/enum';
import { AdditionalPOForm } from 'src/queries/PurchaseOrders';
import { setFormData } from 'src/redux/form/formSlice';
import { Navigator } from 'src/services';
import { externalFormAttachments } from '../helpers/constants';
import { PO_FORM_ELEMENT_ID, PO_FORM_KEY } from '../enums';
import { AdditionalPOFormValue, UpsertPOFormikProps } from '../types';
import FormAttachmentItem from './formAttachmentItem';
import { stringify } from 'src/utils';
import { isEmpty } from 'lodash';

const AdditionalForms: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { id } = useParams<{ id: string }>();
  const [selectedForm, setSelectedForm] = React.useState<AdditionalPOForm>(null);
  const dispatch = useDispatch();

  const { values, setFieldValue } = formikProps;
  const allowAddAdditionalForm = !disabled;
  const allowEditAdditionalForm = !disabled;

  const availableFormOptions: SelectOption[] = React.useMemo(
    () =>
      values.availableForms.map((form) => ({
        label: form.name,
        value: form,
      })),
    [values.availableForms]
  );

  React.useEffect(() => {
    if (!isEmpty(availableFormOptions)) {
      setSelectedForm(availableFormOptions[0].value);
    }
  }, [availableFormOptions]);

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
        const sortedUpdatedAvailableAttachments = [
          ...currentAvailableAttachments,
          targetFormAttachment,
        ].sort(
          (prevAttachment, nextAttachment) =>
            Number(prevAttachment.accessKey) - Number(nextAttachment.accessKey)
        );

        setFieldValue(`${PO_FORM_KEY.AVAILABLE_FORMS}`, sortedUpdatedAvailableAttachments);
      }
    },
    [currentFormAttachments, setFieldValue, values.availableForms]
  );

  const handleEditFormClick = React.useCallback(
    (targetFormAttachment: AdditionalPOFormValue) => {
      const documentIdParam = !!id ? `?${PO_ADDITIONAL_FORM_PARAMS.DOCUMENT_ID}=${id}` : '';

      dispatch(setFormData(values));
      Navigator.navigate(`${targetFormAttachment.href}${documentIdParam}`);
    },
    [dispatch, values, id]
  );

  const handleViewFormClick = React.useCallback(
    (targetFormAttachment: AdditionalPOFormValue) => {
      if (targetFormAttachment.isExternalUrl) {
        window.open(targetFormAttachment.href, '_blank', 'noreferrer');
      } else {
        const params = {
          [PO_ADDITIONAL_FORM_PARAMS.DOCUMENT_ID]: id,
          [PO_ADDITIONAL_FORM_PARAMS.VIEW_ONLY]: true,
        };

        dispatch(setFormData(values));
        Navigator.navigate(`${targetFormAttachment.href}?${stringify(params)}`);
      }
    },
    [dispatch, values, id]
  );

  return (
    <Box id={PO_FORM_ELEMENT_ID.ADDITIONAL_FORMS}>
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
            <FormAttachmentItem
              formAttachments={currentFormAttachments}
              onEditClick={handleEditFormClick}
              onViewClick={handleViewFormClick}
              onRemoveClick={handleRemoveForm}
              allowEdit={allowEditAdditionalForm}
            />
            <FormAttachmentItem
              formAttachments={externalFormAttachments}
              onViewClick={handleViewFormClick}
              allowEdit={allowEditAdditionalForm}
            />
          </Grid>
        </Grid>

        {allowAddAdditionalForm && (
          <Grid item xs={1}>
            <Box alignSelf={'end'} ml={2}>
              <Button onClick={handleAddForm}>Add</Button>
            </Box>
          </Grid>
        )}
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
