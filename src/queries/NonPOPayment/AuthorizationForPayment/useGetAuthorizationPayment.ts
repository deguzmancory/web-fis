import { UseQueryOptions, useQuery, useQueryClient } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, getResponseData, responseWrapper } from 'src/queries/helpers';
import { API_QUERIES } from 'src/queries/keys';
import { AuthorizationPaymentResponse } from './types';

export function useGetAuthorizationPayment(
  options?: UseQueryOptions<
    ApiResponseType<AuthorizationPaymentResponse>,
    Error,
    AuthorizationPaymentResponse
  > & { id: string }
) {
  const {
    data: authorizationPaymentDetail,
    error,
    isError,
    isFetching: isLoading,
    refetch: onGetAuthorizationPaymentPayId,
  } = useQuery<ApiResponseType<AuthorizationPaymentResponse>, Error, AuthorizationPaymentResponse>(
    [API_QUERIES.AUTHORIZATION_DETAIL, { id: options.id }],
    {
      queryFn: (query) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...params] = query.queryKey;
        return responseWrapper<ApiResponseType<AuthorizationPaymentResponse>>(
          apiClient.getAuthorizationPaymentDetail,
          params
        );
      },
      select: getResponseData,
      enabled: false,
      ...options,
    }
  );

  const queryClient = useQueryClient();
  const handleInvalidateAuthorizationPaymentDetail = () =>
    queryClient.invalidateQueries(API_QUERIES.AUTHORIZATION_DETAIL);

  return {
    authorizationPaymentDetail,
    error,
    isError,
    isLoading,
    onGetAuthorizationPaymentPayId,
    handleInvalidateAuthorizationPaymentDetail,
  };
}
