import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { responseWrapper } from 'src/queries/helpers';

export function useDeleteNonEmployeeTravel(
  options?: UseMutationOptions<any, Error, { id: string }>
) {
  const { mutate: deleteNonEmployeeTravel, isLoading } = useMutation<any, Error, { id: string }>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.deleteNonEmployeeTravel, [payload]),
    ...options,
  });

  return {
    deleteNonEmployeeTravel,
    isLoading,
  };
}
