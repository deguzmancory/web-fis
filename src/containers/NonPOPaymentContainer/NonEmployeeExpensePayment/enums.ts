export enum NON_EMPLOYEE_TRAVEL_FORM_KEY {
  // SelectPayeeCategory
  LOGIN_NAME = 'loginName',
  DATE = 'date',
  REQUEST_NUMBER = 'requestNumber',
  PAYEE_CATEGORY = 'payeeCategory',

  //general info
  VENDOR_NAME = 'vendorName',
  VENDOR_CODE = 'vendorCode',
  POSITION_TITLE = 'positionTitle',
  EMPLOYER = 'employer',
  VENDOR_ADDRESS = 'vendorAddress',
  DOCUMENT_NUMBER = 'documentNumber',
  FA_STAFF_REVIEWER = 'faStaffReviewer',
  PROJECT_CONTACT = 'projectContact',
  PROJECT_CONTACT_PHONE = 'projectContactPhone',
  TO_SERVICE_DATE = 'toServiceDate',
  FROM_SERVICE_DATE = 'fromServiceDate',

  // trip itinerary
  START_DESTINATION = 'startDestination',
  START_DEPARTURE_DATE = 'startDepartureDate',
  ITINERARIES = 'itineraries',
  END_DESTINATION = 'endDestination',
  END_ARRIVAL_DATE = 'endArrivalDate',
  TRIP_TOTAL = 'tripTotal',

  // travel expenditure
  EXPENDITURES = 'expenditures',
  ADVANCED_DOCUMENT_NUMBER = 'advancedDocumentNumber',
  EXPENDITURE_TOTAL = 'expenditureTotal',
  AMOUNT_ADVANCED = 'amountAdvanced',
  MISC_COST_TOTAL = 'miscCostTotal',
  LODGING_COST_TOTAL = 'lodgingCostTotal',
  MISC_DESCRIPTION = 'miscDescription',
  LODGING_DESCRIPTION = 'lodgingDescription',
  MISC_DAYS_CLAIM_TOTAL = 'miscDaysClaimTotal',
  LODGING_DAYS_CLAIM_TOTAL = 'lodgingDaysClaimTotal',
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
