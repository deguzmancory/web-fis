export enum VENDOR_REGISTRATION_FORM_KEY {
  ID = 'id',

  //vendor info
  TAX_PAYER_NAME = 'taxPayerName',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  MIDDLE_NAME = 'middleName',
  SUFFIX = 'suffix',
  COMPANY = 'company',
  DEPARTMENT_OR_OFFICE = 'departmentOrOffice',
  ADDRESS_STREET = 'addressStreet',
  ADDRESS_CITY = 'addressCity',
  ADDRESS_STATE = 'addressState',
  ADDRESS_ZIP = 'addressZip',
  ADDRESS_ZIP4 = 'addressZip4',
  VENDOR_ADDRESS_PHONE_NUMBER = 'vendorAddressPhoneNumber',
  VENDOR_ADDRESS_EMAIL = 'vendorAddressEmail',
  //additional for vendor info
  HAS_INDIVIDUAL_OR_BUSINESS_NAME = 'hasIndividualOrBusinessName',

  //select vendor
  FED_TAX_CLASS = 'fedTaxClass',
  FED_TAX_CLASS_OTHER_DESCRIPTION = 'fedTaxClassOtherDescription',

  //assignee info
  SSN_1 = 'ssn1',
  SSN_2 = 'ssn2',
  SSN_3 = 'ssn3',
  EIN_1 = 'ein1',
  EIN_2 = 'ein2',
  UH_EMP_NUMBER = 'uhEmpNumber',
  RCUH_EMP_NUMBER = 'rcuhEmpNumber', //TODO: huy_dang emp number or employed?
  EMPLOYED_BY_RCUH = 'employedByRcuh',
  EMPLOYED_BY_UH = 'employedByUh',
  RCUH_ID = 'rcuhId',
  UH_ID = 'uhId',
  PREPARED_BY = 'preparedBy',
  PHONE_NUMBER = 'phoneNumber',
  EMAIL = 'email',
  FA_NAME = 'faName',
  FA_EMAIL = 'faEmail',
  //additional for assignee info
  SSN = 'ssn',
  EIN = 'ein',
  HAS_SSN_OR_EIN = 'hasSsnOrEin',

  //file attachments
  FILE_ATTACHMENTS = 'fileAttachments',

  // TODO: check usage
  FORM_NAME = 'formName',
  SHORT_FORM_NAME = 'shortFormName',
  VENDOR_CODE = 'vendorCode',
  FED_TAX_CLASS_OTHER = 'fedTaxClassOther',
  EXEMPT_PAYEE = 'exemptPayee',
  W9_FORM_COMPLETED = 'w9FormCompleted',
  PART_OF_US_GOVERNMENT = 'partOfUsGovernment',
  POSSESSIONS_OF_US = 'possessionsOfUs',
  CERTIFICATION = 'certification',
  TRAVEL_FLAG = 'travelFlag',
  PAYMENTS_FLAG = 'paymentsFlag',
  SUBMITTED = 'submitted',
  OLD_FORM = 'oldForm',
  VENDOR_BU_NUMBER = 'vendorBuNumber',
  VENDOR_PR_NUMBER = 'vendorPrNumber',
}

export enum VENDOR_OPTION_VALUE {
  INDIVIDUAL_SOLE_PROPRIETOR_OR_SINGLE_MEMBER_LLC = '** Individual/Sole Proprietor or Single-Member LLC',
  C_CORPORATION = '** C Corporation',
  S_CORPORATION = '** S Corporation',
  LLC_C_CORPORATION = '** LLC - C Corporation',
  LLC_S_CORPORATION = '** LLC - S Corporation',
  LLC_PARTNERSHIP = '** LLC - Partnership',
  PARTNERSHIP = '** Partnership',
  TRUST_OR_ESTATE = '** Trust/Estate',
  RCUH_STUDENT_EMPLOYEE = 'RCUH Student Employee; GO TO #6',
  RCUH_EMPLOYEE = 'RCUH Employee, excluding student employees; GO TO #6',
  UH_GRADUATE_ASSISTANT_EMPLOYEE = 'UH Graduate Assistant Employee; GO TO #6',
  UH_STUDENT_EMPLOYEE = 'UH Student Employee; GO TO #6',
  UH_EMERITUS_FACULTY = 'UH Emeritus Faculty; GO TO #6',
  UH_NON_COMPENSATED_APPOINTEE = 'UH Non-Compensated Appointee; GO TO #6',
  UH_EMPLOYEE = 'UH Employee (regular, casual), excluding graduate assistant and student employees; GO TO #6',
  US_GOVERNMENT_ENTITY = 'U.S GOVERNMENT ENTITY (Federal, State, Local government office, agency, or instrumentality;50 States and the District of Columbia only); GO TO #7',
  OTHER = '** Other',
}
