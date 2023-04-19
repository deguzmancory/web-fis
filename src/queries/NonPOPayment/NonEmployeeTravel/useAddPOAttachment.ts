import { UseMutationOptions, useMutation } from 'react-query';
import { AddPoAttachmentPayload, POFileAttachmentResponse } from 'src/queries/PurchaseOrders';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, responseWrapper } from 'src/queries/helpers';

export function useAddNonEmployeeTravelAttachment(
  options?: UseMutationOptions<
    ApiResponseType<POFileAttachmentResponse>,
    Error,
    AddPoAttachmentPayload
  >
) {
  const {
    mutate: addNonEmployeeTravelAttachment,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<POFileAttachmentResponse>, Error, AddPoAttachmentPayload>({
    mutationFn: (payload: AddPoAttachmentPayload) =>
      responseWrapper(apiClient.addNonEmployeeTravelAttachment, [payload]),
    ...options,
  });

  return {
    addNonEmployeeTravelAttachment,
    data,
    isLoading,
    isSuccess,
  };
}
