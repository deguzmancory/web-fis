import { POPaymentRemainingBalance } from 'src/queries';

export const mockupDataRes: POPaymentRemainingBalance = {
  asOfDate: '2023-04-18T07:50:11.962Z',
  remainingBalance: {
    itemList: [
      {
        projectNumber: '0002153',
        subProject: '',
        budgetCategory: '0020',
        subBudgetCategory: '',
        amount: 23,
      },
    ],
    total: 23,
  },
};
