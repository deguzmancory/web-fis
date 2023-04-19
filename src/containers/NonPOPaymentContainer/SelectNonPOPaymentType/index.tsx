import { FC, memo } from 'react';
import { Box, ButtonGroup, Container, Typography } from '@mui/material';
import { PATHS } from 'src/appConfig/paths';
import BreadcrumbsNonPOForm from '../shared/Breadcrumb';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { Button } from 'src/components/common';
import { COLOR_CODE } from 'src/appConfig/constants';
import { Navigator } from 'src/services';

const buttons = [
  {
    title: 'Authorization for Payment Form',
    path: PATHS.authorizationForPayment,
  },
  {
    title: 'Non-Employee Expense Payment Form',
    path: PATHS.nonEmployeeTravelPayment,
  },
  {
    title: 'Personal Automobile Mileage Voucher',
    path: PATHS.personalAutoPayment,
  },
  {
    title: 'Petty Cash Summary Sheet',
    path: PATHS.pettyCashPayment,
  },
];

const SelectNonPOType: FC<Props> = () => {
  const handleSelectFormType = (data: ArrayElement<typeof buttons>) => {
    Navigator.navigate(data.path);
  };

  return (
    <Box py={4} minHeight={'60vh'}>
      <Container maxWidth="lg">
        <BreadcrumbsNonPOForm />

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
                onClick={() => handleSelectFormType(button)}
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

type Props = {};

export default memo(SelectNonPOType);
