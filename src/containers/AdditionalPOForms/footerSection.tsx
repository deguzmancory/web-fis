import { Box, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { FormikProps } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import TypographyLink from 'src/components/TypographyLink';
import { hideAllDialog, hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { setHrefNavigateAdditionalForm, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { Navigator, Toastify } from 'src/services';
import SectionLayout from '../shared/SectionLayout';
import { useLocation } from 'react-router-dom';
import { handleNavigateBackToMainForm } from './helpers';
import { PO_DOCUMENT_TYPE } from 'src/queries';
import { AdditionalPOFormValue } from '../PurchaseOrderContainer/PO/types';

const FooterSection: React.FC<Props> = ({
  formCode,
  formAttachments,
  documentId,
  documentType,
  onSetIsImmutableFormData,
  onShowDialog,
  onHideDialog,
  onHideAllDialog,
  formRef,
  onSetHrefNavigationForm,
}) => {
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location]);

  const handleClick = (href?: string) => {
    const navigateHref = `${href}?${query.toString()}`;

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
            onSetHrefNavigationForm(navigateHref);
          },
          onCancel: () => {
            onHideAllDialog();
            Navigator.navigate(navigateHref);
            Toastify.success('Dismiss changes successfully.');
          },
        },
      });
    } else {
      onSetIsImmutableFormData(true);
      Navigator.navigate(navigateHref);
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
              <TypographyLink
                onClick={() =>
                  handleNavigateBackToMainForm({
                    documentId,
                    documentType,
                    hrefNavigationForm: null,
                  })
                }
              >
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
    documentId: string;
    documentType: PO_DOCUMENT_TYPE;
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
