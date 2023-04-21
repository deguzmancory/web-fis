import { UseMutationOptions, useMutation } from 'react-query';
import { AddPoAttachmentPayload, POFileAttachmentResponse } from 'src/queries/PurchaseOrders';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, responseWrapper } from 'src/queries/helpers';

export function useAddAuthorizationAttachment(
  options?: UseMutationOptions<
    ApiResponseType<POFileAttachmentResponse>,
    Error,
    AddPoAttachmentPayload
  >
) {
  const {
    mutate: addAuthorizationAttachment,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<POFileAttachmentResponse>, Error, AddPoAttachmentPayload>({
    mutationFn: (payload: AddPoAttachmentPayload) =>
      responseWrapper(apiClient.addAuthorizationPaymentAttachment, [payload]),
    ...options,
  });

  return {
    addAuthorizationAttachment,
    data,
    isLoading,
    isSuccess,
  };
}
