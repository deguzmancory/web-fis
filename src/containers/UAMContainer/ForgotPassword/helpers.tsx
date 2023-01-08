import { Yup } from 'src/services';

export type ForgotPasswordFormValue = {
  username: string;
};

export const initialForgotPasswordFormValue = {
  username: '',
};

export const forgotPasswordFormSchema = Yup.object().shape({
  username: Yup.string().required(),
});
