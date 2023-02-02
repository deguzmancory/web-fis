import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { authResponseWrapper } from '../helpers';
import { UpdateCurrentRoleProfilePayload } from './types';
export function useUpdateCurrentRoleProfile(
  options?: UseMutationOptions<any, Error, UpdateCurrentRoleProfilePayload>
) {
  const { mutate: updateCurrentRoleMyProfile, isLoading } = useMutation<
    any,
    Error,
    UpdateCurrentRoleProfilePayload
  >({
    mutationFn: (payload: { roleName: string }) => {
      return authResponseWrapper(apiClient.updateCurrentRoleMyProfile, [payload]);
    },
    ...options,
  });

  return {
    updateCurrentRoleMyProfile,
    isLoading,
  };
}
