import { MutateOptions, useMutation } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';
import { ApiResponseType } from './../helpers';

export const useCreateVendorRegistration = (
  options?: MutateOptions<ApiResponseType<{ id: string }>, Error, any>
) => {
  const {
    mutateAsync: createVendorRegistrationAsync,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<{ id: string }>, Error, any>({
    mutationFn: () => responseWrapper(apiClient.createVendorRegistration),
    ...options,
  });

  return {
    createVendorRegistrationAsync,
    data,
    isLoading,
    isSuccess,
  };
};
