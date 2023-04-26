import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../../apiClient';
import { responseWrapper } from '../../helpers';

export function useViewPettyCashFinalPdf(options?: UseMutationOptions<any, Error, { id: string }>) {
  const { mutate: getFinalPdfPettyCash } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.getFinalPdfPettyCash, [payload]),
    ...options,
  });

  return {
    getFinalPdfPettyCash,
  };
}
