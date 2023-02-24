export interface SignInPayload {
  username: string;
  password: string;
}

export interface SubmitForgotPasswordPayload {
  email: string;
  token: string;
  password: string;
}
export interface ForgotPasswordPayload {
  username: string;
}
export interface ChangePasswordPayload {
  user: any;
  currentPassword: string;
  newPassword: string;
}
export interface ConfirmPasswordPayload {
  password: string;
}

export interface ConfirmSignInPayload {
  code: string;
  user: any;
}

export interface CompleteNewPasswordPayload {
  user: any;
  password: string;
  requiredAttributes?: any;
}
