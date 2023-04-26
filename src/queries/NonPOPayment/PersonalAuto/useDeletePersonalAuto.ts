import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { responseWrapper } from 'src/queries/helpers';

export function useDeletePersonalAuto(options?: UseMutationOptions<any, Error, { id: string }>) {
  const { mutate: deletePersonalAuto, isLoading } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.deletePersonalAuto, [payload]),
    ...options,
  });

  return {
    deletePersonalAuto,
    isLoading,
  };
}
