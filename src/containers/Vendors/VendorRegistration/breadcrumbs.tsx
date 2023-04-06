import { Breadcrumbs, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';
import { VENDOR_REGISTRATION_NAVIGATE_FROM, VENDOR_REGISTRATION_PARAMS } from './enums';
import { useDispatch } from 'react-redux';
import { setIsImmutableFormData } from 'src/redux/form/formSlice';

const BreadcrumbsVendorRegistration: React.FC<Props> = ({ isFrom }) => {
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location]);
  const documentId = query.get(VENDOR_REGISTRATION_PARAMS.DOCUMENT_ID) || null;
  const dispatch = useDispatch();

  const getSubLink = React.useCallback((): Array<React.ReactElement> => {
    switch (isFrom) {
      case VENDOR_REGISTRATION_NAVIGATE_FROM.PO:
        return [
          <Typography variant="body2">Purchasing (POs & PO Payments)</Typography>,
          <RouterLink
            to={
              documentId ? `${PATHS.purchaseOrderDetail}/${documentId}` : PATHS.createPurchaseOrders
            }
            onClick={() => {
              dispatch(setIsImmutableFormData(true));
            }}
          >
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
  }, [dispatch, documentId, isFrom]);

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
