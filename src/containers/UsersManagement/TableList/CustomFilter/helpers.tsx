import { ROLE_NAME, getRoleName } from 'src/queries/Profile/helpers';
import { GetPropertiesParams, USER_KEY } from 'src/queries/Users/types';
import { isEmpty } from 'src/validations';

export enum CUSTOM_FILTER_USERS_KEY {
  USER_TYPES = 'userTypes',
}

export type CustomFilterUSersFormValue = {
  userTypes: string[];
};

export const FILTER_USERS_INDEX = {
  USER_TYPE: 4,
  length: 6,
};

export enum PREFIX_FILTER_USERS {
  USER_TYPE = 'User Type: ',
}

export const userTypeOptions = [
  {
    label: getRoleName(ROLE_NAME.SU),
    value: ROLE_NAME.SU,
  },
  {
    label: getRoleName(ROLE_NAME.PI),
    value: ROLE_NAME.PI,
  },
  {
    label: getRoleName(ROLE_NAME.FA),
    value: ROLE_NAME.FA,
  },
  {
    label: getRoleName(ROLE_NAME.CU),
    value: ROLE_NAME.CU,
  },
];

export const getUsersUpdatedParams = (
  params: GetPropertiesParams,
  options?: { userTypesKey: string[] }
): GetPropertiesParams => {
  const newParams = { ...params };

  const roleParams = options.userTypesKey;
  if (!isEmpty(roleParams)) {
    newParams['userType'] = roleParams.map((r) => r.toUpperCase().replace(/\s/g, '_')).join(',');
  }
  delete newParams[USER_KEY.DISPLAY_NAME];

  return newParams;
};
