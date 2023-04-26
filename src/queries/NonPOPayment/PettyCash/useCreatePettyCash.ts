import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, responseWrapper } from 'src/queries/helpers';
import { PettyCashDetailResponse, UpsertPettyCashPayload } from './types';

export function useCreatePettyCash(
  options?: UseMutationOptions<
    ApiResponseType<PettyCashDetailResponse>,
    Error,
    UpsertPettyCashPayload
  >
) {
  const {
    mutate: createPettyCash,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<PettyCashDetailResponse>, Error, UpsertPettyCashPayload>({
    mutationFn: (payload: UpsertPettyCashPayload) =>
      responseWrapper(apiClient.createPettyCash, [payload]),
    ...options,
  });

  return {
    createPettyCash,
    data,
    isLoading,
    isSuccess,
  };
}
