import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { PODetailResponse, UpsertPOPayload } from './types';

export function useUpdatePO(
  options?: UseMutationOptions<ApiResponseType<PODetailResponse>, Error, UpsertPOPayload>
) {
  const {
    mutate: updatePO,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<PODetailResponse>, Error, UpsertPOPayload>({
    mutationFn: (payload: UpsertPOPayload) => responseWrapper(apiClient.updatePO, [payload]),
    ...options,
  });

  return {
    updatePO,
    data,
    isLoading,
    isSuccess,
  };
}
