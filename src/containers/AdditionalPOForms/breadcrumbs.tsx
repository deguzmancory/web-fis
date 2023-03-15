import { Breadcrumbs, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';

const BreadcrumbsAdditonalPOForms: React.FC<Props> = ({ isViewMode }) => {
  const getTitleBreadcrumbs = () => {
    if (isViewMode) {
      return 'View/Edit';
    }
    return 'Create';
  };
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link to={PATHS.dashboard}>
        <TypographyLink>Main Menu</TypographyLink>
      </Link>

      <Typography variant="body2">Purchasing (POs & PO Payments)</Typography>

      <Link to={PATHS.createPurchaseOrders}>
        <TypographyLink>{getTitleBreadcrumbs()} PO</TypographyLink>
      </Link>

      <Typography variant="body2">Additional Forms</Typography>
    </Breadcrumbs>
  );
};

type Props = {
  isViewMode: boolean;
};

export default BreadcrumbsAdditonalPOForms;
