import { AirplanemodeActive, Extension, Help, PieChart } from '@mui/icons-material';
import { IoServer, IoWallet } from 'react-icons/io5';
import { PATHS } from 'src/appConfig/paths';
import { PERMISSION_VALUE } from 'src/queries/Permissions';
import { ROLE_NAME } from 'src/queries/Profile/helpers';

export type DashboardItem = {
  title: string;
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
    subTitle: 'POs & PO Payments',
    icon: <IoServer size={75} />,
    items: [
      {
        title: 'Review/Approve PO Documents over $24,999',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU],
        permissions: [PERMISSION_VALUE.APPROVAL_PO_PAYMENTS_OVER_24999],
      },
      {
        title: 'Review/Approve PO Documents',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.FA],
      },
      {
        title: 'Pending PO Documents',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.FA],
      },
      {
        title: 'Outstanding PO Documents',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.FA],
      },
      {
        title: 'Create PO',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.PI, ROLE_NAME.SU],
      },
      {
        title: 'Create PO Change Form',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.PI, ROLE_NAME.SU],
      },
      {
        title: 'Create PO Payment',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.PI, ROLE_NAME.SU],
      },
      {
        title: 'Pending PO Document',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.PI, ROLE_NAME.SU],
      },
      {
        title: 'Approved PO Documents',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'Search PO Documents',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
    ],
  },
  {
    title: 'Non- PO Payments',
    subTitle: '',
    icon: <IoWallet size={75} />,
    items: [
      {
        title: 'Review/Approve Payments over $24,999',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU],
      },
      {
        title: 'Create Non-PO Payment',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.PI, ROLE_NAME.SU],
      },
      {
        title: 'Review/Approve Payments ',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.FA],
      },
      {
        title: 'Pending Payments',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'Approved Payments',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
      {
        title: 'Search Payments',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU, ROLE_NAME.PI, ROLE_NAME.SU, ROLE_NAME.FA],
      },
    ],
  },
  {
    title: 'Travel',
    subTitle: '',
    icon: (
      <AirplanemodeActive
        sx={{
          fontSize: 75,
        }}
      />
    ),
    items: [
      {
        title: 'Review/Approve Travel Documents over $24,999',
        url: '#',
        isExternalUrl: false,
        roles: [ROLE_NAME.CU],
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
    subTitle: '',
    icon: (
      <PieChart
        sx={{
          fontSize: 75,
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
        permissions: [PERMISSION_VALUE.FINANCIAL_FORECAST_PAYROLL_REPORT],
      },
    ],
  },
  {
    title: 'Miscellaneous',
    subTitle: '',
    isDisplayLeft: true,
    icon: (
      <Extension
        sx={{
          fontSize: 75,
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
      },
      {
        title: 'Search Vendors',
        url: '#',
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
        permissions: [PERMISSION_VALUE.EDIT_STAFF_LISTING],
      },
    ],
  },
  {
    title: 'Help',
    subTitle: '',
    isDisplayLeft: true,
    icon: (
      <Help
        sx={{
          fontSize: 75,
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
