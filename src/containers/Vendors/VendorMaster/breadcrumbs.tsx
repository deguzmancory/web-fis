import { Breadcrumbs, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';

const BreadcrumbsVendorMaster: React.FC<Props> = () => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <RouterLink to={PATHS.dashboard}>
        <TypographyLink>Main Menu</TypographyLink>
      </RouterLink>
      <Typography variant="body2">Miscellaneous</Typography>
      <RouterLink to={PATHS.vendors}>
        <TypographyLink>Search Vendors</TypographyLink>
      </RouterLink>
      <Typography variant="body2">Vendor Master</Typography>
    </Breadcrumbs>
  );
};

type Props = {};

export default React.memo(BreadcrumbsVendorMaster);
