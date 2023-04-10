import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { POPaymentResponse } from './types';

export function useCreatePOPayment(
  options?: UseMutationOptions<ApiResponseType<POPaymentResponse>, Error, { id: string }>
) {
  const {
    mutate: createPOPayment,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<POPaymentResponse>, Error, { id: string }>({
    mutationFn: (payload: { id: string }) => responseWrapper(apiClient.createPOPayment, [payload]),
    ...options,
  });

  return {
    createPOPayment,
    isLoading,
    isSuccess,
  };
}
