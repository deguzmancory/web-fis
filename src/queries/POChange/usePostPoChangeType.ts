import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';
import { PostPOChangeTypePayload } from './types';

export function usePostPoChangeType(
  options?: UseMutationOptions<any, Error, PostPOChangeTypePayload>
) {
  const {
    mutate: postPoChangeType,
    isLoading,
    isSuccess,
  } = useMutation<any, Error, PostPOChangeTypePayload>({
    mutationFn: (payload: PostPOChangeTypePayload) =>
      responseWrapper(apiClient.postPoChangeType, [payload]),
    ...options,
  });

  return {
    postPoChangeType,
    isLoading,
    isSuccess,
  };
}
