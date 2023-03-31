import { Breadcrumbs, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';
import { VENDOR_REGISTRATION_NAVIGATE_FROM } from './enums';

const BreadcrumbsVendorRegistration: React.FC<Props> = ({ isFrom }) => {
  const getSubLink = React.useCallback((): Array<React.ReactElement> => {
    switch (isFrom) {
      case VENDOR_REGISTRATION_NAVIGATE_FROM.PO:
        return [
          <Typography variant="body2">Purchasing (POs & PO Payments)</Typography>,
          <RouterLink to={PATHS.dashboard}>
            <TypographyLink>Create PO</TypographyLink>
          </RouterLink>,
          <Typography variant="body2">Create Vendor</Typography>,
        ];

      case VENDOR_REGISTRATION_NAVIGATE_FROM.VIEW_VENDOR_REGISTRATION:
        return [
          <Typography variant="body2">Miscellaneous</Typography>,
          <RouterLink to={PATHS.vendors}>
            <TypographyLink>Search Vendors</TypographyLink>
          </RouterLink>,
          <Typography variant="body2">View Vendor Registration</Typography>,
        ];

      default:
        return [
          <Typography variant="body2">Miscellaneous</Typography>,
          <RouterLink to={PATHS.vendors}>
            <TypographyLink>Search Vendors</TypographyLink>
          </RouterLink>,
          <Typography variant="body2">Create Vendor</Typography>,
        ];
    }
  }, [isFrom]);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <RouterLink to={PATHS.dashboard}>
        <TypographyLink>Main Menu</TypographyLink>
      </RouterLink>
      {getSubLink().map((item, index) => {
        return React.cloneElement(item, {
          key: index,
        });
      })}
    </Breadcrumbs>
  );
};

type Props = {
  isFrom: VENDOR_REGISTRATION_NAVIGATE_FROM;
};

export default BreadcrumbsVendorRegistration;