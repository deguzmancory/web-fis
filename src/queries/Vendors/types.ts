import { VENDOR_OPTION_VALUE } from 'src/containers/Vendors/VendorRegistration/CreateVendorRegistration/enums';

/* Vendor, Vendor List */
export interface Vendor {
  code: string;
  w9: string;
  name: string;
  name2: string;
  address1: string;
  address2: string;
  address3: string;
  paymentType?: string;
  rcuhEmpNumber?: string;
  uhEmpNumber?: string;
  type?: string;
}

export interface SearchVendorsParams {
  search?: string;
}

/* Vendor Registration */
export interface VendorRegistrationAttachment {
  id?: string;
  createdAt?: string;
  updatedAt?: string;

  name: string;
  uploadDate: string;
  size: string;
  description: string;
  url: string;
}

export interface VendorRegistration extends VendorRegistrationPayload {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  documentType?: string | null;
  majorVersion?: string | null;
  minorVersion?: number | null;
}

export interface VendorRegistrationPayload {
  //vendor info
  taxPayerName: string | null;
  lastName: string | null;
  firstName: string | null;
  middleName: string | null;
  suffix: string | null;
  company: string | null;
  departmentOrOffice: string | null;
  addressStreet: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressZip: string | null;
  addressZip4: string | null;
  vendorAddressPhoneNumber: string | null;
  vendorAddressEmail: string | null;

  //select vendor
  fedTaxClass: VENDOR_OPTION_VALUE | null;
  fedTaxClassOtherDescription: string | null;

  //assignee info
  ssn1: string | null;
  ssn2: string | null;
  ssn3: string | null;
  ein1: string | null;
  ein2: string | null;
  uhEmpNumber: string | null;
  rcuhEmpNumber: string | null;
  rcuhId: string | null;
  uhId: string | null;
  preparedBy: string | null;
  phoneNumber: string | null;
  email: string | null;
  faName: string | null;
  faEmail: string | null;

  //file attachments
  fileAttachments?: VendorRegistrationAttachment[];

  // TODO: check usage
  formName: string | null;
  shortFormName: string | null;
  vendorCode: string | null;
  fedTaxClassOther: string | null;
  exemptPayee: string | null;
  w9FormCompleted: string | null;
  partOfUsGovernment: string | null;
  possessionsOfUs: string | null;
  employedByRcuh: string | null;
  employedByUh: string | null;
  certification: string | null;
  travelFlag: boolean | null;
  paymentsFlag: boolean | null;

  submitted: boolean | null;
  oldForm: boolean | null;
  vendorBuNumber: string | null;
  vendorPrNumber: string | null;
}
