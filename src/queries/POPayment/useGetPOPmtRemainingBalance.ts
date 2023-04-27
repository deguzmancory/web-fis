import { UseQueryOptions, useQuery, useQueryClient } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, getResponseData, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { POPaymentRemainingBalance } from './types';

export function useGetPOPmtRemainingBalance(
  options?: UseQueryOptions<
    ApiResponseType<POPaymentRemainingBalance>,
    Error,
    POPaymentRemainingBalance
  > & {
    id: string;
  }
) {
  const {
    data: remainingBalanceData,
    error,
    isFetching: isLoading,
    refetch: onGetRemainingBalance,
  } = useQuery<ApiResponseType<POPaymentRemainingBalance>, Error, POPaymentRemainingBalance>(
    [API_QUERIES.PO_PAYMENT_REMAINING_BALANCE, { id: options.id }],
    {
      queryFn: (query) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...params] = query.queryKey;
        return responseWrapper<ApiResponseType<POPaymentRemainingBalance>>(
          apiClient.getPOPaymentRemainingBalance,
          params
        );
      },
      notifyOnChangeProps: ['data', 'isFetching'],
      select: getResponseData,
      enabled: false,
      ...options,
    }
  );

  const queryClient = useQueryClient();

  const handleInvalidateRemainingBalance = () =>
    queryClient.invalidateQueries(API_QUERIES.PO_PAYMENT_REMAINING_BALANCE);

  return {
    remainingBalanceData,
    error,
    isLoading,
    onGetRemainingBalance,
    handleInvalidateRemainingBalance,
  };
}
