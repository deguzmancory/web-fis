import { UseMutationOptions, useMutation } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { responseWrapper } from 'src/queries/helpers';

export function usePostPettyCashCloneDocument(options?: UseMutationOptions<any, Error, any>) {
  const { mutate: postPettyCashCloneDocument, isLoading } = useMutation<any, Error, any>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.postPettyCashCloneDocument, [payload]),
    ...options,
  });

  return {
    postPettyCashCloneDocument,
    isLoading,
  };
}
