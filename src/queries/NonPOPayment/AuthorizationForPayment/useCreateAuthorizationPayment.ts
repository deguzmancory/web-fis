import { UseMutationOptions, useMutation } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, responseWrapper } from 'src/queries/helpers';
import { AuthorizationPaymentResponse, UpsertAuthorizationPayload } from './types';

export function useCreateAuthorizationPayment(
  options?: UseMutationOptions<
    ApiResponseType<AuthorizationPaymentResponse>,
    Error,
    UpsertAuthorizationPayload
  >
) {
  const {
    mutate: createAuthorizationPayment,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<AuthorizationPaymentResponse>, Error, UpsertAuthorizationPayload>(
    {
      mutationFn: (payload: UpsertAuthorizationPayload) =>
        responseWrapper(apiClient.createAuthorizationPayment, [payload]),
      ...options,
    }
  );

  return {
    createAuthorizationPayment,
    data,
    isLoading,
    isSuccess,
  };
}
