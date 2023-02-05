import { Yup } from 'src/services';

export enum CHANGE_PASSWORD_KEY {
  CURRENT_PASSWORD = 'currentPassword', //pragma: allowlist secret
  NEW_PASSWORD = 'newPassword', //pragma: allowlist secret
  CONFIRM_PASSWORD = 'confirmPassword', //pragma: allowlist secret
  USERNAME = 'username',
}

export type ChangePasswordFormValue = {
  username: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const initialChangePasswordFormValue: ChangePasswordFormValue = {
  username: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const changePasswordFormSchema = Yup.object().shape({
  currentPassword: Yup.string().password().required(),
  newPassword: Yup.string().password().required(),
  confirmPassword: Yup.string().required(),
});
