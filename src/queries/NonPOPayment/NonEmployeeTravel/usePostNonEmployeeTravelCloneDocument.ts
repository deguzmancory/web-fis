import { UseMutationOptions, useMutation } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { responseWrapper } from 'src/queries/helpers';

export function usePostNonEmployeeTravelCloneDocument(
  options?: UseMutationOptions<any, Error, any>
) {
  const { mutate: postNonEmployeeTravelCloneDocument, isLoading } = useMutation<any, Error, any>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.postNonEmployeeTravelCloneDocument, [payload]),
    ...options,
  });

  return {
    postNonEmployeeTravelCloneDocument,
    isLoading,
  };
}
