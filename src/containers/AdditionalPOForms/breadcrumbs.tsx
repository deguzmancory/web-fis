import { Breadcrumbs, Typography } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';
import { setIsImmutableFormData } from 'src/redux/form/formSlice';

const BreadcrumbsAdditionalPOForms: React.FC<Props> = ({ isViewMode }) => {
  const dispatch = useDispatch();
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

      <Link
        to={PATHS.createPurchaseOrders}
        onClick={() => {
          dispatch(setIsImmutableFormData(true));
        }}
      >
        <TypographyLink>{getTitleBreadcrumbs()} PO</TypographyLink>
      </Link>

      <Typography variant="body2">Additional Forms</Typography>
    </Breadcrumbs>
  );
};

type Props = {
  isViewMode: boolean;
};

export default BreadcrumbsAdditionalPOForms;
