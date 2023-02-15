import dayjs from 'dayjs';
import { getRoleName, ROLE_NAME } from 'src/queries/Profile/helpers';
import { Yup } from 'src/services';
import { isEmpty } from 'src/validations';

export enum ADD_DELEGATION_KEY {
  EXISTING_USER_ACCOUNT = 'existingUserAccount',
  USER_TYPE = 'userType',
  PROJECT_NUMBER = 'projectNumber',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
}

export type AddDelegationFormValue = {
  existingUserAccount: string;
  userType: string;
  projectNumber: string;
  startDate: Date;
  endDate: Date;
};

export const initialAddDelegationFormValue: AddDelegationFormValue = {
  existingUserAccount: '',
  userType: '',
  projectNumber: '',
  startDate: null,
  endDate: null,
};

export const addDelegationFormSchema = Yup.object().shape({
  existingUserAccount: Yup.string().required().nullable(),
  userType: Yup.string().required().nullable(),
  projectNumber: Yup.string(),
  startDate: Yup.date().nullable(),
  endDate: Yup.date().nullable(),
});

export const getDelegateUserTypeOptions = (
  userExistedTypes: string[],
  currentUserTypes: string[]
) => {
  // currentUserTypes >> userExistedTypes >> option
  // PI >> SU >> PI
  // SU >> PI >> SU
  // PI/SU >> SU >> PI/SU
  // PI/SU >> PI >> PI/SU
  // PI/SU/FA >> PI >> PI/SU/FA
  // FA >> FA

  if (isEmpty(userExistedTypes) || isEmpty(currentUserTypes)) {
    return [];
  }

  const options = [];

  const addOption = (role: ROLE_NAME) => {
    options.push({
      label: getRoleName(role),
      value: role,
    });
  };

  const isCurrentUserPIorSU =
    currentUserTypes.includes(ROLE_NAME.PI) || currentUserTypes.includes(ROLE_NAME.SU);
  const isUserExistedPIorSU =
    userExistedTypes.includes(ROLE_NAME.PI) || userExistedTypes.includes(ROLE_NAME.SU);

  if (isCurrentUserPIorSU && isUserExistedPIorSU) {
    if (currentUserTypes.includes(ROLE_NAME.PI)) {
      addOption(ROLE_NAME.PI);
    }
    if (currentUserTypes.includes(ROLE_NAME.SU)) {
      addOption(ROLE_NAME.SU);
    }
  }

  if (currentUserTypes.includes(ROLE_NAME.FA) && userExistedTypes.includes(ROLE_NAME.FA)) {
    addOption(ROLE_NAME.FA);
  }

  return options;
  // return options.filter((option, index, arr) => {
  //   return arr.findIndex((opt) => opt.value === option.value) === index;
  // });
};

export const getAfterDate = (
  value: string | number | Date | dayjs.Dayjs,
  currentDate: string | number | Date | dayjs.Dayjs
): Date => {
  if (dayjs(value).isAfter(dayjs(currentDate))) {
    return dayjs(value).toDate();
  } else {
    return dayjs(currentDate).toDate();
  }
};
