import { AirplanemodeActive, ArrowDropDown, Extension, Help, PieChart } from '@mui/icons-material';
import { IoServer, IoWallet } from 'react-icons/io5';
import { PATHS } from 'src/appConfig/paths';
import { PERMISSION_VALUE } from 'src/queries/Permissions';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { PURCHASING_LIST_WORK_FLOW_STATUS_KEY } from '../POListing/enum';
import { NON_PO_LISTING_WORK_FLOW_STATUS_KEY } from '../NonPOListing/enum';

export type DashboardItem = {
  title: string;
  arrowIcon: React.ReactNode;
  subTitle?: string;
  icon: React.ReactNode;
  isDisplayLeft?: boolean; //use for navbar
  items: {
    title: string;
    url: string;
    isExternalUrl?: boolean;
    roles: string[];
    permissions?: string[];
  }[];
};

export const dashboardItems: DashboardItem[] = [
  {
    title: 'Purchasing',
    arrowIcon: <ArrowDropDown sx={{ transform: 'translateY(5px)' }} />,
    subTitle: '(POs & PO Payments)',
    icon: <IoServer size={22} />,
    items: [
      {
        title: 'Review/Approve PO Documents over $24,999',
        url: `${PATHS.purchasingOrders}?workflowStatus=${PURCHASING_LIST_WORK_FLOW_STATUS_KEY.REVIEW_APPROVE_PO_DOCUMENTS}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.CU],
        permissions: [PERMISSION_VALUE.APPROVAL_PO_PAYMENTS_OVER_24999],
      },
      {
        title: 'Review/Approve PO Documents',
        url: `${PATHS.purchasingOrders}?workflowStatus=${PURCHASING_LIST_WORK_FLOW_STATUS_KEY.REVIEW_APPROVE_PO_DOCUMENTS}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.FA],
      },
      {
        title: 'Pending PO Documents',
        url: `${PATHS.purchasingOrders}?workflowStatus=${PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PENDING_PO_DOCUMENTS}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.FA],
      },
      {
        title: 'Outstanding PO Documents',
        url: `${PATHS.purchasingOrders}?workflowStatus=${PURCHASING_LIST_WORK_FLOW_STATUS_KEY.OUTSTANDING_PO_DOCUMENTS}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.FA],
      },
      {
        title: 'Create PO',
        url: `${PATHS.createPurchaseOrders}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.PI, ROLE_NAME.SU],
      },
      {
        title: 'Create PO Change Form',
        url: `${PATHS.purchasingOrders}?workflowStatus=${PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PO_CHANGE}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.PI, ROLE_NAME.SU],
      },
      {
        title: 'Create PO Payment',
        url: `${PATHS.purchasingOrders}?workflowStatus=${PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PO_PAYMENT}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.PI, ROLE_NAME.SU],
      },
      {
        title: 'Pending PO Document',
        url: `${PATHS.purchasingOrders}?workflowStatus=${PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PENDING_PO_DOCUMENTS}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.PI, ROLE_NAME.SU],
      },
      {
        title: 'Approved PO Documents',
        url: `${PATHS.purchasingOrders}?workflowStatus=${PURCHASING_LIST_WORK_FLOW_STATUS_KEY.APPROVED_PO_DOCUMENTS}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'Search PO Documents',
        url: `${PATHS.purchasingOrders}?workflowStatus=${PURCHASING_LIST_WORK_FLOW_STATUS_KEY.SEARCH_PO_DOCUMENTS}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
    ],
  },
  {
    title: 'Non- PO Payments',
    arrowIcon: <ArrowDropDown sx={{ transform: 'translateY(5px)' }} />,
    subTitle: '',
    icon: <IoWallet size={22} />,
    items: [
      {
        title: 'Review/Approve Payments over $24,999',
        url: `${PATHS.nonPOListing}?workflowStatus=${NON_PO_LISTING_WORK_FLOW_STATUS_KEY.REVIEW_APPROVE_DOCUMENTS}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.CU],
        permissions: [PERMISSION_VALUE.APPROVAL_PO_PAYMENTS_OVER_24999],
      },
      {
        title: 'Create Non-PO Payment',
        url: PATHS.nonPOPaymentOptions,
        isExternalUrl: false,
        roles: [ROLE_NAME.PI, ROLE_NAME.SU],
      },
      {
        title: 'Review/Approve Payments ',
        url: `${PATHS.nonPOListing}?workflowStatus=${NON_PO_LISTING_WORK_FLOW_STATUS_KEY.REVIEW_APPROVE_DOCUMENTS}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.FA],
      },
      {
        title: 'Pending Payments',
        url: `${PATHS.nonPOListing}?workflowStatus=${NON_PO_LISTING_WORK_FLOW_STATUS_KEY.PENDING_DOCUMENTS}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'Approved Payments',
        url: `${PATHS.nonPOListing}?workflowStatus=${NON_PO_LISTING_WORK_FLOW_STATUS_KEY.APPROVED_DOCUMENTS}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'Search Payments',
        url: `${PATHS.nonPOListing}?workflowStatus=${NON_PO_LISTING_WORK_FLOW_STATUS_KEY.SEARCH_DOCUMENTS}`,
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
    ],
  },
  {
    title: 'Travel',
    arrowIcon: <ArrowDropDown sx={{ transform: 'translateY(5px)' }} />,
    subTitle: '',
    icon: (
      <AirplanemodeActive
        sx={{
          fontSize: 22,
        }}
      />
    ),
    items: [
      {
        title: 'Review/Approve Travel Documents over $24,999',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU],
        permissions: [PERMISSION_VALUE.APPROVAL_PO_PAYMENTS_OVER_24999],
      },
      {
        title: 'Review/Approve Travel Documents',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.FA],
      },
      {
        title: 'Create Travel Request',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.PI, ROLE_NAME.SU],
      },
      {
        title: 'Create Travel Completion Without Travel Request',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.PI, ROLE_NAME.SU],
      },
      {
        title: 'Create Travel Completion With Travel Request',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.PI, ROLE_NAME.SU],
      },
      {
        title: 'Pending Travel Documents',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'Outstanding Travel Documents',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.FA],
      },
      {
        title: 'Approved Travel Documents',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'Search Travel Documents',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
    ],
  },
  {
    title: 'Reporting',
    arrowIcon: <ArrowDropDown sx={{ transform: 'translateY(5px)' }} />,
    subTitle: '',
    icon: (
      <PieChart
        sx={{
          fontSize: 22,
        }}
      />
    ),
    items: [
      {
        title: 'UH Project Fiscal Reports',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'RCUH Reports',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'Financial Forecast Reports',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
        // permissions: [PERMISSION_VALUE.FINANCIAL_FORECAST_PAYROLL_REPORT],
      },
    ],
  },
  {
    title: 'Miscellaneous',
    arrowIcon: <ArrowDropDown sx={{ transform: 'translateY(5px)' }} />,
    subTitle: '',
    isDisplayLeft: true,
    icon: (
      <Extension
        sx={{
          fontSize: 22,
        }}
      />
    ),
    items: [
      {
        title: 'Search All Documents',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'User Management',
        url: PATHS.userManagements,
        isExternalUrl: false,
        roles: [ROLE_NAME.CU],
        permissions: [PERMISSION_VALUE.ALLOW_READ_USER],
      },
      {
        title: 'Search Vendors',
        url: PATHS.vendors,
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'Register for ePayments',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'Check Printing',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU],
        permissions: [PERMISSION_VALUE.PRINT_CHECKS],
      },
      {
        title: 'Check Registers',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU],
        permissions: [PERMISSION_VALUE.VIEW_CHECK_REGISTERS],
      },
      {
        title: 'Vacation and Sick Leave Audit Page',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU],
        permissions: [PERMISSION_VALUE.VACATION_SICK_LEAVE_AUDIT_PAGE],
      },
      {
        title: 'Global Settings',
        url: PATHS.globalSettings,
        isExternalUrl: false,
        roles: [ROLE_NAME.CU],
      },
      {
        title: 'HR and Payroll Application',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'RCUH Staff Listing',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
    ],
  },
  {
    title: 'Help',
    arrowIcon: <ArrowDropDown sx={{ transform: 'translateY(5px)' }} />,
    subTitle: '',
    isDisplayLeft: true,
    icon: (
      <Help
        sx={{
          fontSize: 22,
        }}
      />
    ),
    items: [
      {
        title: 'RCUH Policies and Procedures',
        url: 'https://www.rcuh.com/1-000/',
        isExternalUrl: true,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'Modernized Financial Portal User Guide',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'New Features at a Glance',
        url: 'https://www.rcuh.com/wp-content/uploads/2016/09/New-Features.pdf',
        isExternalUrl: true,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'Video Guides for the Modernized Form Changes',
        url: 'https://www.youtube.com/playlist?list=PLRGQLJp-0-1nyK643hPGdVjmcZD_ugcEm',
        isExternalUrl: true,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
    ],
  },
];
