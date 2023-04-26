import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, responseWrapper } from 'src/queries/helpers';
import { PersonalAutomobilePayload, PersonalAutomobileResponse } from './types';

export function useCreatePersonalAutomobile(
  options?: UseMutationOptions<
    ApiResponseType<PersonalAutomobileResponse>,
    Error,
    PersonalAutomobilePayload
  >
) {
  const {
    mutate: createPersonalAutomobile,
    data,
    isLoading,
    isSuccess,
  } = useMutation<ApiResponseType<PersonalAutomobileResponse>, Error, PersonalAutomobilePayload>({
    mutationFn: (payload: PersonalAutomobilePayload) =>
      responseWrapper(apiClient.createPersonalAutomobile, [payload]),
    ...options,
  });

  return {
    createPersonalAutomobile,
    data,
    isLoading,
    isSuccess,
  };
}
