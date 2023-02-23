import { QueryFunction, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, getResponseData, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { PermissionCu, PermissionCuResponse } from './types';

export function useGetPermissionCu(
  options?: UseQueryOptions<ApiResponseType<PermissionCuResponse>, Error, PermissionCu[]>
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
  } = useQuery<ApiResponseType<PermissionCuResponse>, Error, PermissionCu[]>(
    [API_QUERIES.PERMISSION_CU],
    {
      queryFn: handleGetPermissionCu,
      refetchOnMount: false,
      select: getResponseData,
      enabled: true,
      notifyOnChangeProps: ['data', 'isFetching'],
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
