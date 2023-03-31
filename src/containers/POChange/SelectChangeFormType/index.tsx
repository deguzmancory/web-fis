import { Box, ButtonGroup, Container, Typography } from '@mui/material';
import React from 'react';
import { Button } from 'src/components/common';
import SectionLayout from 'src/containers/shared/SectionLayout';
import BreadcrumbsPOChangeForm from '../breadcrumbs';
import { PO_CHANGE_FORM_NUMBER, SELECT_CHANGE_FORM_TYPE_QUERY_KEY } from './enums';
import { useLocation } from 'react-router-dom';
import { usePostPoChangeType } from 'src/queries';
import { handleShowErrorMsg } from 'src/utils';
import { Navigator } from 'src/services';
import { PATHS } from 'src/appConfig/paths';
import { PO_CHANGE_FORM_QUERY_KEY } from '../POChangeForm/enums';

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

  const { postPoChangeType } = usePostPoChangeType({
    onError: (error) => {
      handleShowErrorMsg(error);
    },
  });

  const handleSelectChangeFormType = (formNumber: PO_CHANGE_FORM_NUMBER) => {
    postPoChangeType(
      {
        poId: documentId,
        formNumber: formNumber,
      },
      {
        onSettled: (data) => {
          //TODO: update to onSuccess
          Navigator.navigate(
            `${PATHS.poChangeForm}?${PO_CHANGE_FORM_QUERY_KEY.FORM_NUMBER}=${formNumber}`
          );
        },
      }
    );
  };

  return (
    <Box py={4}>
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
                  height: '50px',
                  borderBottom: index !== buttons.length - 1 && 'none',
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