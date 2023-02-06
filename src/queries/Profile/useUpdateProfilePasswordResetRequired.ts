import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { authResponseWrapper } from '../helpers';
export function useUpdateProfilePasswordResetRequired(
  options?: UseMutationOptions<any, Error, {}>
) {
  const { mutate: updateProfilePasswordResetRequired, isLoading } = useMutation<any, Error, {}>({
    mutationFn: (payload) => {
      return authResponseWrapper(apiClient.updateProfilePasswordResetRequired, [payload]);
    },
    ...options,
  });

  return {
    updateProfilePasswordResetRequired,
    isLoading,
  };
}
