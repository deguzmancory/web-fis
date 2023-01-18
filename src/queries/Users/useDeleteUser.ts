import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { authResponseWrapper } from '../helpers';
import { User } from './types';
export function useDeleteUser(options?: UseMutationOptions<any, Error, User['id']>) {
  const { mutate: deleteUser, isLoading } = useMutation<any, Error, User['id']>({
    mutationFn: (payload: User['id']) => authResponseWrapper(apiClient.deleteUser, [payload]),
    ...options,
  });

  return {
    deleteUser,
    isLoading,
  };
}
