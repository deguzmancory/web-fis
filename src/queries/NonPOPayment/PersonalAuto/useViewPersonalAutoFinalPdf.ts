import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../../apiClient';
import { responseWrapper } from '../../helpers';

export function useViewPersonalAutoFinalPdf(
  options?: UseMutationOptions<any, Error, { id: string }>
) {
  const { mutate: getPersonalAutoFinalPdf } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.getPersonalAutoFinalPDF, [payload]),
    ...options,
  });

  return {
    getPersonalAutoFinalPdf,
  };
}
