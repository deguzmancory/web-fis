export const ReportTableData = {
  document: {
    reportDataList: [
      {
        projectNumber: '7000005',
        activityCode: '2',
        amountAwarded: '25700.00',
        totalExpended: '10236.00',
        outstandingPO: '0.00',
        totalCost: '10236.00',
        suspense: '0.00',
        availableBalance: '15464.00',
        currentExpended: '0.00',
        description: 'CGB SAL&WAGE',
        category: 'C100',
      },
      {
        projectNumber: '7000005',
        activityCode: '2',
        amountAwarded: '16087.00',
        totalExpended: '0.00',
        outstandingPO: '0.00',
        totalCost: '0.00',
        suspense: '0.00',
        availableBalance: '16087.00',
        currentExpended: '0.00',
        description: 'CGB OVERLOAD',
        category: 'C101',
      },
      {
        projectNumber: '7000005',
        activityCode: '2',
        amountAwarded: '8031.00',
        totalExpended: '64.68',
        outstandingPO: '0.00',
        totalCost: '64.68',
        suspense: '0.00',
        availableBalance: '7966.32',
        currentExpended: '0.00',
        description: 'CGB FRINGE',
        category: 'C105',
      },
      {
        projectNumber: '7000005',
        activityCode: '2',
        amountAwarded: '1944.00',
        totalExpended: '0.00',
        outstandingPO: '0.00',
        totalCost: '0.00',
        suspense: '0.00',
        availableBalance: '1944.00',
        currentExpended: '0.00',
        description: 'CGB MAT&SUP',
        category: 'C107',
      },
      {
        projectNumber: '7000005',
        activityCode: '2',
        amountAwarded: '2500.00',
        totalExpended: '0.00',
        outstandingPO: '0.00',
        totalCost: '0.00',
        suspense: '0.00',
        availableBalance: '2500.00',
        currentExpended: '0.00',
        description: 'CGB TRVL-DOM',
        category: 'C108',
      },
      {
        projectNumber: '7000005',
        activityCode: '2',
        amountAwarded: '0.00',
        totalExpended: '43961.32',
        outstandingPO: '0.00',
        totalCost: '43961.32',
        suspense: '0.00',
        availableBalance: '-43961.32',
        currentExpended: '0.00',
        description: 'CGB OTHERS',
        category: 'C117',
      },
    ],
    indirectCosts: {},
    total: {
      projectNumber: '7000005',
      activityCode: '4',
      amountAwarded: '54262.00',
      totalExpended: '54262.00',
      outstandingPO: '0.00',
      totalCost: '54262.00',
      suspense: '0.00',
      availableBalance: '0.00',
      currentExpended: '0.00',
      description: '',
      category: '',
    },
    grandTotal: {
      projectNumber: '7000005',
      activityCode: '5',
      amountAwarded: '54262.00',
      totalExpended: '54262.00',
      outstandingPO: '0.00',
      totalCost: '54262.00',
      suspense: '0.00',
      availableBalance: '0.00',
      currentExpended: '0.00',
      description: '',
      category: '',
    },
    projectNumber: '7000005',
    subProjectNumber: null,
    reportCsvUrl:
      'https://api.awsnode.test.rcuh.com:443/api/kfs_reports/project_report/csv?time=1677386364301&reportname=kfsProjectBudgetStatus&project=7000005',
    campusCode: 'MA',
    projectTitle: 'KECK II INFRASTRUCTURE (UHERO)',
    piName: 'Burnett, Kimberly',
    indirectCostBase: 'N',
    indirectCostRate: '0.00000',
    baseDescription: 'NONE',
    awardNumber: '33',
    awardType: 'C',
    period: '03/06/13 - 12/31/33',
  },
  errors: [],
};

export interface ReportData {
  projectNumber: string;
  activityCode: string;
  amountAwarded: string;
  totalExpended: string;
  outstandingPO: string;
  totalCost: string;
  suspense: string;
  availableBalance: string;
  currentExpended: string;
  description: string;
  category: string;
}

export interface TotalData {
  projectNumber: string;
  activityCode: string;
  amountAwarded: string;
  totalExpended: string;
  outstandingPO: string;
  totalCost: string;
  suspense: string;
  availableBalance: string;
  currentExpended: string;
  description: string;
  category: string;
}

export interface GrandTotal {
  projectNumber: string;
  activityCode: string;
  amountAwarded: string;
  totalExpended: string;
  outstandingPO: string;
  totalCost: string;
  suspense: string;
  availableBalance: string;
  currentExpended: string;
  description: string;
  category: string;
}

export interface ReportTableProps {
  data: {
    reportDataList: ReportData[];
    total: TotalData;
    grandTotal: GrandTotal;
    projectNumber: string;
    subProjectNumber: string | null;
    reportCsvUrl: string;
    campusCode: string;
    projectTitle: string;
    piName: string;
    indirectCostBase: string;
    indirectCostRate: string;
    baseDescription: string;
    awardNumber: string;
    awardType: string;
    period: string;
  };
  config: {
    columns: {
      [key: string]: {
        title: string;
        dataIndex: string;
        format?: (value: string) => string;
      };
    };
  };
}
