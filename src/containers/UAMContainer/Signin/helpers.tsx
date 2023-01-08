import { Yup } from 'src/services';

export type SignInFormValue = {
  username: string;
  password: string;
};

export enum SIGNIN_KEY {
  USERNAME = 'username',
  PASSWORD = 'password',
}

export const initialSignInFormValue: SignInFormValue = { username: '', password: '' };

export const signInFormSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
});
