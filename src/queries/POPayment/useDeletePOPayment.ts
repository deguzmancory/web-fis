import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';

export function useDeletePOPayment(options?: UseMutationOptions<any, Error, { id: string }>) {
  const { mutate: deletePOPayment, isLoading } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) => responseWrapper(apiClient.deletePOPayment, [payload]),
    ...options,
  });

  return {
    deletePOPayment,
    isLoading,
  };
}
