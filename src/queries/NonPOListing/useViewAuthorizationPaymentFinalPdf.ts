import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';

export function useViewAuthorizationPaymentFinalPdf(
  options?: UseMutationOptions<any, Error, { id: string }>
) {
  const { mutate: getFinalPdfAuthorizationPayment } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.getFinalPdfAuthorizationPayment, [payload]),
    ...options,
  });

  return {
    getFinalPdfAuthorizationPayment,
  };
}
