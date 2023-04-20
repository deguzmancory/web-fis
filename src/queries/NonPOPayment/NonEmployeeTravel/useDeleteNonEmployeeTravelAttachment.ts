import { UseMutationOptions, useMutation } from 'react-query';
import { DeletePoAttachmentPayload } from 'src/queries/PurchaseOrders';
import apiClient from 'src/queries/apiClient';
import { responseWrapper } from 'src/queries/helpers';

export function useDeleteNonEmployeeTravelAttachment(
  options?: UseMutationOptions<any, Error, DeletePoAttachmentPayload>
) {
  const { mutate: deleteNonEmployeeTravelAttachment, isLoading } = useMutation<
    any,
    Error,
    DeletePoAttachmentPayload
  >({
    mutationFn: (payload: DeletePoAttachmentPayload) =>
      responseWrapper(apiClient.deleteNonEmployeeTravelAttachment, [payload]),
    ...options,
  });

  return {
    deleteNonEmployeeTravelAttachment,
    isLoading,
  };
}
