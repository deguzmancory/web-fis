import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, getResponseData, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { POPaymentResponse } from './types';

export function useGetPOPaymentDetail(
  options?: UseQueryOptions<ApiResponseType<POPaymentResponse>, Error, POPaymentResponse> & {
    id: string;
  }
) {
  const {
    data: poDetail,
    error,
    isError,
    isFetching: isLoading,
    refetch: onGetPOById,
  } = useQuery<ApiResponseType<POPaymentResponse>, Error, POPaymentResponse>(
    [API_QUERIES.PO_PAYMENT_DETAIL, { id: options.id }],
    {
      queryFn: (query) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...params] = query.queryKey;
        return responseWrapper<ApiResponseType<POPaymentResponse>>(
          apiClient.getPOPaymentDetail,
          params
        );
      },
      select: getResponseData,
      enabled: false,
      ...options,
    }
  );

  const queryClient = useQueryClient();
  const handleInvalidatePOPaymentDetail = () =>
    queryClient.invalidateQueries(API_QUERIES.PO_PAYMENT_DETAIL);

  return {
    poDetail,
    error,
    isError,
    isLoading,
    onGetPOById,
    handleInvalidatePOPaymentDetail,
  };
}
