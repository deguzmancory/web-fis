import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, responseWrapper } from 'src/queries/helpers';
import { PettyCashDetailResponse, UpsertPettyCashPayload } from './types';

export function useUpdatePettyCash(
  options?: UseMutationOptions<
    ApiResponseType<PettyCashDetailResponse>,
    Error,
    UpsertPettyCashPayload
  >
) {
  const {
    mutate: updatePettyCash,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<PettyCashDetailResponse>, Error, UpsertPettyCashPayload>({
    mutationFn: (payload: UpsertPettyCashPayload) =>
      responseWrapper(apiClient.updatePettyCash, [payload]),
    ...options,
  });

  return {
    updatePettyCash,
    data,
    isLoading,
    isSuccess,
  };
}
