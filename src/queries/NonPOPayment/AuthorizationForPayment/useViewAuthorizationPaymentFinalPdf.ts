import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { responseWrapper } from 'src/queries/helpers';

export function useViewAuthorizationPaymentFinalPdf(
  options?: UseMutationOptions<any, Error, { id: string }>
) {
  const { mutate: getFinalPdfAuthorizationPayment } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.getAuthorizationPaymentFinalPdf, [payload]),
    ...options,
  });

  return {
    getFinalPdfAuthorizationPayment,
  };
}
