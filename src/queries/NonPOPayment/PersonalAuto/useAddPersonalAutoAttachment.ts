import { UseMutationOptions, useMutation } from 'react-query';
import { AddPoAttachmentPayload, POFileAttachmentResponse } from 'src/queries/PurchaseOrders';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, responseWrapper } from 'src/queries/helpers';

export function useAddPersonalAutoAttachment(
  options?: UseMutationOptions<
    ApiResponseType<POFileAttachmentResponse>,
    Error,
    AddPoAttachmentPayload
  >
) {
  const {
    mutate: addPersonalAutoAttachment,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<POFileAttachmentResponse>, Error, AddPoAttachmentPayload>({
    mutationFn: (payload: AddPoAttachmentPayload) =>
      responseWrapper(apiClient.addPersonalAutoAttachment, [payload]),
    ...options,
  });

  return {
    addPersonalAutoAttachment,
    data,
    isLoading,
    isSuccess,
  };
}
