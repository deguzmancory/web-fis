import { Breadcrumbs, Typography } from '@mui/material';
import { isEmpty } from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';
import { PO_DOCUMENT_TYPE } from 'src/queries';
import { setIsImmutableFormData } from 'src/redux/form/formSlice';
import { handleNavigateBackToMainForm } from './helpers';

const BreadcrumbsAdditionalPOForms: React.FC<Props> = ({ documentId, documentType }) => {
  const dispatch = useDispatch();
  const getTitleBreadcrumbs = () => {
    if (!isEmpty(documentId)) {
      return 'View/Edit';
    }
    return 'Create';
  };

  const getTitlePOForm = () => {
    switch (documentType) {
      case PO_DOCUMENT_TYPE.PO_CHANGE:
        return 'Change';
      case PO_DOCUMENT_TYPE.PO_PAYMENT:
        return 'Payment';
      default:
        return '';
    }
  };

  const handleNavigateForm = () => {
    dispatch(setIsImmutableFormData(true));
    handleNavigateBackToMainForm({ documentId, hrefNavigationForm: null, documentType });
  };

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link to={PATHS.dashboard}>
        <TypographyLink>Main Menu</TypographyLink>
      </Link>

      <Typography variant="body2">Purchasing (POs & PO Payments)</Typography>

      <Link to={null} onClick={() => handleNavigateForm()}>
        <TypographyLink>
          {getTitleBreadcrumbs()} PO {getTitlePOForm()}
        </TypographyLink>
      </Link>

      <Typography variant="body2">Additional Forms</Typography>
    </Breadcrumbs>
  );
};

type Props = {
  documentId: string;
  documentType: PO_DOCUMENT_TYPE;
};

export default BreadcrumbsAdditionalPOForms;
