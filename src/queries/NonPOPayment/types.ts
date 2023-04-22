export interface NonPOPaymentProjectLineItem {
  id?: string;
  nonEmployeeTravelId?: string;
  lineNumber: number;
  projectNumber: string;
  subProject: string;
  budgetCategory: string;
  subBudgetCategory: string;
  serviceDate: string;
  amount: number;
  description: string;
}
