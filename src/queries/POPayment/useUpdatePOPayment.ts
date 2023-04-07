import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { POPaymentResponse, UpdatePOPaymentPayload } from './types';

export function useUpdatePOPayment(
  options?: UseMutationOptions<ApiResponseType<POPaymentResponse>, Error, UpdatePOPaymentPayload>
) {
  const {
    mutate: updatePOPayment,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<POPaymentResponse>, Error, UpdatePOPaymentPayload>({
    mutationFn: (payload: UpdatePOPaymentPayload) =>
      responseWrapper(apiClient.updatePOPayment, [payload]),
    ...options,
  });

  return {
    updatePOPayment,
    data,
    isLoading,
    isSuccess,
  };
}
