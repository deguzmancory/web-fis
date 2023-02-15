import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';
import { CityStateFromZipCode } from './types';

export function useZipCode(options?: UseMutationOptions<CityStateFromZipCode, Error, string>) {
  const {
    mutate: checkZipCode,
    isLoading,
    isSuccess,
  } = useMutation<CityStateFromZipCode, Error, string>({
    mutationFn: (payload: string) =>
      responseWrapper<CityStateFromZipCode>(apiClient.getCityStateByZipCode, [payload]),
    ...options,
  });

  return {
    checkZipCode,
    isLoading,
    isSuccess,
  };
}
