export interface CityStateFromZipCode {
  zipCode: string;
  state: string;
  city: string;
}

export interface BankingFromZipFolder {
  routing_number: string;
  financial_national_bank: string;
}

export interface NAICSCode {
  code: string;
  description: string;
}

// get PI codes
export interface GetPICodesResponse {
  piCodes: PICode[];
}
export interface PICode {
  code: string;
  type: string;
  piName: string;
}

// get FA codes
export interface GetFACodesResponse {
  faCodes: FACode[];
}
export interface FACode {
  code: string;
  type: string;
}
