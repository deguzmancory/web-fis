import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';
import { PODetailResponse } from '../PurchaseOrders';
import { PostPOChangeTypePayload } from './types';

export function useCreatePOChange(
  options?: UseMutationOptions<PODetailResponse, Error, PostPOChangeTypePayload>
) {
  const {
    mutate: createPOChange,
    isLoading,
    isSuccess,
  } = useMutation<PODetailResponse, Error, PostPOChangeTypePayload>({
    mutationFn: (payload: PostPOChangeTypePayload) =>
      responseWrapper(apiClient.createPOChange, [payload]),
    ...options,
  });

  return {
    createPOChange: createPOChange,
    isLoading,
    isSuccess,
  };
}
