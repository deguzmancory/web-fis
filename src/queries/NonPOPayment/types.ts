export interface NonPOPaymentProjectLineItem {
  id?: string;
  nonEmployeeTravelId?: string;
  createdAt?: string;
  updatedAt?: string;

  lineNumber: number;
  projectNumber: string;
  subProject: string;
  budgetCategory: string;
  subBudgetCategory: string;
  serviceDate: string;
  amount: number;
  description: string;
}

export interface NonPOPaymentRemittanceLineItem {
  id?: string;
  externalId?: number;
  createdAt?: string;
  updatedAt?: string;
  nonEmployeeTravelId?: string;

  lineNumber?: number;
  referenceNumber: string;
  customerAccountComment: string;
  amount: number;
}

export interface NonPOPaymentRemittance {
  questionName: string;
  questionPhoneNumber: number;
  returnRemittanceFlag: boolean;
  remittanceAttention: string;
  remittanceStreet: string;
  remittanceCity: string;
  remittanceState: string;
  zipCode: string;
  zipCodePlus4: string;
  remittanceTotal: number;
}
