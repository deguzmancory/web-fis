import { UseMutationOptions, useMutation } from 'react-query';
import { GetPresignedPoAttachmentDownloadUrl } from 'src/queries/PurchaseOrders';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, responseWrapper } from 'src/queries/helpers';

export function useGetPettyCashAttachmentPresignedUrl(
  options?: UseMutationOptions<
    ApiResponseType<{ url: string }>,
    Error,
    GetPresignedPoAttachmentDownloadUrl
  >
) {
  const {
    mutate: getPettyCashPresignedDownloadUrl,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<{ url: string }>, Error, GetPresignedPoAttachmentDownloadUrl>({
    mutationFn: (payload: GetPresignedPoAttachmentDownloadUrl) =>
      responseWrapper(apiClient.getPettyCashFileAttachmentPresignedDownloadUrl, [payload]),
    ...options,
  });

  return {
    getPettyCashPresignedDownloadUrl,
    data,
    isLoading,
    isSuccess,
  };
}
