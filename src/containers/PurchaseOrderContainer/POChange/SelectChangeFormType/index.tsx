import { Box, ButtonGroup, Container, Typography } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Button } from 'src/components/common';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { useCreatePOChange } from 'src/queries';
import { PO_CHANGE_FORM_NUMBER } from 'src/queries/POChange/enums';
import { Navigator } from 'src/services';
import { handleShowErrorMsg } from 'src/utils';
import BreadcrumbsPOChangeForm from '../breadcrumbs';
import { SELECT_CHANGE_FORM_TYPE_QUERY_KEY } from './enums';
import { COLOR_CODE } from 'src/appConfig/constants';

const buttons = [
  {
    title: 'Total Cancellation of Purchase Order',
    value: PO_CHANGE_FORM_NUMBER.TOTAL_CANCELLATION_NUMBER,
  },
  {
    title: 'Change Descriptions of Line Items Only',
    value: PO_CHANGE_FORM_NUMBER.CHANGE_DESCRIPTION_NUMBER,
  },
  {
    title:
      'Increase/Decrease Balance; Change Description, Budget Category, or Project/Account Number',
    value: PO_CHANGE_FORM_NUMBER.INCREASE_DECREASE_AMOUNT_NUMBER,
  },
  {
    title:
      'For Terminated Projects (Internal Purposes Only) - Decrease Balance, Change Description, Add New Project/Account Number',
    value: PO_CHANGE_FORM_NUMBER.INCREASE_DECREASE_AMOUNT_TERMINATED_NUMBER,
  },
];

const SelectChangeFormType: React.FC<Props> = ({ disabled = false }) => {
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location]);
  const documentId = React.useMemo(
    () => query.get(SELECT_CHANGE_FORM_TYPE_QUERY_KEY.DOCUMENT_ID) || null,
    [query]
  );

  const { createPOChange } = useCreatePOChange({
    onError: (error) => {
      handleShowErrorMsg(error);
    },
  });

  const handleSelectChangeFormType = (formNumber: PO_CHANGE_FORM_NUMBER) => {
    createPOChange(
      {
        poId: documentId,
        formNumber: formNumber,
      },
      {
        onSuccess: ({ data }) => {
          Navigator.navigate(`${PATHS.poChangeForm}/${data.id}`);
        },
      }
    );
  };

  return (
    <Box py={4} minHeight={'60vh'}>
      <Container maxWidth="lg">
        <BreadcrumbsPOChangeForm />

        <SectionLayout sx={{ p: 4 }}>
          <Typography variant="body1" fontWeight={'bold'}>
            Please choose Purchase Order Change Form type:
          </Typography>
          <ButtonGroup orientation="vertical" sx={{ mt: 2 }} fullWidth>
            {buttons.map((button, index) => (
              <Button
                variant="outline"
                key={button.title}
                style={{
                  textAlign: 'left',
                  display: 'block',
                  marginTop: '0px',
                  height: '32px',
                  border: COLOR_CODE.DEFAULT_BORDER,
                  borderBottom: index !== buttons.length - 1 ? 'none' : COLOR_CODE.DEFAULT_BORDER,
                }}
                fontWeightNormal
                onClick={() => handleSelectChangeFormType(button.value)}
              >
                {button.title}
              </Button>
            ))}
          </ButtonGroup>
        </SectionLayout>
      </Container>
    </Box>
  );
};

type Props = {
  disabled?: boolean;
};

export default React.memo(SelectChangeFormType);
