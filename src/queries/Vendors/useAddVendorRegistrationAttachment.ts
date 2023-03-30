import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { VendorRegistrationAttachment } from './types';

export function useAddVendorRegistrationAttachment(
  options?: UseMutationOptions<
    ApiResponseType<VendorRegistrationAttachment>,
    Error,
    VendorRegistrationAttachment
  >
) {
  const {
    mutate: addVendorRegistrationAttachment,
    data,
    isLoading,
    isSuccess,
  } = useMutation<
    ApiResponseType<VendorRegistrationAttachment>,
    Error,
    VendorRegistrationAttachment
  >({
    mutationFn: (payload: VendorRegistrationAttachment) =>
      responseWrapper(apiClient.addVendorRegistrationAttachment, [payload]),
    ...options,
  });

  return {
    addVendorRegistrationAttachment,
    data,
    isLoading,
    isSuccess,
  };
}
