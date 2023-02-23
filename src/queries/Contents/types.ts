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

export interface UserFiCode {
  code: string;
  type: string;
}

// get PI codes
export interface PICode extends UserFiCode {
  piName: string;
}

// get FA codes
export interface FACode extends UserFiCode {}
