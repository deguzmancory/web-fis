import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { PODetailResponse, UpsertPOPayload } from './types';

export function useCreatePO(
  options?: UseMutationOptions<ApiResponseType<PODetailResponse>, Error, UpsertPOPayload>
) {
  const {
    mutate: createPO,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<PODetailResponse>, Error, UpsertPOPayload>({
    mutationFn: (payload: UpsertPOPayload) => responseWrapper(apiClient.createPO, [payload]),
    ...options,
  });

  return {
    createPO,
    isLoading,
    isSuccess,
  };
}
