import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, authResponseWrapper, PaginationResponseType } from '../helpers';
import { API_QUERIES } from '../keys';
import { FACode } from './types';

export function useGetFACode(
  options?: UseQueryOptions<ApiResponseType<PaginationResponseType<FACode>>, Error, FACode[]>
) {
  const {
    data: faCodes,
    error,
    isError,
    isFetching: isLoading,
    refetch: onGetFACodes,
  } = useQuery<ApiResponseType<PaginationResponseType<FACode>>, Error, FACode[]>(
    [API_QUERIES.FA_CODES],
    {
      queryFn: (_query) => {
        return authResponseWrapper<ApiResponseType<PaginationResponseType<FACode>>>(
          apiClient.getFACodes
        );
      },
      select(data) {
        return data.data.data || [];
      },
      refetchOnMount: false,
      notifyOnChangeProps: ['data'],
      ...options,
    }
  );

  const queryClient = useQueryClient();
  const handleInvalidateFACode = () => queryClient.invalidateQueries(API_QUERIES.FA_CODES);

  return {
    faCodes,
    error,
    isError,
    isLoading,
    onGetFACodes,
    handleInvalidatePICode: handleInvalidateFACode,
  };
}
