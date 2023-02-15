export type StateOption = {
  id: number;
  code: string;
  name: string;
  countryId: number;
};

const states: StateOption[] = [
  { id: 1, code: 'HI', name: 'Hawaii', countryId: 233 },
  { id: 2, code: 'AL', name: 'Alabama', countryId: 233 },
  { id: 3, code: 'AK', name: 'Alaska', countryId: 233 },
  { id: 4, code: 'AS', name: 'American Samoa', countryId: 233 },
  { id: 5, code: 'AZ', name: 'Arizona', countryId: 233 },
  { id: 6, code: 'AR', name: 'Arkansas', countryId: 233 },
  { id: 7, code: 'CA', name: 'California', countryId: 233 },
  { id: 8, code: 'CO', name: 'Colorado', countryId: 233 },
  { id: 9, code: 'CT', name: 'Connecticut', countryId: 233 },
  { id: 10, code: 'DE', name: 'Delaware', countryId: 233 },
  { id: 11, code: 'DC', name: 'District Of Columbia', countryId: 233 },
  {
    id: 12,
    code: 'FM',
    name: 'Federated States Of Micronesia',
    countryId: 233,
  },
  { id: 13, code: 'FL', name: 'Florida', countryId: 233 },
  { id: 14, code: 'GA', name: 'Georgia', countryId: 233 },
  { id: 15, code: 'GU', name: 'Guam', countryId: 233 },
  { id: 16, code: 'ID', name: 'Idaho', countryId: 233 },
  { id: 17, code: 'IL', name: 'Illinois', countryId: 233 },
  { id: 18, code: 'IN', name: 'Indiana', countryId: 233 },
  { id: 19, code: 'IA', name: 'Iowa', countryId: 233 },
  { id: 20, code: 'KS', name: 'Kansas', countryId: 233 },
  { id: 21, code: 'KY', name: 'Kentucky', countryId: 233 },
  { id: 22, code: 'LA', name: 'Louisiana', countryId: 233 },
  { id: 23, code: 'ME', name: 'Maine', countryId: 233 },
  { id: 24, code: 'MH', name: 'Marshall Islands', countryId: 233 },
  { id: 25, code: 'MD', name: 'Maryland', countryId: 233 },
  { id: 26, code: 'MA', name: 'Massachusetts', countryId: 233 },
  { id: 27, code: 'MI', name: 'Michigan', countryId: 233 },
  { id: 28, code: 'MN', name: 'Minnesota', countryId: 233 },
  { id: 29, code: 'MS', name: 'Mississippi', countryId: 233 },
  { id: 30, code: 'MO', name: 'Missouri', countryId: 233 },
  { id: 31, code: 'MT', name: 'Montana', countryId: 233 },
  { id: 32, code: 'NE', name: 'Nebraska', countryId: 233 },
  { id: 33, code: 'NV', name: 'Nevada', countryId: 233 },
  { id: 34, code: 'NH', name: 'New Hampshire', countryId: 233 },
  { id: 35, code: 'NJ', name: 'New Jersey', countryId: 233 },
  { id: 36, code: 'NM', name: 'New Mexico', countryId: 233 },
  { id: 37, code: 'NY', name: 'New York', countryId: 233 },
  { id: 38, code: 'NC', name: 'North Carolina', countryId: 233 },
  { id: 39, code: 'ND', name: 'North Dakota', countryId: 233 },
  { id: 40, code: 'MP', name: 'Northern Mariana Islands', countryId: 233 },
  { id: 41, code: 'OH', name: 'Ohio', countryId: 233 },
  { id: 42, code: 'OK', name: 'Oklahoma', countryId: 233 },
  { id: 43, code: 'OR', name: 'Oregon', countryId: 233 },
  { id: 44, code: 'PW', name: 'Palau', countryId: 233 },
  { id: 45, code: 'PA', name: 'Pennsylvania', countryId: 233 },
  { id: 46, code: 'PR', name: 'Puerto Rico', countryId: 233 },
  { id: 47, code: 'RI', name: 'Rhode Island', countryId: 233 },
  { id: 48, code: 'SC', name: 'South Carolina', countryId: 233 },
  { id: 49, code: 'SD', name: 'South Dakota', countryId: 233 },
  { id: 50, code: 'TN', name: 'Tennessee', countryId: 233 },
  { id: 51, code: 'TX', name: 'Texas', countryId: 233 },
  { id: 52, code: 'UT', name: 'Utah', countryId: 233 },
  { id: 53, code: 'VT', name: 'Vermont', countryId: 233 },
  { id: 54, code: 'VI', name: 'Virgin Islands', countryId: 233 },
  { id: 55, code: 'VA', name: 'Virginia', countryId: 233 },
  { id: 56, code: 'WA', name: 'Washington', countryId: 233 },
  { id: 57, code: 'WV', name: 'West Virginia', countryId: 233 },
  { id: 58, code: 'WI', name: 'Wisconsin', countryId: 233 },
  { id: 59, code: 'WY', name: 'Wyoming', countryId: 233 },
];

const getStates = () => {
  return states.map((state) => ({
    label: state.code,
    value: state.code,
  }));
};

export default {
  getStates,
  states,
};
