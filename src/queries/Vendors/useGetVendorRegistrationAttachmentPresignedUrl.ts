import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { GetPresignedVendorRegistrationAttachmentDownloadUrl } from './types';

export function useGetVendorRegistrationAttachmentPresignedUrl(
  options?: UseMutationOptions<
    ApiResponseType<{ url: string }>,
    Error,
    GetPresignedVendorRegistrationAttachmentDownloadUrl
  >
) {
  const {
    mutate: getPresignedDownloadUrl,
    data,
    isLoading,
    isSuccess,
  } = useMutation<
    ApiResponseType<{ url: string }>,
    Error,
    GetPresignedVendorRegistrationAttachmentDownloadUrl
  >({
    mutationFn: (payload: GetPresignedVendorRegistrationAttachmentDownloadUrl) =>
      responseWrapper(apiClient.getVendorRegistrationFileAttachmentPresignedDownloadUrl, [payload]),
    ...options,
  });

  return {
    getPresignedDownloadUrl,
    data,
    isLoading,
    isSuccess,
  };
}
