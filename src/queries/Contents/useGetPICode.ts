import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, authResponseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { GetPICodesResponse, PICode } from './types';

export function useGetPICode(
  options?: UseQueryOptions<ApiResponseType<{ data: GetPICodesResponse }>, Error, PICode[]>
) {
  const {
    data: piCodes,
    error,
    isError,
    isFetching: isLoading,
    refetch: onGetPICodes,
  } = useQuery<ApiResponseType<{ data: GetPICodesResponse }>, Error, PICode[]>(
    [API_QUERIES.PI_CODES],
    {
      queryFn: (_query) => {
        return authResponseWrapper<ApiResponseType<{ data: GetPICodesResponse }>>(
          apiClient.getPICodes
        );
      },
      select(data) {
        return data.data?.data?.piCodes || [];
      },
      refetchOnMount: false,
      notifyOnChangeProps: ['data'],
      ...options,
    }
  );

  const queryClient = useQueryClient();
  const handleInvalidatePICode = () => queryClient.invalidateQueries(API_QUERIES.PI_CODES);

  return {
    piCodes,
    error,
    isError,
    isLoading,
    onGetPICodes,
    handleInvalidatePICode,
  };
}
