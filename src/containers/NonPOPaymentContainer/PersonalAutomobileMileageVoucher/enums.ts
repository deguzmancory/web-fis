export enum PERSONAL_AUTOMOBILE_FORM_KEY {
  ID = 'id',

  //general info
  LOGIN_NAME = 'loginName',
  DATE = 'date',
  REQUEST_NUMBER = 'requestNumber',
  VENDOR_NAME = 'vendorName',
  VENDOR_CODE = 'vendorCode',
  POSITION_TITLE = 'positionTitle',
  DOCUMENT_NUMBER = 'documentNumber',
  EMPLOYEE_STATUS = 'employeeStatus',
  EMPLOYEE_NUMBER = 'employeeNumber',
  BU_NUMBER = 'buNumber',
  PR_NUMBER = 'prNumber',
  VENDOR_ADDRESS = 'vendorAddress',
  TRAVELER_ADDRESS = 'travelerAddress',
  MILEAGE_CLAIM_FLAG = 'mileageClaimFlag',
  DIRECT_INQUIRIES_TO = 'directInquiriesTo',
  PHONE_NUMBER = 'phoneNumber',
  FA_STAFF_REVIEWER = 'faStaffReviewer',

  // Itemized Trip Information
  TRIP_INFOS = 'tripInfos',

  TOTAL_MILES_PARKING = 'milesParkingTotal',
  MILEAGE_RATE = 'mileageRate',
  TOTAL_MILEAGE_RATE = 'milesRateTotal',
  TOTAL_MILES = 'milesTotal',
  REPORTABLE_RATE = 'reportableRate',
  TOTAL_PARKING = 'parkingTotal',
  COMPANY = 'company',
  POLICY_NUMBER = 'policyNumber',
  EXPIRATION_DATE = 'expirationDate',

  // Project Items
  PROJECT_ITEMS = 'projectLineItems',
  PAYMENT_TOTAL = 'paymentTotal',

  // Authorization Signatures
  TRAVELER_SIGNATURE = 'travelerSignature',
  PI_SIGNATURE = 'piSignature',
  UH_SIGNATURE = 'uhSignature',

  // Attachments
  FILE_ATTACHMENTS = 'attachments',
  PLACEHOLDER_FILE_ATTACHMENT = 'placeholderFileAttachment',
}

export enum PERSONAL_AUTO_TRIP_ITEM_FORM_KEY {
  TRIP_ITEM_ID = 'id',
  TRIP_LINE_NUMBER = 'lineNumber',
  TRIP_SERVICE_DATE = 'serviceDate',
  TRIP_FROM = 'tripFrom',
  TRIP_TO = 'tripTo',
  TRIP_PURPOSE = 'purpose',
  TRIP_ROUND_FLAG = 'roundTripFlag',
  TRIP_PARKING = 'parking',
  TRIP_MILES = 'miles',
}
