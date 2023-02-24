import { QueryFunction, useQuery, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { UserPermission } from '../Permissions';

export function useMyPermissions(
  options?: UseQueryOptions<ApiResponseType<UserPermission[]>, Error, UserPermission[]> & {
    customKey?: string;
  }
) {
  const handleGetMyPermissions: QueryFunction<
    ApiResponseType<UserPermission[]>,
    API_QUERIES
  > = () => responseWrapper<ApiResponseType<UserPermission[]>>(apiClient.getMyPermissions);
  const {
    data: myPermissions,
    error,
    isError,
    isFetching: isLoadingMyPermissions,
    refetch: getMyPermissions,
  } = useQuery<ApiResponseType<UserPermission[]>, Error, UserPermission[]>(
    [API_QUERIES.MY_PERMISSIONS, options?.customKey],
    {
      queryFn: handleGetMyPermissions,
      refetchOnMount: false,
      select: (data) => data.data,
      enabled: false,
      ...options,
    }
  );

  return {
    myPermissions,
    error,
    isError,
    isLoadingMyPermissions,
    getMyPermissions,
  };
}
