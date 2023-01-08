import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { GetPresignedDownloadPayload, GetPresignedDownloadResponse } from './types';

export function useGetPresignedDownloadUrl(
  options?: UseMutationOptions<
    ApiResponseType<GetPresignedDownloadResponse>,
    Error,
    GetPresignedDownloadPayload
  >
) {
  const {
    mutate: onGetDecodeUrl,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useMutation<
    ApiResponseType<GetPresignedDownloadResponse>,
    Error,
    GetPresignedDownloadPayload
  >({
    mutationFn: (payload: GetPresignedDownloadPayload) => {
      return responseWrapper<any>(apiClient.getDecodeUserServiceUrl, [payload]);
    },
    ...options,
  });

  return {
    onGetDecodeUrl,
    error,
    isError,
    isLoading,
    isSuccess,
  };
}
