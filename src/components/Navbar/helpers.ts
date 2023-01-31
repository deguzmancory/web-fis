export type NavbarItemType = {
  id?: string;
  label: string;
  url?: string;
  isExternalUrl: boolean;
  isDisplayLeft?: boolean;
  subItems: {
    id?: string;
    label: string;
    url?: string;
    isExternalUrl: boolean;
  }[];
};
export const navbarItems: NavbarItemType[] = [
  {
    label: 'Login',
    url: '',
    isExternalUrl: false,
    subItems: [
      {
        label: 'Financial Portal',
        url: '/',
        isExternalUrl: false,
      },
      {
        label: 'Human Resources Portal',
        url: 'https://hr521.rcuh.com/',
        isExternalUrl: true,
      },
      {
        label: 'Employee Self-Service',
        url: 'https://hr521.rcuh.com/',
        isExternalUrl: true,
      },
    ],
  },
  {
    label: 'About',
    url: 'https://www.rcuh.com/about-us',
    isExternalUrl: true,
    subItems: [
      {
        label: 'About Us',
        url: 'http://www.rcuh.com/about/about-us/',
        isExternalUrl: true,
      },
      {
        label: 'Annual Report',
        url: 'http://www.rcuh.com/about/annual-report/',
        isExternalUrl: true,
      },
      {
        label: 'Awards',
        url: 'https://www.rcuh.com/about/awards/',
        isExternalUrl: true,
      },
      {
        label: 'Board of Directors',
        url: 'http://www.rcuh.com/about/board-of-directors/',
        isExternalUrl: true,
      },
      {
        label: 'Policies & Procedures',
        url: 'https://www.rcuh.com/1-000/',
        isExternalUrl: true,
      },
    ],
  },
  {
    label: 'News',
    url: 'http://www.rcuh.com/general-announcements',
    isExternalUrl: true,
    subItems: [
      {
        label: 'General Announcements',
        url: 'http://www.rcuh.com/news/general-announcements/',
        isExternalUrl: true,
      },
      {
        label: 'Human Resources Announcements',
        url: 'http://www.rcuh.com/news/human-resource-announcements/',
        isExternalUrl: true,
      },
    ],
  },
  {
    label: 'Work',
    isDisplayLeft: true,
    url: 'http://www.rcuh.com/work/application-instructions/',
    isExternalUrl: true,
    subItems: [
      {
        label: 'Application Instructions',
        url: 'http://www.rcuh.com/work/application-instructions/',
        isExternalUrl: true,
      },
      {
        label: 'Job Postings',
        url: 'https://hcmweb521.rcuh.com/psp/hcmprd_exapp/EMPLOYEE/HRMS/c/HRS_HRAM.HRS_APP_SCHJOB.GBL?FOCUS=Applicant',
        isExternalUrl: true,
      },
      {
        label: 'Benefits',
        url: 'http://www.rcuh.com/work/benefits-matrix/',
        isExternalUrl: true,
      },
      {
        label: 'FAQs',
        url: 'http://www.rcuh.com/work/faqs/',
        isExternalUrl: true,
      },
    ],
  },
  {
    label: 'Training',
    isDisplayLeft: true,
    url: 'http://www.rcuh.com/online-sessions',
    isExternalUrl: true,
    subItems: [
      {
        label: 'Online Videos',
        url: 'http://www.rcuh.com/training/online-sessions/',
        isExternalUrl: true,
      },
      {
        label: 'Training Portal',
        url: 'https://rcuh.litmos.com/admin/dashboard',
        isExternalUrl: true,
      },
    ],
  },
];
