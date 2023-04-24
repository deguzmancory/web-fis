import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { responseWrapper } from 'src/queries/helpers';

export function useDeleteAuthorization(options?: UseMutationOptions<any, Error, { id: string }>) {
  const { mutate: deleteAuthorizationPayment, isLoading } = useMutation<any, Error, { id: string }>(
    {
      mutationFn: (payload: { id: string }) =>
        responseWrapper(apiClient.deleteAuthorizationPayment, [payload]),
      ...options,
    }
  );

  return {
    deleteAuthorizationPayment,
    isLoading,
  };
}
