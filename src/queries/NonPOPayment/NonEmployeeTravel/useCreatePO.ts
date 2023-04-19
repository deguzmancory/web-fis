import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, responseWrapper } from 'src/queries/helpers';
import { NonEmployeeTravelDetailResponse, UpsertNonEmployeeTravelPayload } from './types';

export function useCreateNonEmployeeTravel(
  options?: UseMutationOptions<
    ApiResponseType<NonEmployeeTravelDetailResponse>,
    Error,
    UpsertNonEmployeeTravelPayload
  >
) {
  const {
    mutate: createNonEmployeeTravel,
    data,
    isLoading,
    isSuccess,
  } = useMutation<
    ApiResponseType<NonEmployeeTravelDetailResponse>,
    Error,
    UpsertNonEmployeeTravelPayload
  >({
    mutationFn: (payload: UpsertNonEmployeeTravelPayload) =>
      responseWrapper(apiClient.createNonEmployeeTravel, [payload]),
    ...options,
  });

  return {
    createNonEmployeeTravel,
    data,
    isLoading,
    isSuccess,
  };
}
