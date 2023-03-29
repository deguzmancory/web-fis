import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { AddPoAttachmentPayload, POFileAttachmentResponse } from './types';

export function useAddPOAttachment(
  options?: UseMutationOptions<
    ApiResponseType<POFileAttachmentResponse>,
    Error,
    AddPoAttachmentPayload
  >
) {
  const {
    mutate: addPoAttachment,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<POFileAttachmentResponse>, Error, AddPoAttachmentPayload>({
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
