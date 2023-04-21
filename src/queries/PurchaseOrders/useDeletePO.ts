import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from './../helpers';

export function useDeletePO(options?: UseMutationOptions<any, Error, { id: string }>) {
  const {
    mutate: deletePO,
    isLoading,
    isSuccess: isDeletePOSuccess,
  } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) => responseWrapper(apiClient.deletePO, [payload]),
    ...options,
  });

  return {
    deletePO,
    isLoading,
    isDeletePOSuccess,
  };
}
