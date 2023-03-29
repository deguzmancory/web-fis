import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';

export function useGetPurchaseOrderDetail(
  options?: UseMutationOptions<any, Error, { id: string }>
) {
  const { mutate: getPurchaseOrderDetail } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.getPurchaseOrderDetail, [payload]),
    ...options,
  });

  return {
    getPurchaseOrderDetail,
  };
}
