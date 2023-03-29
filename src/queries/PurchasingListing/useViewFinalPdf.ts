import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';

export function useViewFinalPdf(options?: UseMutationOptions<any, Error, { id: string }>) {
  const { mutate: getFinalPdf } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.getFinalPdfPurchaseOrder, [payload]),
    ...options,
  });

  return {
    getFinalPdf,
  };
}
