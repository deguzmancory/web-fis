import { AirplanemodeActive, Extension, Help, PieChart } from '@mui/icons-material';
import { IoServer, IoWallet } from 'react-icons/io5';
import { PATHS } from 'src/appConfig/paths';
import { ROLE_NAME } from 'src/queries/Profile/helpers';

export type DashboardItem = {
  title: string;
  subTitle?: string;
  icon: React.ReactNode;
  items: {
    title: string;
    url: string;
    isExternalUrl?: boolean;
    roles: string[];
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
        roles: [''],
      },
      {
        title: 'Pending PO Documents',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Outstanding PO Documents',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Approved PO Documents',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Search PO Documents',
        url: '#',
        isExternalUrl: false,
        roles: [''],
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
        roles: [''],
      },
      {
        title: 'Pending Payments',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Approved Payments',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Search Payments',
        url: '#',
        isExternalUrl: false,
        roles: [''],
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
        roles: [''],
      },
      {
        title: 'Pending Travel Documents',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Outstanding Travel Documents',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Approved Travel Documents',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Search Travel Documents',
        url: '#',
        isExternalUrl: false,
        roles: [''],
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
        roles: [''],
      },
      {
        title: 'RCUH Reports',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Financial Forecast Reports',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
    ],
  },
  {
    title: 'Miscellaneous',
    subTitle: '',
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
        roles: [''],
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
        roles: [''],
      },
      {
        title: 'Register for ePayments',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Check Printing',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Check Registers',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Vacation and Sick Leave Audit Page',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Global Settings',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'HR and Payroll Application',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'RCUH Staff Listing',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
    ],
  },
  {
    title: 'Help',
    subTitle: '',
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
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Modernized Financial Portal User Guide',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'New Features at a Glance',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
      {
        title: 'Video Guides for the Modernized Form Changes',
        url: '#',
        isExternalUrl: false,
        roles: [''],
      },
    ],
  },
];
