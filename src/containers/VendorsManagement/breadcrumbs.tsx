import { Breadcrumbs, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';

const BreadcrumbsVendorsListing = () => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link to={PATHS.dashboard}>
        <TypographyLink>Main Menu</TypographyLink>
      </Link>
      <Typography variant="body2">Miscellaneous</Typography>
      <Typography variant="body2">Vendors</Typography>
    </Breadcrumbs>
  );
};

export default BreadcrumbsVendorsListing;
