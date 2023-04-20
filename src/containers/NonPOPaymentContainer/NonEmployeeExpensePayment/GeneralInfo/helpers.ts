import { NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY } from 'src/queries/NonPOPayment/NonEmployeeTravel';

export const payeeCategoryOptions1 = [
  { label: 'Interviewee', value: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY.INTERVIEWEE },
  { label: 'Service Provider', value: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY.SERVICE_PROVIDER },
  { label: 'Volunteer (UH or RCUH)', value: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY.VOLUNTEER },
];

export const payeeCategoryOptions2 = [
  {
    label: 'Non-Qualified Scholarship/Fellowship',
    value: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY.NON_QUALIFIED_SCHOLARSHIP_OR_FELLOWSHIP,
  },
  { label: 'Prize or Award', value: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY.PRIZE_OR_AWARD },
  {
    label: 'Research Study Participant',
    value: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY.RESEARCH_STUDY_PARTICIPANT,
  },
];
