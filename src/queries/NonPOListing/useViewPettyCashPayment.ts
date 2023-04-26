import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';

export function useViewPettyCashPaymentFinalPdf(
  options?: UseMutationOptions<any, Error, { id: string }>
) {
  const { mutate: getFinalPdfPettyCashPayment } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.getFinalPdfPettyCashPayment, [payload]),
    ...options,
  });

  return {
    getFinalPdfPettyCashPayment,
  };
}
