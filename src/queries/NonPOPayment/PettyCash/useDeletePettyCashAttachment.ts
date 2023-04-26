import { UseMutationOptions, useMutation } from 'react-query';
import { DeletePoAttachmentPayload } from 'src/queries/PurchaseOrders';
import apiClient from 'src/queries/apiClient';
import { responseWrapper } from 'src/queries/helpers';

export function useDeletePettyCashAttachment(
  options?: UseMutationOptions<any, Error, DeletePoAttachmentPayload>
) {
  const { mutate: deletePettyCashAttachment, isLoading } = useMutation<
    any,
    Error,
    DeletePoAttachmentPayload
  >({
    mutationFn: (payload: DeletePoAttachmentPayload) =>
      responseWrapper(apiClient.deletePettyCashAttachment, [payload]),
    ...options,
  });

  return {
    deletePettyCashAttachment,
    isLoading,
  };
}
