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
