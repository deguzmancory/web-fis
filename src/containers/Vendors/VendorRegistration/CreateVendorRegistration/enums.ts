export enum VENDOR_REGISTRATION_FORM_KEY {
  FIRST_NAME = 'firstName',
  CITY = 'city',
  STATE = 'state',
  ZIP = 'zip',
  ZIP4 = 'zip4',
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
