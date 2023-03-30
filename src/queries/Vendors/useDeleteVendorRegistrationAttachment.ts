import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';
import { DeleteVendorRegistrationAttachmentPayload } from './types';

export function useDeleteVendorRegistrationAttachment(
  options?: UseMutationOptions<any, Error, DeleteVendorRegistrationAttachmentPayload>
) {
  const { mutate: deleteVendorRegistrationAttachment, isLoading } = useMutation<
    any,
    Error,
    DeleteVendorRegistrationAttachmentPayload
  >({
    mutationFn: (payload: DeleteVendorRegistrationAttachmentPayload) =>
      responseWrapper(apiClient.deleteVendorRegistrationAttachment, [payload]),
    ...options,
  });

  return {
    deleteVendorRegistrationAttachment,
    isLoading,
  };
}
