import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';
import { DeletePoAttachmentPayload } from './types';

export function useDeletePOAttachment(
  options?: UseMutationOptions<any, Error, DeletePoAttachmentPayload>
) {
  const { mutate: deletePOAttachment, isLoading } = useMutation<
    any,
    Error,
    DeletePoAttachmentPayload
  >({
    mutationFn: (payload: DeletePoAttachmentPayload) =>
      responseWrapper(apiClient.deletePOAttachment, [payload]),
    ...options,
  });

  return {
    deletePOAttachment,
    isLoading,
  };
}
