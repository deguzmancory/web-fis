export enum PETTY_CASH_FORM_KEY {
  ID = 'id',

  //general info
  LOGIN_NAME = 'loginName',
  DATE = 'date',
  REQUEST_NUMBER = 'requestNumber',
  BEGIN_DATE = 'beginDate',
  END_DATE = 'endDate',
  PROJECT_NAME = 'projectName',
  PROJECT_ADDRESS = 'projectAddress',
  DOCUMENT_NUMBER = 'documentNumber',
  ADVANCED_CASH = 'advancedCash',
  CASH_ON_HAND = 'cashOnHand',
  EXPENSES = 'expenses',
  CASH_IN_TRANSIT = 'cashInTransit',
  TOTAL_PETTY_CASH = 'totalPettyCash',
  VENDOR_NAME = 'vendorName',
  VENDOR_CODE = 'vendorCode',
  VENDOR_ADDRESS = 'vendorAddress',
  DIRECT_INQUIRIES_TO = 'directInquiriesTo',
  PHONE_NUMBER = 'phoneNumber',
  FA_STAFF_REVIEWER = 'faStaffReviewer',

  //project items
  PROJECT_LINE_ITEMS = 'projectLineItems',
  PAYMENT_TOTAL = 'paymentTotal',

  // Receipt Certification
  NO_RECEIPT_SMALL_CORRECT_FLAG = 'noReceiptSmallCorrectFlag',
  NO_RECEIPT_AMOUNT = 'noReceiptAmount',

  // Signatures
  CUSTODIAN_SIGNATURE = 'custodianSignature',
  PI_SIGNATURE = 'piSignature',
  FA_SIGNATURE = 'faSignature',

  //file attachments
  FILE_ATTACHMENTS = 'fileAttachments',
  PLACEHOLDER_FILE_ATTACHMENT = 'placeholderFileAttachment',

  //comment
  INTERNAL_COMMENTS = 'internalComments',
}

export enum ITINERARY_ITEM_FORM_KEY {
  NON_EMPLOYEE_TRAVEL_ID = 'nonEmployeeTravelId',
  DESTINATION = 'destination',
  DEPARTURE_DATE = 'departureDate',
  ARRIVAL_DATE = 'arrivalDate',
  CALC_DAYS = 'calcDays',
  BUSINESS_DAYS = 'businessDays',
  MINUS_DAYS = 'minusDays',
  LODGING_FAR = 'lodgingFar',
  LODGING_RATE = 'lodgingRate',
  LODGING_EXCESS = 'lodgingExcess',
  LODGING_ESTIMATED = 'lodgingEstimated',
  LODGING_DAYS_CLAIM = 'lodgingDaysClaim',
  LODGING_COST = 'lodgingCost',
  MISC_FAR = 'miscFar',
  MISC_RATE = 'miscRate',
  MISC_EXCESS = 'miscExcess',
  MISC_DAYS_CLAIM = 'miscDaysClaim',
  MISC_COST = 'miscCost',
  MISC_ESTIMATED = 'miscEstimated',
}

export enum EXPENDITURE_ITEM_FORM_KEY {
  ITEM = 'item',
  LEG = 'leg',
  PAYMENT_METHOD = 'paymentMethod',
  DESCRIPTION = 'description',
  AMOUNT = 'amount',
}
