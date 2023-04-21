import { NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY } from './enums';

export const isIntervieweePayeeCategory = (
  payeeCategoryValue: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY
) => {
  return payeeCategoryValue === NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY.INTERVIEWEE;
};
export const isServiceProviderPayeeCategory = (
  payeeCategoryValue: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY
) => {
  return payeeCategoryValue === NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY.SERVICE_PROVIDER;
};
export const isVolunteerPayeeCategory = (
  payeeCategoryValue: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY
) => {
  return payeeCategoryValue === NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY.VOLUNTEER;
};
export const isNoQualifiedScholarshipOrFellowShipPayeeCategory = (
  payeeCategoryValue: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY
) => {
  return (
    payeeCategoryValue ===
    NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY.NON_QUALIFIED_SCHOLARSHIP_OR_FELLOWSHIP
  );
};
export const isPrizeOrAwardPayeeCategory = (
  payeeCategoryValue: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY
) => {
  return payeeCategoryValue === NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY.PRIZE_OR_AWARD;
};
export const isResearchStudyParticipantPayeeCategory = (
  payeeCategoryValue: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY
) => {
  return payeeCategoryValue === NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY.RESEARCH_STUDY_PARTICIPANT;
};

export const isInGroup1Payee = (payeeCategoryValue: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY) => {
  return (
    isIntervieweePayeeCategory(payeeCategoryValue) ||
    isServiceProviderPayeeCategory(payeeCategoryValue) ||
    isVolunteerPayeeCategory(payeeCategoryValue)
  );
};

export const isInGroup2Payee = (payeeCategoryValue: NON_EMPLOYEE_TRAVEL_PAYEE_CATEGORY) => {
  return (
    isNoQualifiedScholarshipOrFellowShipPayeeCategory(payeeCategoryValue) ||
    isPrizeOrAwardPayeeCategory(payeeCategoryValue) ||
    isResearchStudyParticipantPayeeCategory(payeeCategoryValue)
  );
};
