import { useMutation, UseMutationOptions } from 'react-query';
import { handleShowErrorMsg } from 'src/containers/UsersManagement/helpers';
import { DelegationKeyService, Toastify } from 'src/services';
import apiClient from '../apiClient';
import { authResponseWrapper } from '../helpers';
import { GetTokenDelegationPayload } from './types';
export function useGetTokenDelegation(
  options?: UseMutationOptions<any, Error, GetTokenDelegationPayload>
) {
  const { mutate: getTokenDelegation, isLoading } = useMutation<
    any,
    Error,
    GetTokenDelegationPayload
  >({
    mutationFn: (payload) => {
      return authResponseWrapper(apiClient.getTokenDelegation, [payload]);
    },
    onSuccess(data, variables, context) {
      const jwt = data?.data?.jwt;
      if (jwt) {
        DelegationKeyService.setDelegationKey(jwt);
      } else {
        Toastify.error('Fail to switch user, please try again');
      }
    },
    onError(error, variables, context) {
      handleShowErrorMsg(error);
    },
    ...options,
  });

  return {
    getTokenDelegation,
    isLoading,
  };
}
