import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../../apiClient';
import { responseWrapper } from '../../helpers';

export function useViewNonEmployeeTravelFinalPdf(
  options?: UseMutationOptions<any, Error, { id: string }>
) {
  const { mutate: getFinalPdfNonEmployeeTravel } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.getFinalPdfNonEmployeeTravel, [payload]),
    ...options,
  });

  return {
    getFinalPdfNonEmployeeTravel,
  };
}
