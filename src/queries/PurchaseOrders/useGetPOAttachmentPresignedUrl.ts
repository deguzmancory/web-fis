import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { GetPresignedPoAttachmentDownloadUrl } from './types';

export function useGetPOAttachmentPresignedUrl(
  options?: UseMutationOptions<
    ApiResponseType<{ url: string }>,
    Error,
    GetPresignedPoAttachmentDownloadUrl
  >
) {
  const {
    mutate: getPresignedDownloadUrl,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<{ url: string }>, Error, GetPresignedPoAttachmentDownloadUrl>({
    mutationFn: (payload: GetPresignedPoAttachmentDownloadUrl) =>
      responseWrapper(apiClient.getPoFileAttachmentPresignedDownloadUrl, [payload]),
    ...options,
  });

  return {
    getPresignedDownloadUrl,
    data,
    isLoading,
    isSuccess,
  };
}
