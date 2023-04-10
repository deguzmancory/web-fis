import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { PODetailResponse } from '../PurchaseOrders';
import { PostPOChangeTypePayload } from './types';

export function useCreatePOChange(
  options?: UseMutationOptions<ApiResponseType<PODetailResponse>, Error, PostPOChangeTypePayload>
) {
  const {
    mutate: createPOChange,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<PODetailResponse>, Error, PostPOChangeTypePayload>({
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
