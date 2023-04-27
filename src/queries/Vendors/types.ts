import { VENDOR_OPTION_VALUE } from 'src/containers/Vendors/VendorRegistration/CreateVendorRegistration/enums';
import { GetPresignedPayload } from '../File';

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

  // TODO: Tuyen Tran will update type
  updatedAt?: string;
}

export interface VenderItem {
  code: string;
  line1: string;
  line2: string;
  line3?: string;
  line4?: string;
  line5?: string;
  type?: string;
  paymentType?: string;
  purged?: string;
  address1: string;
  address2: string;
  address3: string;
  created?: string;
  updated?: string;
  w9: string;
  rcuhEmpNumber?: string;
  uhEmpNumber?: string;
  ssn?: string;
  vendorRegistrationExists?: boolean;
}

export interface SearchVendorsParams {
  search?: string;
}

/* Vendor Registration */
export interface VendorRegistrationAttachment {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  uploadDate?: string;
  name: string;
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
  id?: string;

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
  certification: string | null;
  travelFlag: boolean | null;
  paymentsFlag: boolean | null;
  submitted: boolean | null;
  oldForm: boolean | null;
  vendorBuNumber: string | null;
  vendorPrNumber: string | null;
}

export interface VendorRegistrationResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  line5: string;
  zip: string;
  zip4: string;
  type: string;
  ssn: string;
  updated: string;
  entityType: string;
  citizen: string;
  taxStatus: string;
  country: string;
  connected: string;
  orgType: string;
  phoneNumber: string;
  preparedBy: string;
  taxPayerName: string;
  purged: string;
  codeRollup: string;
  tinValidatedDate: string;
  flag1099: string;
  w9SendDate: string;
  w9ReceivedDate: string;
  bckpWhStartDate: string;
  bckpWhEndDate: string;
  firstCp2100RcvdDate: string;
  firstBNoteSendDate: string;
  secondCp2100RcvdDate: string;
  secondBNoteSendDate: string;
  fiscalAdminEmail: string;
  fiscalAdminName: string;
  createdDate: string;
  exemptPayeeCode: string;
  exemptFatcaReptCode: string;
  departmentOffice: string;
  city: string;
  state: string;
  streetAddress: string;
  foreignAddressCode: string;
  otherTaxClass: string;
  w9Reason: string;
  w9Cert: string;
  exemptFlag: string;
  taxClassification: string;
  ssnNew: string;
  einNew: string;
  irsInd: string;
  w92ndSentDate: string;
  rcuhValidatedDate: string;
  vendorNotes: string;
  rcuhId: string;
  uhId: string;
  employeeId: string;
  epayInd: string;
  mkssInd: string;
  wForm: string;
  wFormCode: string;
  w9: string;
  w9ToolTip: string;
  vendorRegistrationExists: boolean;
  firstName: string;
  lastName: string;
  middleName: string;
  suffix: string;
  addressLine2: string;
  foreignAddressLine1: string;
  foreignAddressLine2: string;
  foreignAddressLine3: string;
  vendorPhoneNumber: string;
  vendorEmail: string;
  purgedDate: string;
  buNumber: string;
  prNumber: string;
  userDefined1: string;
  userDefined2: string;
  userDefinedDate1: string;
  userDefinedDate2: string;
  userDefinedDate3: string;
  businessName: string;
  paymentType: string;
  updateVersionNumber: number;
}

export interface GetPresignedVendorRegistrationPayload extends GetPresignedPayload {
  id?: string;
}

export interface DeleteVendorRegistrationAttachmentPayload {
  id: string;
  attachmentId: string;
}

export interface GetPresignedVendorRegistrationAttachmentDownloadUrl
  extends DeleteVendorRegistrationAttachmentPayload {}
