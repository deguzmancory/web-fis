import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, responseWrapper } from 'src/queries/helpers';
import { NonEmployeeTravelDetailResponse, UpsertNonEmployeeTravelPayload } from './types';

export function useUpdateNonEmployeeTravel(
  options?: UseMutationOptions<
    ApiResponseType<NonEmployeeTravelDetailResponse>,
    Error,
    UpsertNonEmployeeTravelPayload
  >
) {
  const {
    mutate: updateNonEmployeeTravel,
    data,
    isLoading,
    isSuccess,
  } = useMutation<
    ApiResponseType<NonEmployeeTravelDetailResponse>,
    Error,
    UpsertNonEmployeeTravelPayload
  >({
    mutationFn: (payload: UpsertNonEmployeeTravelPayload) =>
      responseWrapper(apiClient.updateNonEmployeeTravel, [payload]),
    ...options,
  });

  return {
    updateNonEmployeeTravel,
    data,
    isLoading,
    isSuccess,
  };
}
