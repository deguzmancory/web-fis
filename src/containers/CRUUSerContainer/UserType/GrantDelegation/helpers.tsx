import { Yup } from 'src/services';

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
  existingUserAccount: Yup.string().required(),
  userType: Yup.string().required(),
  projectNumber: Yup.string().required(),
  startDate: Yup.date().required().nullable(),
  endDate: Yup.date().required().nullable(),
});
