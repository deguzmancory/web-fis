// External Links Navbar
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

// Main Menu Navbar
export type NavbarMenuType = {
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
export const NavbarMenuItems: NavbarMenuType[] = [
  {
    label: 'Main Menu',
    url: 'https://fis.rcuh.com/#!/home',
    subItems: [
      // No Items Here
    ],
  },
  {
    label: 'Purchasing',
    url: '',
    subItems: [
      {
        label: 'Create PO',
        url: 'https://awsnode.test.rcuh.com/#!/purchase_order_v1?documentId=pending',
      },
      {
        label: 'Create PO Change Form',
        url: 'https://awsnode.test.rcuh.com/#!/po_change_listing?workflowStatus=pochange&searchText=&searchText2=&itemsPerPage=20&pageNumber=1&sortColumn=modifiedDate&sortOrder=desc&advWorkflowStatus=all&includePo=true&includePoChange=true&includePoPayment=true',
      },
      {
        label: 'Create PO Payment',
        url: 'https://awsnode.test.rcuh.com/#!/po_payment_listing?workflowStatus=popayment',
      },
      {
        label: 'Pending PO Documents',
        url: 'https://awsnode.test.rcuh.com/#!/po_pending_listing?workflowStatus=pending&searchText=&searchText2=&itemsPerPage=20&pageNumber=1&sortColumn=modifiedDate&sortOrder=desc&advWorkflowStatus=all&includePo=true&includePoChange=true&includePoPayment=true',
      },
      {
        label: 'Approved PO Documents',
        url: 'https://awsnode.test.rcuh.com/#!/po_approved_listing?workflowStatus=approved&sortColumn=finalApprovedDate&searchText=&searchText2=&itemsPerPage=20&pageNumber=1&sortOrder=desc&advWorkflowStatus=all&includePo=true&includePoChange=true&includePoPayment=true',
      },
      {
        label: 'Search PO Documents',
        url: 'https://awsnode.test.rcuh.com/#!/po_search',
      },
    ],
  },
  {
    label: 'Non-PO Payments',
    url: '',
    subItems: [
      {
        label: 'Create Non-PO Payments',
        url: 'https://awsnode.test.rcuh.com/#!/direct_payment_options',
      },
      {
        label: 'Pending Payments',
        url: 'https://awsnode.test.rcuh.com/#!/payment_pending_listing?workflowStatus=pending&searchText=&searchText2=&itemsPerPage=20&pageNumber=1&sortColumn=modifiedDate&sortOrder=desc&advWorkflowStatus=all&includeAfp=true&includeNonEmp=true&includePersAuto=true&includePettyCash=true',
      },
      {
        label: 'Approved Payments',
        url: 'https://awsnode.test.rcuh.com/#!/payment_approved_listing?workflowStatus=approved',
      },
      {
        label: 'Search Payments',
        url: 'https://awsnode.test.rcuh.com/#!/payment_search',
      },
    ],
  },
  {
    label: 'Travel',
    isDisplayLeft: true,
    url: '',
    subItems: [
      {
        label: 'Create Travel Request',
        url: 'https://awsnode.test.rcuh.com/#!/travel_request_v1?documentId=pending',
      },
      {
        label: 'Create Travel Completion without Travel Request',
        url: 'https://awsnode.test.rcuh.com/#!/travel_completion_v1?documentId=pending',
      },
      {
        label: 'Create Travel Completion with Travel Request',
        url: 'https://awsnode.test.rcuh.com/#!/travel_comp_from_req_listing?workflowStatus=completiononrequest&sortColumn=acceptedDate&searchText=&searchText2=&itemsPerPage=20&pageNumber=1&sortOrder=desc&advWorkflowStatus=all&includeTravelReq=true&includeTravelComp=true',
      },
      {
        label: 'Pending Travel Documents',
        url: 'https://awsnode.test.rcuh.com/#!/travel_pending_listing?workflowStatus=pending&searchText=&searchText2=&itemsPerPage=20&pageNumber=1&sortColumn=modifiedDate&sortOrder=desc&advWorkflowStatus=all&includeTravelReq=true&includeTravelComp=true',
      },
      {
        label: 'Approved Travel Documents',
        url: 'https://awsnode.test.rcuh.com/#!/travel_approved_listing?workflowStatus=approved&sortColumn=acceptedDate&searchText=&searchText2=&itemsPerPage=20&pageNumber=1&sortOrder=desc&advWorkflowStatus=all&includeTravelReq=true&includeTravelComp=true',
      },
      {
        label: 'Search Travel Documents',
        url: 'https://awsnode.test.rcuh.com/#!/travel_search',
      },
    ],
  },
  {
    label: 'Reporting',
    isDisplayLeft: true,
    url: '',
    subItems: [
      {
        label: 'UH Project Fiscal Reports',
        url: 'https://awsnode.test.rcuh.com/#!/uh_project_reports',
      },
      {
        label: 'RCUH Reports',
        url: 'https://awsnode.test.rcuh.com/#!/rcuh_project_reports',
      },
      {
        label: 'Financial Forecast Reports',
        url: 'https://awsnode.test.rcuh.com/#!/ff_project_reports',
      },
    ],
  },
  {
    label: 'Miscellaneous',
    isDisplayLeft: true,
    url: '',
    subItems: [
      {
        label: 'Search All Documents',
        url: 'https://awsnode.test.rcuh.com/#!/advanced_search',
      },
      {
        label: 'Search Vendors',
        url: 'https://awsnode.test.rcuh.com/#!/vendor_search',
      },
      {
        label: 'Register for ePayments',
        url: 'https://awsnode.test.rcuh.com/#!/register_for_epayments',
      },
      {
        label: 'Register for ePayments',
        url: 'https://awsnode.test.rcuh.com/#!/register_for_epayments',
      },
      {
        label: 'Register for ePayments',
        url: 'https://awsnode.test.rcuh.com/#!/register_for_epayments',
      },
    ],
  },
  {
    label: 'Help',
    isDisplayLeft: true,
    url: '',
    subItems: [
      {
        label: 'RCUH Policies and Procedures',
        url: 'https://www.rcuh.com/1-000/',
      },
      {
        label: 'New Features at a Glance',
        url: 'https://www.rcuh.com/wp-content/uploads/2016/09/New-Features.pdf',
      },
      {
        label: 'Video Guides for the Modernization Form Changes',
        url: 'https://www.youtube.com/playlist?list=PLRGQLJp-0-1nyK643hPGdVjmcZD_ugcEm',
      },
    ],
  },
];
