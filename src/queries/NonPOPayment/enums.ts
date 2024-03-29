export enum NON_PO_PAYMENT_DOCUMENT_TYPE {
  AUTHORIZATION_PAYMENT = 'authorizationPayment',
  NON_EMPLOYEE_TRAVEL_PAYMENT = 'nonEmployeeTravelPayment',
  PERSONAL_AUTO_PAYMENT = 'personalAutoPayment',
  PETTY_CASH_PAYMENT = 'pettyCashPayment',
  MULTI_TRAVEL_PAYMENT = 'multiTravelPayment',
  REIMBURSEMENT_PAYMENT = 'reimbursementPayment',
}

export enum EmployeeStatus {
  RCUH = 'RCUH',
  UH = 'UH',
  Emeritus = 'EMERITUS',
  NonCompAppointees = 'NON_COMP_APPOINTEES',
}

export enum UHBUNumber {
  _00 = '00',
  _01 = '01',
  _02 = '02',
  _03 = '03',
  _04 = '04',
  _07 = '07',
  _08 = '08',
  _09 = '09',
  _10 = '10',
  _13 = '13',
  _23 = '23',
  _29 = '29',
  _57 = '57',
  _61 = '61',
  _63 = '63',
  _67 = '67',
  _68 = '68',
  _70 = '70',
  _73 = '73',
  _78 = '78',
  _79 = '79',
  _82 = '82',
  _84 = '84',
  _87 = '87',
  _88 = '88',
  _93 = '93',
  _99 = '99',
}

export enum UHPRNumber {
  FF1 = 'FF1',
  FF2 = 'FF2',
  FF3 = 'FF3',
  FF4 = 'FF4',
  FF5 = 'FF5',
  F53 = 'F53',
  F54 = 'F54',
  F55 = 'F55',
  F57 = 'F57',
  F58 = 'F58',
  F59 = 'F59',
  F65 = 'F65',
  F66 = 'F66',
  F67 = 'F67',
  F68 = 'F68',
  F69 = 'F69',
  F6N = 'F6N',
  F6O = 'F6O',
  F77 = 'F77',
  F78 = 'F78',
  F94 = 'F94',
  F95 = 'F95',
}

export enum NON_PO_FORM_NAME {
  AUTHORIZATION_PAYMENT = 'Authorization for Payment',
  NON_EMPLOYEE_TRAVEL_PAYMENT = 'Non Employee Travel Payment',
  PERSONAL_AUTO_PAYMENT = 'Personal Auto Payment',
  PETTY_CASH_PAYMENT = 'Petty Cash Payment',
}

export enum NON_PO_SHORT_FORM_NAME {
  AUTHORIZATION_PAYMENT = 'Auth For Pmnt',
  NON_EMPLOYEE_TRAVEL_PAYMENT = 'Non Emp Trvl',
  PERSONAL_AUTO_PAYMENT = 'Personal Auto Payment',
  PETTY_CASH_PAYMENT = 'Petty Cash',
}

export enum NON_PO_DETAIL_STATUS {
  PI_PENDING_SUBMITTAL = 'Pending PI Submittal',
  FA_PENDING_APPROVAL = 'Fa Pending Approval',
  PI_ADDITIONAL_INFO_REQUESTED = 'Pi Additional Info Requested',
  PI_DISAPPROVED = 'Pi Disapproved',
  FA_ADDITIONAL_INFO_REQUESTED_RCUH = 'Fa Additional Info Requested Rcuh',
  RCUH_PENDING_RCUH_APPROVAL = 'Rcuh Pending Rcuh Approval',
  FINAL = 'Final',
}
