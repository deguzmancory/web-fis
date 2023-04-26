import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, responseWrapper } from 'src/queries/helpers';
import { PersonalAutomobilePayload, PersonalAutomobileResponse } from './types';

export function useUpdatePersonalAutomobile(
  options?: UseMutationOptions<
    ApiResponseType<PersonalAutomobileResponse>,
    Error,
    PersonalAutomobilePayload
  >
) {
  const {
    mutate: updatePersonalAutomobile,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<PersonalAutomobileResponse>, Error, PersonalAutomobilePayload>({
    mutationFn: (payload: PersonalAutomobilePayload) =>
      responseWrapper(apiClient.updatePersonalAutomobile, [payload]),
    ...options,
  });

  return {
    updatePersonalAutomobile,
    data,
    isLoading,
    isSuccess,
  };
}
