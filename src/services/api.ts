import apisauce from 'apisauce';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import { delay } from 'lodash';
import appConfig from 'src/appConfig';
import {
  GetTokenDelegationPayload,
  UpdateGlobalSettingPayload,
  UpdateProfilePayload,
} from 'src/queries';
import { GetPresignedPayload, UploadFilePayload } from 'src/queries/File/types';
import { GetPropertiesParams } from 'src/queries/helpers';
import {
  AddPoAttachmentPayload,
  DeletePoAttachmentPayload,
  GetPresignedPoAttachmentDownloadUrl,
  GetPresignedPOPayload,
  UpsertPOPayload,
} from 'src/queries/PurchaseOrders';
import { SearchQuoteParams } from 'src/queries/SuperQuotes/types';
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
  UpdateUserLastPasswordChangedParams,
  UpdateUserPayload,
  User,
} from 'src/queries/Users/types';
import { SearchVendorsParams, VendorRegistrationPayload } from 'src/queries/Vendors';
import { newCancelToken, stringify } from 'src/utils';
import {
  DelegationKeyService,
  RoleService,
  Toastify,
  TokenService,
  XApiKeyService,
  ZipCodeService,
} from '.';

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

        const delegationKey = DelegationKeyService.getDelegationKey();
        const currentRoleKey = RoleService.getCurrentRole();

        if (delegationKey) {
          config.headers['x-delegation-token'] = delegationKey;
        }
        if (currentRoleKey) {
          config.headers['x-active-role'] = currentRoleKey;
        }

        return Promise.resolve(config);
      })
      .catch(() => {
        return Promise.resolve(config);
      });
  });

  api.axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      //handle 401 error
      //force refresh token & retry to calling api
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        await TokenService.forceRefreshToken();

        //re-call api here will trigger the interception.request again => interceptors.response
        const response = await api.axiosInstance(originalRequest);

        return response;
      } else if (error.response.status === 401 && originalRequest._retry) {
        Toastify.error('Token cannot be refreshed. Please try to login again.');

        delay(() => {
          signOut();
        }, 2000);

        return;
      }

      //handle other errors code here
      //

      return Promise.reject(error);
    }
  );

  const getRoot = () => api.get('');

  // ====================== Auth ======================
  const signIn = (body: SignInPayload) => Auth.signIn(body.username, body.password);

  const signOut = () => {
    TokenService.clearToken();
    DelegationKeyService.clearDelegationKey();
    RoleService.clearCurrentRole();

    return Auth.signOut();
  };

  const forgotPassword = (body: ForgotPasswordPayload) => Auth.forgotPassword(body.username);

  const submitForgotPassword = (body: SubmitForgotPasswordPayload) =>
    Auth.forgotPasswordSubmit(body.email, body.token, body.password);

  const changePassword = (body: ChangePasswordPayload) => {
    return Auth.changePassword(body.user, body.currentPassword, body.newPassword);
  };

  const confirmSignIn = (body: ConfirmSignInPayload) =>
    Auth.sendCustomChallengeAnswer(body.user, body.code);

  const confirmPassword = async (password: ConfirmPasswordPayload) => {
    return await Auth.currentAuthenticatedUser().then((user) =>
      Auth.signIn({
        username: user.username,
        password: password.password,
      })
    );
  };

  const completeNewPassword = (body: CompleteNewPasswordPayload) =>
    Auth.completeNewPassword(body.user, body.password, body.requiredAttributes);

  // ====================== Profile ======================
  const getMyProfile = () => api.get('/account-svc/v1/me', {}, newCancelToken());

  const updateMyProfile = (body: UpdateProfilePayload) =>
    api.put(`/account-svc/v1/me`, body, newCancelToken());

  const updateCurrentRoleMyProfile = (body: { roleName: string }) =>
    api.put(`/account-svc/v1/me/current-role`, body, newCancelToken());

  const updateProfilePasswordResetRequired = () =>
    api.put(`/account-svc/v1/me/password-reset-required`, {}, newCancelToken());

  const getDelegationAccesses = () => {
    return api.get('/account-svc/v1/delegation-accesses', {}, newCancelToken());
  };

  const getTokenDelegation = (body: GetTokenDelegationPayload) => {
    return api.post(
      '/account-svc/v1/me/switch-user',
      {
        accessId: body.accessId,
      },
      newCancelToken()
    );
  };

  // ====================== Content ======================
  const getContents = () => api.get('/account-svc/v1/contents', {}, newCancelToken());
  const getCityStateByZipCode = (params) => ZipCodeService.getPopulatedCityStateFromZipCode(params);
  const getPICodes = () => api.get('/account-svc/v1/pi-codes', {}, newCancelToken());
  const getFACodes = () => api.get('/account-svc/v1/fa-codes', {}, newCancelToken());

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

  // ====================== Permissions ======================
  const getMyPermissions = () => api.get('/account-svc/v1/permissions/me', {}, newCancelToken());

  const getPermissionCu = () => {
    return api.get('/account-svc/v1/permissions/cu', {}, newCancelToken());
  };

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

  // ====================== Projects ======================
  const getFinancialProjects = (params: GetPropertiesParams) => {
    const queryString = stringify(params, ['codes']);
    return api.get(`/financial-svc/v1/projects?${queryString}`, {}, newCancelToken());
  };

  // ====================== Vendors ======================
  const getAllVendors = (params: GetPropertiesParams) => {
    const queryString = stringify(params);
    return api.get(`/financial-svc/v1/vendors?${queryString}`, {}, newCancelToken());
  };

  const searchVendors = (params: SearchVendorsParams & GetPropertiesParams) => {
    const queryString = stringify(params);
    return api.get(`/financial-svc/v1/vendors/search?${queryString}`, {}, newCancelToken());
  };

  const createVendorRegistration = (payload: VendorRegistrationPayload) => {
    return api.post(
      `/financial-svc/v1/vendor-registration`,
      {
        ...payload,
      },
      newCancelToken()
    );
  };

  // ====================== Super Quotes ======================
  const searchSuperQuotes = (params: SearchQuoteParams & GetPropertiesParams) => {
    const queryString = stringify(params);
    return api.get(`/financial-svc/v1/super-quotes/numbers?${queryString}`, {}, newCancelToken());
  };

  // ====================== PO ======================
  const getPO = (params: { id: string }) => {
    return api.get(`/financial-svc/v1/purchase-orders/${params.id}`, {}, newCancelToken());
  };

  const createPO = (payload: UpsertPOPayload) => {
    return api.post(
      `/financial-svc/v1/purchase-orders?action=${payload.action}`,
      {
        ...payload,
      },
      newCancelToken()
    );
  };

  const updatePO = (payload: UpsertPOPayload) => {
    return api.put(
      `/financial-svc/v1/purchase-orders/${payload.id}?action=${payload.action}`,
      {
        ...payload,
      },
      newCancelToken()
    );
  };

  const deletePO = (params: { id: string }) => {
    return api.delete(`/financial-svc/v1/purchase-orders/${params.id}`, {}, newCancelToken());
  };

  const getPoFileAttachmentPresignedUrl = (params: GetPresignedPOPayload) => {
    return api.get(
      `/financial-svc/v1/purchase-orders/${params.id}/attachments/presigned-url`,
      params,
      newCancelToken()
    );
  };

  const getPoFileAttachmentPresignedDownloadUrl = (params: GetPresignedPoAttachmentDownloadUrl) => {
    return api.get(
      `/financial-svc/v1/purchase-orders/${params.id}/attachments/${params.attachmentId}/read`,
      params,
      newCancelToken()
    );
  };

  const addPoAttachment = (payload: AddPoAttachmentPayload) => {
    return api.put(
      `/financial-svc/v1/purchase-orders/${payload.id}/attachments`,
      {
        ...payload,
      },
      newCancelToken()
    );
  };

  const deletePOAttachment = (params: DeletePoAttachmentPayload) => {
    return api.delete(
      `/financial-svc/v1/purchase-orders/${params.id}/attachments/${params.attachmentId}`,
      {},
      newCancelToken()
    );
  };

  // ====================== Global Settings ======================
  const getAllGlobalSettings = () => {
    return api.get('/financial-svc/v1/global-settings', {}, newCancelToken());
  };

  const updateGlobalSetting = (body: UpdateGlobalSettingPayload) => {
    const url = `/financial-svc/v1/global-setting/${body.settingId}`;
    return api.put(
      url,
      {
        settingValue: body.value,
      },
      newCancelToken()
    );
  };

  const getAppPurchasingList = (params: GetPropertiesParams) => {
    const queryString = stringify(params);
    return api.get(`/financial-svc/v1/purchase-orders?${queryString}`, {}, newCancelToken());
  };

  const getFinalPdfPurchaseOrder = (params: GetPropertiesParams) => {
    return api.get(`/financial-svc/v1/purchase-orders/${params.id}/final-pdf`);
  };

  const patchPrintedPurchaseOrder = (params: GetPropertiesParams) => {
    return api.patch(`/financial-svc/v1/purchase-orders/${params.id}/printed`);
  };

  const getPOPaymentDetail = (params: GetPropertiesParams) => {
    return api.get(`/financial-svc/v1/po-payments/${params.id}`);
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
    confirmSignIn,
    signIn,

    signOut,
    forgotPassword,
    submitForgotPassword,
    changePassword,
    completeNewPassword,
    confirmPassword,

    // ====================== File ======================
    getPresignedUserServiceUrl,
    uploadFile,
    uploadFileWithProgress,
    getDecodeUserServiceUrl,

    // ====================== Content ======================
    getContents,
    getCityStateByZipCode,
    getPICodes,
    getFACodes,

    // ====================== Profile ======================
    getMyProfile,
    // updateMyProfile,
    updateMyProfile,
    updateProfilePasswordResetRequired,
    updateCurrentRoleMyProfile,
    getDelegationAccesses,
    getTokenDelegation,

    // ====================== Permissions ======================
    getMyPermissions,
    getPermissionCu,

    // ====================== Users Management ======================
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    getUrlExportUsers,
    updateUserLastPasswordChanged,

    // ====================== Projects ======================
    getFinancialProjects,

    // ====================== Vendors ======================
    searchVendors,
    getAllVendors,
    createVendorRegistration,

    // ====================== Super Quotes ======================
    searchSuperQuotes,

    // ====================== PO ======================
    getPO,
    createPO,
    updatePO,
    deletePO,
    getPoFileAttachmentPresignedUrl,
    getPoFileAttachmentPresignedDownloadUrl,
    addPoAttachment,
    deletePOAttachment,

    // ================== Purchasing List ===============
    getAppPurchasingList,
    getFinalPdfPurchaseOrder,
    patchPrintedPurchaseOrder,
    getPOPaymentDetail,

    // Global Settings
    getAllGlobalSettings,
    updateGlobalSetting,
  };
};

export type Apis = ReturnType<typeof create>;

export default {
  create,
};
