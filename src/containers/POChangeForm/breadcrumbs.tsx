import { Breadcrumbs, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';

const BreadcrumbsPOChangeForm = () => {
  return (
    <Breadcrumbs>
      <Link to={PATHS.dashboard}>
        <TypographyLink>Main Menu</TypographyLink>
      </Link>
      <Typography variant="body2">Purchasing (POs & PO Payments)</Typography>
      <Typography variant="body2">Create PO Change Form</Typography>
    </Breadcrumbs>
  );
};

export default BreadcrumbsPOChangeForm;
