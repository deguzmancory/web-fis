import { useMutation, UseMutationOptions } from 'react-query';
import { XApiKeyService } from 'src/services';
import apiClient from '../apiClient';
import { authResponseWrapper } from '../helpers';
import { UpdateUserLastPasswordChangedParams } from './types';
export function useUpdateUserLastPasswordChanged(
  options?: UseMutationOptions<any, Error, UpdateUserLastPasswordChangedParams>
) {
  const clearLocalApiKey = () => {
    return setTimeout(() => {
      XApiKeyService.clearApiKey();
    }, 100);
  };

  const { mutate: updateUserLastPasswordChanged, isLoading } = useMutation<
    any,
    Error,
    UpdateUserLastPasswordChangedParams
  >({
    mutationFn: (payload: UpdateUserLastPasswordChangedParams) => {
      XApiKeyService.setApiKey();
      return authResponseWrapper(apiClient.updateUserLastPasswordChanged, [payload]);
    },
    onSuccess() {
      clearLocalApiKey();
      return;
    },
    onError() {
      clearLocalApiKey();
      return;
    },
    ...options,
  });

  return {
    updateUserLastPasswordChanged,
    isLoading,
  };
}
