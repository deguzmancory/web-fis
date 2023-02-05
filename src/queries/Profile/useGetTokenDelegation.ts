import { useMutation, UseMutationOptions } from 'react-query';
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
    ...options,
  });

  return {
    getTokenDelegation,
    isLoading,
  };
}
