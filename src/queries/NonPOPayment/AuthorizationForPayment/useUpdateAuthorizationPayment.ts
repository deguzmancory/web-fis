import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, responseWrapper } from 'src/queries/helpers';
import { AuthorizationPaymentResponse, UpsertAuthorizationPayload } from './types';

export function useUpdateAuthorizationPayment(
  options?: UseMutationOptions<
    ApiResponseType<AuthorizationPaymentResponse>,
    Error,
    UpsertAuthorizationPayload
  >
) {
  const {
    mutate: updateAuthorizationPayment,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<AuthorizationPaymentResponse>, Error, UpsertAuthorizationPayload>(
    {
      mutationFn: (payload: UpsertAuthorizationPayload) =>
        responseWrapper(apiClient.updateAuthorizationPayment, [payload]),
      ...options,
    }
  );

  return {
    updateAuthorizationPayment,
    data,
    isLoading,
    isSuccess,
  };
}
