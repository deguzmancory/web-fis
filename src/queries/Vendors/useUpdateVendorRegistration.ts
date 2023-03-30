import { MutateOptions, useMutation } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';
import { ApiResponseType } from './../helpers';
import { Vendor, VendorRegistrationPayload } from './types';

export const useUpdateVendorRegistration = (
  options?: MutateOptions<ApiResponseType<Vendor>, Error, VendorRegistrationPayload>
) => {
  const {
    mutate: updateVendorRegistration,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<Vendor>, Error, VendorRegistrationPayload>({
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
