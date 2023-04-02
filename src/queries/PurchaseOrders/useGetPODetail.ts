import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, getResponseData, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { PODetailResponse } from './types';

export function useGetPODetail(
  options?: UseQueryOptions<ApiResponseType<PODetailResponse>, Error, PODetailResponse> & {
    id: string;
  }
) {
  const {
    data: poDetail,
    error,
    isError,
    isFetching: isLoading,
    refetch: onGetPOById,
  } = useQuery<ApiResponseType<PODetailResponse>, Error, PODetailResponse>(
    [API_QUERIES.PO_DETAIL, { id: options.id }],
    {
      queryFn: (query) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...params] = query.queryKey;
        return responseWrapper<ApiResponseType<PODetailResponse>>(apiClient.getPO, params);
      },
      select: getResponseData,
      enabled: false,
      ...options,
    }
  );

  const queryClient = useQueryClient();
  const handleInvalidatePODetail = () => queryClient.invalidateQueries(API_QUERIES.PO_DETAIL);

  return {
    poDetail,
    error,
    isError,
    isLoading,
    onGetPOById,
    handleInvalidatePODetail,
  };
}
