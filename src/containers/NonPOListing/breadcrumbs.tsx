import { Breadcrumbs, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';

const BreadcrumbsNonPOListing = () => {
  return (
    <Breadcrumbs>
      <Link to={PATHS.dashboard}>
        <TypographyLink>Main Menu</TypographyLink>
      </Link>
      <Typography variant="body2">Non-PO Payments</Typography>
    </Breadcrumbs>
  );
};

export default BreadcrumbsNonPOListing;
