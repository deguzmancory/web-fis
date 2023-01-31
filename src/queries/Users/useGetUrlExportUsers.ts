import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, authResponseWrapper } from '../helpers';
import { UrlExportUser } from './types';

export function useGetUrlExportUsers(
  options?: UseMutationOptions<ApiResponseType<{ data: UrlExportUser }>, Error, string>
) {
  const { mutate: getUrlExportUsers, isLoading } = useMutation<
    ApiResponseType<{ data: UrlExportUser }>,
    Error,
    string
  >({
    mutationFn: () => {
      return authResponseWrapper<ApiResponseType<{ data: UrlExportUser }>>(
        apiClient.getUrlExportUsers
      );
    },
    ...options,
  });

  return {
    getUrlExportUsers,
    isLoading,
  };
}
