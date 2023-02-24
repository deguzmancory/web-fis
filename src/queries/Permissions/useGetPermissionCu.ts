import { QueryFunction, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, getResponseData, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { PermissionCuResponse, UserPermission } from './types';

export function useGetPermissionCu(
  options?: UseQueryOptions<ApiResponseType<PermissionCuResponse>, Error, UserPermission[]>
) {
  const handleGetPermissionCu: QueryFunction<
    ApiResponseType<PermissionCuResponse>,
    API_QUERIES
  > = () => responseWrapper<ApiResponseType<PermissionCuResponse>>(apiClient.getPermissionCu);

  const {
    data,
    error,
    isError,
    isFetching,
    refetch: getPermissionCu,
  } = useQuery<ApiResponseType<PermissionCuResponse>, Error, UserPermission[]>(
    [API_QUERIES.PERMISSION_CU],
    {
      queryFn: handleGetPermissionCu,
      refetchOnMount: false,
      enabled: true,
      notifyOnChangeProps: ['data', 'isFetching'],
      select: getResponseData,
      ...options,
    }
  );

  const queryClient = useQueryClient();

  const handleInvalidatePermissionCu = () =>
    queryClient.invalidateQueries([API_QUERIES.PERMISSION_CU]);

  return {
    permissionsCu: data,
    error,
    isError,
    loading: isFetching,
    getPermissionCu,
    handleInvalidatePermissionCu,
  };
}
