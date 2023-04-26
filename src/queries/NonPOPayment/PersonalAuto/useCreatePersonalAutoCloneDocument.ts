import { UseMutationOptions, useMutation } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { responseWrapper } from 'src/queries/helpers';

export function useCreatePersonalAutoCloneDocument(options?: UseMutationOptions<any, Error, any>) {
  const { mutate: createPersonalAutoCloneDocument, isLoading } = useMutation<any, Error, any>({
    mutationFn: (payload: { id: string }) =>
      responseWrapper(apiClient.createPersonalAutoCloneDocument, [payload]),
    ...options,
  });

  return {
    createPersonalAutoCloneDocument,
    isLoading,
  };
}
