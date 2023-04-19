import { Breadcrumbs, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';

const BreadcrumbsNonPOForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  return (
    <Breadcrumbs>
      <Link to={PATHS.dashboard}>
        <TypographyLink>Main Menu</TypographyLink>
      </Link>
      <Typography variant="body2">Non-PO Payments</Typography>
      <Typography variant="body2">
        {isEdit ? 'View / Edit Non-PO Payments' : 'Create Non-PO Payments'}
      </Typography>
    </Breadcrumbs>
  );
};

export default BreadcrumbsNonPOForm;
