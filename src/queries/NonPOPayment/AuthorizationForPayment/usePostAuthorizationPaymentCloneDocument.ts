import { UseMutationOptions, useMutation } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { responseWrapper } from 'src/queries/helpers';

export function usePostAuthorizationPaymentCloneDocument(
  options?: UseMutationOptions<any, Error, any>
) {
  const { mutate: postAuthorizationPaymentCloneDocument, isLoading } = useMutation<any, Error, any>(
    {
      mutationFn: (payload: { id: string }) =>
        responseWrapper(apiClient.postAuthorizationPaymentCloneDocument, [payload]),
      ...options,
    }
  );

  return {
    postAuthorizationPaymentCloneDocument,
    isLoading,
  };
}
