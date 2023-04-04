import { Box, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { FormikProps } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';
import { hideAllDialog, hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { setHrefNavigateAdditionalForm, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { Navigator } from 'src/services';
import { AdditionalPOFormValue } from '../PurchaseOrderContainer/types';
import SectionLayout from '../shared/SectionLayout';

const FooterSection: React.FC<Props> = ({
  formCode,
  formAttachments,
  onSetIsImmutableFormData,
  onShowDialog,
  onHideDialog,
  onHideAllDialog,
  formRef,
  onSetHrefNavigationForm,
}) => {
  const handleClick = (href?: string) => {
    if (formRef.current.dirty) {
      onShowDialog({
        type: DIALOG_TYPES.YESNO_DIALOG,
        data: {
          title: `Leave page? `,
          content: `There are unsaved changes on the Form. Do you want to save before leaving?`,
          okText: 'Save',
          cancelText: 'Cancel',
          onOk: () => {
            onHideDialog();
            formRef.current.handleSubmit();
            onSetHrefNavigationForm(href);
          },
          onCancel: () => {
            onHideAllDialog();
            Navigator.navigate(href);
          },
        },
      });
    } else {
      onSetIsImmutableFormData(true);
      Navigator.navigate(href);
    }
  };

  return (
    <Box>
      <Container maxWidth="lg">
        <SectionLayout>
          <Typography variant="h5" mb={2}>
            Purchase Requisition Attachment Navigator
          </Typography>
          <Stack direction={'row'} alignItems="center" flexWrap="wrap">
            <Box mr={2}>
              <TypographyLink onClick={() => handleClick(PATHS.createPurchaseOrders)}>
                Purchase Requisition
              </TypographyLink>
            </Box>
            {formAttachments?.map((item) => (
              <Box py={1} mr={2}>
                {item.code === formCode ? (
                  <Typography whiteSpace="nowrap" variant="body2">
                    {item.name}
                  </Typography>
                ) : (
                  <TypographyLink onClick={() => handleClick(item?.href)}>
                    {item.name}
                  </TypographyLink>
                )}
              </Box>
            ))}
          </Stack>
        </SectionLayout>
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    formCode: string;
    formAttachments: AdditionalPOFormValue[];
    formRef: RefObject<FormikProps<any>>;
  };

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onSetIsImmutableFormData: setIsImmutableFormData,
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
  onHideAllDialog: hideAllDialog,
  onSetHrefNavigationForm: setHrefNavigateAdditionalForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(FooterSection);
