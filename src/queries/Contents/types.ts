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

export interface UserFICode {
  code: string;
  type: string;
}

// get PI codes
export interface GetPICodesResponse {
  piCodes: PICode[];
}
export interface PICode extends UserFICode {
  piName: string;
}

// get FA codes
export interface GetFACodesResponse {
  faCodes: FACode[];
}
export interface FACode extends UserFICode {}
