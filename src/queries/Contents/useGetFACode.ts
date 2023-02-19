import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, authResponseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { FACode, GetFACodesResponse } from './types';

export function useGetFACode(
  options?: UseQueryOptions<ApiResponseType<{ data: GetFACodesResponse }>, Error, FACode[]>
) {
  const {
    data: faCodes,
    error,
    isError,
    isFetching: isLoading,
    refetch: onGetFACodes,
  } = useQuery<ApiResponseType<{ data: GetFACodesResponse }>, Error, FACode[]>(
    [API_QUERIES.FA_CODES],
    {
      queryFn: (_query) => {
        return authResponseWrapper<ApiResponseType<{ data: GetFACodesResponse }>>(
          apiClient.getFACodes
        );
      },
      select(data) {
        return data.data?.data?.faCodes || [];
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
    onGetPICodes: onGetFACodes,
    handleInvalidatePICode: handleInvalidateFACode,
  };
}
