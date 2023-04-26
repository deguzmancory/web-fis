import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { responseWrapper } from 'src/queries/helpers';

export function useDeletePettyCash(options?: UseMutationOptions<any, Error, { id: string }>) {
  const { mutate: deletePettyCash, isLoading } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) => responseWrapper(apiClient.deletePettyCash, [payload]),
    ...options,
  });

  return {
    deletePettyCash,
    isLoading,
  };
}
