import { MutateOptions, useMutation } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';
import { ApiResponseType } from './../helpers';
import { VenderItem, VendorRegistrationPayload } from './types';

export const useUpdateVendorRegistration = (
  options?: MutateOptions<ApiResponseType<VenderItem>, Error, VendorRegistrationPayload>
) => {
  const {
    mutate: updateVendorRegistration,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<VenderItem>, Error, VendorRegistrationPayload>({
    mutationFn: (payload: VendorRegistrationPayload) =>
      responseWrapper(apiClient.updateVendorRegistration, [payload]),
    ...options,
  });

  return {
    updateVendorRegistration,
    data,
    isLoading,
    isSuccess,
  };
};
