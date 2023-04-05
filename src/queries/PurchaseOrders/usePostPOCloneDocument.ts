import { UseMutationOptions, useMutation } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';

export function usePostPOCloneDocument(options?: UseMutationOptions<any, Error, any>) {
  const { mutate: postPOCloneDocument, isLoading } = useMutation<any, Error, any>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.postPOCloneDocument, [payload]),
    ...options,
  });

  return {
    postPOCloneDocument,
    isLoading,
  };
}
