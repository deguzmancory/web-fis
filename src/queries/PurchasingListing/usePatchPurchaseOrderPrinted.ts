import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';

export function usePatchPurchaseOrderPrinted(
  options?: UseMutationOptions<any, Error, { id: string }>
) {
  const { mutate: patchPrintedId } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.patchPrintedPurchaseOrder, [payload]),
    ...options,
  });

  return {
    patchPrintedId,
  };
}
