import { useMutation, UseMutationOptions } from 'react-query';
import { DelegationKeyService, TokenService } from 'src/services';
import apiClient from '../apiClient';
import { authResponseWrapper } from '../helpers';
// < return Data, Error, Payload Type, Context Types >
export function useLogout(options?: UseMutationOptions<any, Error, void>) {
  const { mutate, isLoading } = useMutation<any, Error, void>({
    mutationFn: () => authResponseWrapper(apiClient.signOut),
    onSuccess(data, variables, context) {
      TokenService.clearToken();
      DelegationKeyService.clearDelegationKey();
    },
    ...options,
  });

  return {
    logout: mutate,
    isLoggingOut: isLoading,
  };
}
