import { UseMutationOptions, useMutation } from 'react-query';
import { DeletePoAttachmentPayload } from 'src/queries/PurchaseOrders';
import apiClient from 'src/queries/apiClient';
import { responseWrapper } from 'src/queries/helpers';

export function useDeleteAuthorizationPaymentAttachment(
  options?: UseMutationOptions<any, Error, DeletePoAttachmentPayload>
) {
  const { mutate: deleteAuthorizationPaymentAttachment, isLoading } = useMutation<
    any,
    Error,
    DeletePoAttachmentPayload
  >({
    mutationFn: (payload: DeletePoAttachmentPayload) =>
      responseWrapper(apiClient.deleteAuthorizationPaymentsAttachment, [payload]),
    ...options,
  });

  return {
    deleteAuthorizationPaymentAttachment,
    isLoading,
  };
}
