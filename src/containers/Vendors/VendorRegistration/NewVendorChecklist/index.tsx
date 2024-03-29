import { Box, Link, Stack, Typography } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { COLOR_CODE, NO_OPENER } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import { Button } from 'src/components/common';
import { useCreateVendorRegistration } from 'src/queries';
import { setIsImmutableFormData } from 'src/redux/form/formSlice';
import { Callback } from 'src/redux/types';
import { Navigator } from 'src/services';
import urljoin from 'url-join';
import { VENDOR_REGISTRATION_NAVIGATE_FROM, VENDOR_REGISTRATION_PARAMS } from '../enums';
import CheckboxIcon from './checkboxIcon';

const NewVendorCheckList: React.FC<Props> = ({ onNextPage }) => {
  const dispatch = useDispatch();

  // using params here to redirect to previous section instead of using state of location
  // => increase more certain redirect
  const history = useHistory();
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location]);
  const redirectSection = query.get(
    VENDOR_REGISTRATION_PARAMS.CALLING_FROM
  ) as VENDOR_REGISTRATION_NAVIGATE_FROM;
  const documentId = query.get(VENDOR_REGISTRATION_PARAMS.DOCUMENT_ID) || '';

  const { createVendorRegistrationAsync, isLoading } = useCreateVendorRegistration();

  const handleCreateNewVendorClick = async () => {
    const { data } = await createVendorRegistrationAsync({});

    query.set(VENDOR_REGISTRATION_PARAMS.VENDOR_REGISTRATION_ID, data.id);
    history.push({ search: query.toString() });
    onNextPage();
  };

  const handleCancelClick = () => {
    switch (redirectSection) {
      case VENDOR_REGISTRATION_NAVIGATE_FROM.PO: {
        dispatch(setIsImmutableFormData(true));
        if (documentId) {
          return Navigator.navigate(urljoin(PATHS.purchaseOrderDetail, documentId));
        } else {
          return Navigator.navigate(PATHS.createPurchaseOrders);
        }
      }
      case VENDOR_REGISTRATION_NAVIGATE_FROM.NON_EMPLOYEE_TRAVEL_PAYMENT: {
        dispatch(setIsImmutableFormData(true));
        if (documentId) {
          return Navigator.navigate(urljoin(PATHS.nonEmployeeTravelPaymentDetail, documentId));
        } else {
          return Navigator.navigate(PATHS.createNonEmployeeTravelPayment);
        }
      }
      case VENDOR_REGISTRATION_NAVIGATE_FROM.AUTHORIZATION_PAYMENT: {
        dispatch(setIsImmutableFormData(true));
        if (documentId) {
          return Navigator.navigate(urljoin(PATHS.authorizationForPaymentDetail, documentId));
        } else {
          return Navigator.navigate(PATHS.createAuthorizationForPayment);
        }
      }
      case VENDOR_REGISTRATION_NAVIGATE_FROM.PERSONAL_AUTO_PAYMENT: {
        dispatch(setIsImmutableFormData(true));
        if (documentId) {
          return Navigator.navigate(urljoin(PATHS.personalAutoPaymentDetail, documentId));
        } else {
          return Navigator.navigate(PATHS.createPersonalAutoPayment);
        }
      }
      case VENDOR_REGISTRATION_NAVIGATE_FROM.PETTY_CASH_PAYMENT: {
        dispatch(setIsImmutableFormData(true));
        if (documentId) {
          return Navigator.navigate(urljoin(PATHS.pettyCashPaymentDetail, documentId));
        } else {
          return Navigator.navigate(PATHS.createPettyCashPayment);
        }
      }

      default:
        Navigator.navigate(PATHS.vendors);
        return;
    }
  };

  return (
    <Box>
      {/* Title */}
      <Box>
        <Typography variant="h2" mt={2} mb={1}>
          Create New Vendor Checklist
        </Typography>
        <Typography variant="body2">
          Answer the following questions before creating a new vendor record.
        </Typography>
      </Box>
      {/* Title */}

      <Layout title={'1. Is this a BRAND NEW VENDOR that DOES NOT currently exist?'}>
        <Typography variant="body1">
          ALWAYS SEARCH THE VENDOR LISTING FOR AN EXISTING VENDOR RECORD PRIOR TO CREATING A NEW
          VENDOR RECORD. <b>DO NOT CREATE A NEW VENDOR RECORD IF THE VENDOR ALREADY EXISTS.</b>
        </Typography>
        <TypographyListItem>
          Temporary address changes can be made on a Purchase Requisition by overwriting (typing
          over) the retrieved address from the vendor record. This will not change the stored vendor
          record address.{' '}
          <TypographyLink href="https://www.rcuh.com/2-000/2-300/2-301/">
            Refer to RCUH Policy 2.301.
          </TypographyLink>
        </TypographyListItem>
        <TypographyListItem>
          Temporary address changes can be made on a PO or AFP check payment by entering a different
          address in the payment remittance section. This will not change the stored vendor record
          address.{' '}
          <TypographyLink href="https://www.rcuh.com/2-000/2-300/2-301/">
            Refer to RCUH Policy 2.301.
          </TypographyLink>
        </TypographyListItem>
        <TypographyListItem>
          To make permanent vendor record changes, email your request to{' '}
          <TypographyLink href="mailto:rcuhdisb@rcuh.com">rcuhdisb@rcuh.com</TypographyLink>..
        </TypographyListItem>
      </Layout>

      <Layout title={`2. Is the vendor one of the following?`}>
        {[
          'U.S. Entity (created under the laws of the 50 states and the District of Columbia)',
          'U.S. Individual (U.S. citizen, Permanent Resident Alien)',
          'RCUH Employee',
          'UH Employee',
        ].map((item) => (
          <TypographyListItem key={item}>{item}</TypographyListItem>
        ))}

        <Typography variant="body1" mt={2}>
          A VENDOR RECORD FOR A FOREIGN VENDOR IS REQUIRED TO BE CREATED BY RCUH DISBURSING.
          Complete and email the{' '}
          <TypographyLink href="https://www.rcuh.com/document-library/2-000/disbursing-payments/attachment-50-foreign-vendor-registration-form/">
            Foreign Vendor Registration Form
          </TypographyLink>{' '}
          with required documentation to{' '}
          <TypographyLink href="mailto:rcuhdisb@rcuh.com">rcuhdisb@rcuh.com</TypographyLink>.
        </Typography>
      </Layout>

      <Layout title={`3. Do you have a COMPLETED IRS W-9 or UH WH-1 from the vendor?`}>
        {[
          'IRS W-9 Form (Sole Proprietor, Independent Contractor, U.S. Entity)',
          'UH WH-1 Form (Nonemployee Visitor)',
        ].map((item) => (
          <TypographyListItem key={item}>{item}</TypographyListItem>
        ))}
        <Typography variant="body1" mt={2}>
          A W-9/WH-1 IS NOT required for RCUH employees, UH employees, and Federal, State, and
          County Government Entities.
        </Typography>
        <Typography variant="body1" mt={2}>
          A valid and acceptable W-9 Form must include:
        </Typography>
        {[
          'Federal tax classification selection',
          'Taxpayer Identification Number',
          'Manual signature (scanned, photocopied, or faxed signature is acceptable)',
        ].map((item) => (
          <TypographyListItem key={item}>{item}</TypographyListItem>
        ))}
      </Layout>

      <Stack justifyContent={'center'} direction="row" my={2} alignItems={'center'}>
        <Typography variant="body2" mr={1}>
          If you answered <b>YES</b> to <b>ALL 3 QUESTIONS</b>, then:
        </Typography>

        <Button onClick={handleCreateNewVendorClick} isLoading={isLoading} disabled={isLoading}>
          Proceed to Create New Vendor
        </Button>

        <Typography variant="body2" mx={1}>
          Otherwise:
        </Typography>

        <Button onClick={handleCancelClick} disabled={isLoading}>
          Cancel
        </Button>
      </Stack>
      <Stack justifyContent={'center'} direction="row">
        <Typography variant="body2" mr={1}>
          Questions? Please contact RCUH Disbursing at{' '}
          <TypographyLink href={'mailto:rcuhdisb@rcuh.com'}>rcuhdisb@rcuh.com.</TypographyLink>
        </Typography>
      </Stack>
    </Box>
  );
};

const Layout = ({ title, children }) => {
  return (
    <Stack p={4} direction="row" mt={2} bgcolor={'white'} border={COLOR_CODE.DEFAULT_BORDER}>
      <Box>
        <CheckboxIcon />
      </Box>
      <Box ml={2}>
        <Typography variant="h5" mb={2}>
          {title}
        </Typography>
        {children}
      </Box>
    </Stack>
  );
};

const TypographyListItem = ({ children }) => {
  return (
    <Typography
      variant="body1"
      sx={{
        pl: 2,
        position: 'relative',
        '&:before': {
          position: 'absolute',
          content: '""',
          width: 4,
          height: 4,
          bgcolor: COLOR_CODE.PRIMARY,
          borderRadius: '50%',
          top: '8px',
          left: '0px',
        },
      }}
    >
      {children}
    </Typography>
  );
};

const TypographyLink = ({ href, children }) => {
  return (
    <Link fontSize={'inherit'} href={href} color={COLOR_CODE.INFO} target="_blank" rel={NO_OPENER}>
      {children}
    </Link>
  );
};

type Props = {
  onNextPage: Callback;
};

export default React.memo(NewVendorCheckList);
