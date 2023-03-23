import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';
import { AddPoAttachmentPayload } from './types';

export function useAddPOAttachment(
  options?: UseMutationOptions<any, Error, AddPoAttachmentPayload>
) {
  const {
    mutate: addPoAttachment,
    data,
    isLoading,
    isSuccess,
  } = useMutation<any, Error, AddPoAttachmentPayload>({
    mutationFn: (payload: AddPoAttachmentPayload) =>
      responseWrapper(apiClient.addPoAttachment, [payload]),
    ...options,
  });

  return {
    addPoAttachment,
    data,
    isLoading,
    isSuccess,
  };
}
