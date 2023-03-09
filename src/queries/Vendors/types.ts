export interface Vendor {
  code: string;
  w9: string;
  name: string;
  name2: string;
  address1: string;
  address2: string;
  address3: string;
  paymentType: string;
  rcuhEmpNumber: string;
  uhEmpNumber: string;
  type: string;
}

export interface SearchVendorsParams {
  search?: string;
}

export interface VendorList {
  code: string;
  w9: string;
  name: string;
  name2: string;
  address1: string;
  address2: string;
  address3: string;
  paymentType: string;
  rcuhEmpNumber: string;
  uhEmpNumber: string;
  type: string;
  ssn: string;
}

export enum VENDOR_KEY {
  CODE = 'code',
  W9 = 'w9',
  NAME = 'name',
  NAME2 = 'name2',
  ADDRESS1 = 'address1',
  ADDRESS2 = 'address2',
  ADDRESS3 = 'address3',
  PAYMENT_TYPE = 'paymentType',
  RCUH_EMP_NUMBER = 'rcuhEmpNumber',
  UH_EMP_NUMBER = 'uhEmpNumber',
  TYPE = 'type',
  SSN = 'ssn',
}
