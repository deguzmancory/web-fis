import { UseMutationOptions, useMutation } from 'react-query';
import { DeletePoAttachmentPayload } from 'src/queries/PurchaseOrders';
import apiClient from 'src/queries/apiClient';
import { responseWrapper } from 'src/queries/helpers';

export function useDeletePersonalAutoAttachment(
  options?: UseMutationOptions<any, Error, DeletePoAttachmentPayload>
) {
  const { mutate: deletePersonalAutoAttachment, isLoading } = useMutation<
    any,
    Error,
    DeletePoAttachmentPayload
  >({
    mutationFn: (payload: DeletePoAttachmentPayload) =>
      responseWrapper(apiClient.deletePersonalAutoAttachment, [payload]),
    ...options,
  });

  return {
    deletePersonalAutoAttachment,
    isLoading,
  };
}
