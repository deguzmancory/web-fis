import { Box, Container, Stack, Typography } from '@mui/material';
import React from 'react';
import SectionLayout from 'src/containers/shared/SectionLayout';
import BreadcrumbsVendorMaster from './breadcrumbs';
import TitleVendorMaster from './title';
import EditVendorMaster from './Edit';

const VendorMasterWrapper = () => {
  return (
    <Box py={2} minHeight={'50vh'}>
      <Container maxWidth="lg">
        <BreadcrumbsVendorMaster />

        <TitleVendorMaster />

        <SectionLayout
          header={
            <Stack direction={'row'} alignItems={'center'} justifyContent="end">
              <Typography>
                <span className="has-text-danger fw-bold text-is-16">**</span> = required to Save
              </Typography>
            </Stack>
          }
        >
          <EditVendorMaster />
        </SectionLayout>
      </Container>
    </Box>
  );
};

export default VendorMasterWrapper;
