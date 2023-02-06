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
  userType: Yup.string().required(),
  projectNumber: Yup.string(),
  startDate: Yup.date().nullable(),
  endDate: Yup.date().nullable(),
});

export const getDelegateUserTypeOptions = (
  userExistedTypes: string[],
  currentUserTypes: string[]
) => {
  // PI >> PI/SU
  // SU >> PI/SU
  // FA >> FA

  if (isEmpty(userExistedTypes) || isEmpty(currentUserTypes)) {
    return [];
  }

  let options = [];

  const getOption = (role: ROLE_NAME) => {
    return {
      label: getRoleName(role),
      value: role,
    };
  };

  if (currentUserTypes.includes(ROLE_NAME.PI) || currentUserTypes.includes(ROLE_NAME.SU)) {
    if (userExistedTypes.includes(ROLE_NAME.PI)) {
      options.push(getOption(ROLE_NAME.PI));
    }
    if (userExistedTypes.includes(ROLE_NAME.SU)) {
      options.push(getOption(ROLE_NAME.SU));
    }
  }
  if (currentUserTypes.includes(ROLE_NAME.FA) && userExistedTypes.includes(ROLE_NAME.FA)) {
    options.push(getOption(ROLE_NAME.FA));
  }
  return options;
};
