import { QueryFunction, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, getResponseData, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { DelegationAccessResponse } from './types';

export function useGetDelegationAccesses(
  options?: UseQueryOptions<
    ApiResponseType<DelegationAccessResponse>,
    Error,
    DelegationAccessResponse
  >
) {
  const handleGetDelegationAccesses: QueryFunction<
    ApiResponseType<DelegationAccessResponse>,
    API_QUERIES
  > = () =>
    responseWrapper<ApiResponseType<DelegationAccessResponse>>(apiClient.getDelegationAccesses);
  const {
    data,
    error,
    isError,
    isFetching,
    refetch: getDelegationAccesses,
  } = useQuery<ApiResponseType<DelegationAccessResponse>, Error, DelegationAccessResponse>(
    [API_QUERIES.DELEGATION_ACCESSES],
    {
      queryFn: handleGetDelegationAccesses,
      refetchOnMount: false,
      select: getResponseData,
      enabled: false,
      notifyOnChangeProps: ['data'],
      ...options,
    }
  );

  const queryClient = useQueryClient();

  const handleInvalidateDelegationAccesses = () =>
    queryClient.invalidateQueries([API_QUERIES.DELEGATION_ACCESSES]);

  return {
    receivedAccesses: data,
    error,
    isError,
    loading: isFetching,
    getDelegationAccesses,
    handleInvalidateDelegationAccesses,
  };
}
