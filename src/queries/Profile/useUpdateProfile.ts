import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { authResponseWrapper } from '../helpers';
import { UpdateProfilePayload } from './types';

export const useUpdateProfile = (
  options?: UseMutationOptions<any, Error, UpdateProfilePayload>
) => {
  const { mutate: updateProfile, isLoading } = useMutation<any, Error, UpdateProfilePayload>({
    mutationFn(payload: UpdateProfilePayload) {
      return authResponseWrapper(apiClient.updateMyProfile, [payload]);
    },
    ...options,
  });

  return {
    isLoading,
    updateProfile,
  };
};
