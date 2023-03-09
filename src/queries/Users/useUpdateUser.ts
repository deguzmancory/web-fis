import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { authResponseWrapper } from '../helpers';
import { UpdateUserPayload } from './types';
export function useUpdateUser(options?: UseMutationOptions<any, Error, UpdateUserPayload>) {
  const { mutate: updateUser, isLoading } = useMutation<any, Error, UpdateUserPayload>({
    mutationFn: (payload: UpdateUserPayload) => {
      return authResponseWrapper(apiClient.updateUser, [payload]);
    },
    ...options,
  });

  return {
    updateUser,
    isLoading,
  };
}
