import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';

export function useViewPersonalAutoPaymentFinalPdf(
  options?: UseMutationOptions<any, Error, { id: string }>
) {
  const { mutate: getFinalPdfPersonalAutoPayment } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.getFinalPdfPersonalAutoPayment, [payload]),
    ...options,
  });

  return {
    getFinalPdfPersonalAutoPayment,
  };
}
