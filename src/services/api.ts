import apisauce from 'apisauce';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import appConfig from 'src/appConfig';
import { ProfilePayload } from 'src/queries';
import { GetPresignedPayload, UploadFilePayload } from 'src/queries/File/types';
import {
  ChangePasswordPayload,
  CompleteNewPasswordPayload,
  ConfirmPasswordPayload,
  ConfirmSignInPayload,
  ForgotPasswordPayload,
  SignInPayload,
  SubmitForgotPasswordPayload,
} from 'src/queries/UAM/types';
import {
  AddUserPayload,
  GetPropertiesParams,
  UpdateUserLastPasswordChangedParams,
  UpdateUserPayload,
  User,
} from 'src/queries/Users/types';
import { newCancelToken, stringify } from 'src/utils';
import { TokenService, XApiKeyService } from '.';

axios.defaults.withCredentials = true;

const create = (baseURL = appConfig.API_URL) => {
  //
  // Create and configure an apisauce-based api object.
  //

  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 0,
      Accept: 'application/json',
    },
    timeout: appConfig.CONNECTION_TIMEOUT,
  });

  api.axiosInstance.interceptors.request.use((config) => {
    return TokenService.getToken()
      .then((token) => {
        config.headers.Authorization = 'Bearer ' + token;
        return Promise.resolve(config);
      })
      .catch(() => {
        return Promise.resolve(config);
      });
  });
  const getRoot = () => api.get('');

  // ====================== Auth ======================
  const signIn = (body: SignInPayload) => Auth.signIn(body.username, body.password);

  const signOut = () => Auth.signOut();

  const forgotPassword = (body: ForgotPasswordPayload) => Auth.forgotPassword(body.username);

  const submitForgotPassword = (body: SubmitForgotPasswordPayload) =>
    Auth.forgotPasswordSubmit(body.email, body.token, body.password);

  const changePassword = (body: ChangePasswordPayload) =>
    Auth.changePassword(body.user, body.currentPassword, body.newPassword);

  const confirmSignIn = (body: ConfirmSignInPayload) =>
    Auth.sendCustomChallengeAnswer(body.user, body.code);

  const confirmPassword = (password: ConfirmPasswordPayload) => {
    return Auth.currentAuthenticatedUser().then((user) =>
      Auth.signIn({
        username: user.username,
        password: password.password,
      })
    );
  };

  const completeNewPassword = (body: CompleteNewPasswordPayload) =>
    Auth.completeNewPassword(body.user, body.password, body.requiredAttributes);

  // ====================== Profile ======================
  const getUserId = (params: { username: string }) => {
    const username = { username: params.username };
    const queryString = stringify(username);
    return api.get(`/account-svc/v1/users/user-id?${queryString}`, {}, newCancelToken());
  };

  // ====================== Profile ======================
  const getMyProfile = () => api.get('/account-svc/v1/me', {}, newCancelToken());

  const updateUserAvatar = (body: { avatarUrl: string }) =>
    api.patch(`/me/avatar`, body, newCancelToken());

  const updateMyProfile = (body: ProfilePayload) =>
    api.put(`/account-svc/v1/me`, body, newCancelToken());

  // ====================== Content ======================
  const getContents = () => api.get('/account-svc/v1/contents', {}, newCancelToken());

  // ====================== File ======================
  const getPresignedUserServiceUrl = (params: GetPresignedPayload) => {
    return api.get('/file-svc/v1/presigned-upload-url', params, newCancelToken());
  };
  const uploadFile = (body: UploadFilePayload) => axios.put(body.url, body.fileData);

  const getDecodeUserServiceUrl = (params: { filePath: string }) =>
    api.get('/file-svc/v1/presigned-download-url', params, newCancelToken());

  const uploadFileWithProgress = (body: UploadFilePayload) =>
    axios.put(body.url, body.fileData, {
      onUploadProgress: (progress) => {
        const { loaded, total } = progress;
        const percentageProgress = Math.floor((loaded / total) * 100);
        body.setProgress(percentageProgress);
      },
    });

  // ====================== System Accounts ======================

  const searchUserAccounts = (params: { search: string }) => {
    const queryString = stringify(params);
    return api.get(`/users/search?${queryString}`, {}, newCancelToken());
  };
  const searchUserAccountsAxios = (params: { search: string; skip: number; take: number }) => {
    const queryString = stringify(params);
    return api.get(`${appConfig.API_URL}/users/search?${queryString}`, {}, newCancelToken());
  };
  const searchUserAccountsByOrderAxios = (params: {
    search: string;
    skip: number;
    take: number;
    order: string;
  }) => {
    const queryString = stringify(params);
    return api.get(`${appConfig.API_URL}/users/search?${queryString}`, {}, newCancelToken());
  };

  // ====================== System Accounts ======================
  const getMyPermissions = () => api.get('/account-svc/v1/permissions/me', {}, newCancelToken());

  // ====================== Users Management ======================
  const getAllUsers = (params: GetPropertiesParams) => {
    const queryString = stringify(params);
    return api.get(`/account-svc/v1/users?${queryString}`, {}, newCancelToken());
  };

  const getUser = (params: { id: User['id'] }) => {
    return api.get(`/account-svc/v1/users/${params.id}`, {}, newCancelToken());
  };

  const createUser = (payload: AddUserPayload) => {
    return api.post(
      `/account-svc/v1/users`,
      {
        ...payload,
      },
      newCancelToken()
    );
  };

  const updateUser = (payload: UpdateUserPayload) => {
    const url = `/account-svc/v1/users/${payload.id}`;
    delete payload.id;
    return api.put(
      url,
      {
        ...payload,
      },
      newCancelToken()
    );
  };

  const deleteUser = (userId: User['id']) => {
    return api.delete(`/account-svc/v1/users/${userId}`, {}, newCancelToken());
  };

  const searchUsers = (params: GetPropertiesParams) => {
    const queryString = stringify(params);
    return api.get(`/account-svc/v1/users/search/delegates?${queryString}`, {}, newCancelToken());
  };

  const searchProjects = (params: GetPropertiesParams) => {
    const queryString = stringify(params);
    return api.get(`/account-svc/v1/projects?${queryString}`, {}, newCancelToken());
  };

  const getUrlExportUsers = () => {
    return api.get('/account-svc/v1/users/export', {}, newCancelToken());
  };

  const updateUserLastPasswordChanged = (payload: UpdateUserLastPasswordChangedParams) => {
    const url = `/account-svc/v1/users/pass/${payload.username}`;
    const localXApiKey = XApiKeyService.getApiKey();

    const options = {
      headers: {
        ...(localXApiKey && {
          'X-API-KEY': localXApiKey,
        }),
      },
    };

    return api.put(url, undefined, options);
  };

  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  //
  // Notice we're not returning back the `api` created in step 1. That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    getRoot,
    // ====================== Auth ======================
    // getPermission,
    confirmSignIn,
    signIn,

    signOut,
    forgotPassword,
    submitForgotPassword,
    changePassword,
    // setPreferredMfa,
    completeNewPassword,

    // ====================== File ======================
    getPresignedUserServiceUrl,
    uploadFile,
    uploadFileWithProgress,
    getDecodeUserServiceUrl,

    // ====================== Content ======================
    getContents,

    // ====================== Users ======================
    getUserId,

    // ====================== Profile ======================
    getMyProfile,
    // updateMyProfile,
    updateUserAvatar,
    updateMyProfile,
    confirmPassword,

    // ====================== System Accounts ======================
    searchUserAccounts,
    searchUserAccountsAxios,
    searchUserAccountsByOrderAxios,

    // ====================== System Accounts ======================
    getMyPermissions,

    // ====================== Users Management ======================
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    searchProjects,
    getUrlExportUsers,
    updateUserLastPasswordChanged,
  };
};

export type Apis = ReturnType<typeof create>;

export default {
  create,
};
