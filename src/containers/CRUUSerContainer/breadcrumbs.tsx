import { Breadcrumbs, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';

const BreadcrumbsUserDetail: React.FC<Props> = ({ isViewMode }) => {
  const getTitleBreadcrumbs = () => {
    if (isViewMode) {
      return 'View/Edit';
    }
    return 'Add';
  };
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link to={PATHS.dashboard}>
        <TypographyLink>Main Menu</TypographyLink>
      </Link>
      <Typography variant="body2">Miscellaneous</Typography>
      <Link to={PATHS.userManagements}>
        <TypographyLink>User Management</TypographyLink>
      </Link>
      <Typography variant="body2">{getTitleBreadcrumbs()} User</Typography>
    </Breadcrumbs>
  );
};

type Props = {
  isViewMode: boolean;
};

export default BreadcrumbsUserDetail;
