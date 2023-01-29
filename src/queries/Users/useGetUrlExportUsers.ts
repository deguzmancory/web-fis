import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { authResponseWrapper } from '../helpers';
import { UrlExportUser } from './types';

export function useGetUrlExportUsers(options?: UseMutationOptions<UrlExportUser, Error, string>) {
  const { mutate: getUrlExportUsers, isLoading } = useMutation<UrlExportUser, Error, string>({
    mutationFn: () => {
      return authResponseWrapper<UrlExportUser>(apiClient.getUrlExportUsers);
    },
    ...options,
  });

  return {
    getUrlExportUsers,
    isLoading,
  };
}
