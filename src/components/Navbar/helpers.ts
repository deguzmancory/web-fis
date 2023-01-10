export type NavbarItemType = {
  id?: string;
  label: string;
  url?: string;
  isDisplayLeft?: boolean;
  subItems: {
    id?: string;
    label: string;
    url?: string;
  }[];
};
export const navbarItems: NavbarItemType[] = [
  {
    label: 'Login',
    url: '/login',
    subItems: [
      {
        label: 'Financial Portal',
        url: '/',
      },
      {
        label: 'Human Resources Portal',
        url: 'https://hr521.rcuh.com/',
      },
      {
        label: 'Employee Self-Service',
        url: 'https://hr521.rcuh.com/',
      },
    ],
  },
  {
    label: 'About',
    url: 'https://www.rcuh.com/about-us',
    subItems: [
      {
        label: 'About Us',
        url: 'http://www.rcuh.com/about/about-us/',
      },
      {
        label: 'Annual Report',
        url: 'http://www.rcuh.com/about/annual-report/',
      },
      {
        label: 'Board of Directors',
        url: 'http://www.rcuh.com/about/board-of-directors/',
      },
      {
        label: 'Policies & Procedures',
        url: 'https://www.rcuh.com/1-000/',
      },
    ],
  },
  {
    label: 'News',
    url: 'http://www.rcuh.com/general-announcements',
    subItems: [
      {
        label: 'General Announcements',
        url: 'http://www.rcuh.com/news/general-announcements/',
      },
      {
        label: 'Human Resources Announcements',
        url: 'http://www.rcuh.com/news/human-resource-announcements/',
      },
    ],
  },
  {
    label: 'Work',
    isDisplayLeft: true,
    url: 'http://www.rcuh.com/work/application-instructions/',
    subItems: [
      {
        label: 'Application Instructions',
        url: 'http://www.rcuh.com/work/application-instructions/',
      },
      {
        label: 'Job Postings',
        url: 'https://hcmweb521.rcuh.com/psp/hcmprd_exapp/EMPLOYEE/HRMS/c/HRS_HRAM.HRS_APP_SCHJOB.GBL?FOCUS=Applicant',
      },
      {
        label: 'Benefits',
        url: 'http://www.rcuh.com/work/benefits-matrix/',
      },
      {
        label: 'FAQs',
        url: 'http://www.rcuh.com/work/faqs/',
      },
    ],
  },
  {
    label: 'Training',
    isDisplayLeft: true,
    url: 'http://www.rcuh.com/online-sessions',
    subItems: [
      {
        label: 'Online Videos',
        url: 'http://www.rcuh.com/training/online-sessions/',
      },
      {
        label: 'Training Portal',
        url: 'https://rcuh.litmos.com/admin/dashboard',
      },
    ],
  },
];
