import { MutateOptions, useMutation } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';
import { VendorRegistrationPayload } from './types';

export const useCreateVendorRegistration = (
  options?: MutateOptions<any, Error, VendorRegistrationPayload>
) => {
  const {
    mutate: createVendorRegistration,
    data,
    isLoading,
    isSuccess,
  } = useMutation<any, Error, VendorRegistrationPayload>({
    mutationFn: (payload: VendorRegistrationPayload) =>
      responseWrapper(apiClient.createVendorRegistration, [payload]),
    ...options,
  });

  return {
    createVendorRegistration,
    data,
    isLoading,
    isSuccess,
  };
};
