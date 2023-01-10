import { QueryFunction, useQuery, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { transformPermission } from './helpers';
import { Permission } from './types';

export function useMyPermissions(
  options?: UseQueryOptions<ApiResponseType<Permission[]>, Error, string[]> & {
    customKey?: string;
  }
) {
  const handleGetMyPermissions: QueryFunction<ApiResponseType<Permission[]>, API_QUERIES> = () =>
    responseWrapper<ApiResponseType<Permission[]>>(apiClient.getMyPermissions);
  const {
    data: myPermissions,
    error,
    isError,
    isFetching: isLoadingMyPermissions,
    refetch: getMyPermissions,
  } = useQuery<ApiResponseType<Permission[]>, Error, string[]>(
    [API_QUERIES.PERMISSIONS, options?.customKey],
    {
      queryFn: handleGetMyPermissions,
      refetchOnMount: false,
      select: (data) => data.data?.map((permission) => transformPermission(permission)),
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
