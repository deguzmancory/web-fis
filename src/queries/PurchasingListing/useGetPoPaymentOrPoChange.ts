import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';

export function useGetPoPaymentOrPoChange(
  options?: UseMutationOptions<any, Error, { id: string }>
) {
  const { mutate: getPOPaymentDetail } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.getPOPaymentDetail, [payload]),
    ...options,
  });

  return {
    getPOPaymentDetail,
  };
}
