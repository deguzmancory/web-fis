import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { authResponseWrapper } from '../helpers';
import { AddUserPayload } from './types';
export function useCreateUser(options?: UseMutationOptions<any, Error, AddUserPayload>) {
  const { mutate: createUser, isLoading } = useMutation<any, Error, AddUserPayload>({
    mutationFn: (payload: AddUserPayload) => authResponseWrapper(apiClient.createUser, [payload]),
    ...options,
  });

  return {
    createUser,
    isLoading,
  };
}
