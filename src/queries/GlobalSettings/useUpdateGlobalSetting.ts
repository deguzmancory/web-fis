import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { authResponseWrapper } from '../helpers';
import { UpdateGlobalSettingPayload } from './types';

export function useUpdateGlobalSetting(
  options?: UseMutationOptions<any, Error, UpdateGlobalSettingPayload>
) {
  const { mutate: updateGlobalSetting, isLoading } = useMutation<
    any,
    Error,
    UpdateGlobalSettingPayload
  >({
    mutationFn: (payload: UpdateGlobalSettingPayload) =>
      authResponseWrapper(apiClient.updateGlobalSetting, [payload]),
    ...options,
  });

  return {
    updateGlobalSetting,
    isLoading,
  };
}
