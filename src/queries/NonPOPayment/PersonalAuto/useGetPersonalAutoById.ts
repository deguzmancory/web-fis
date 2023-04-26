import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, getResponseData, responseWrapper } from 'src/queries/helpers';
import { API_QUERIES } from 'src/queries/keys';
import { PersonalAutomobileResponse } from './types';

export function useGetPersonalAutomobileById(
  options?: UseQueryOptions<
    ApiResponseType<PersonalAutomobileResponse>,
    Error,
    PersonalAutomobileResponse
  > & {
    id: string;
  }
) {
  const {
    data: personalAutomobileDetail,
    error,
    isError,
    isFetching: isLoading,
    refetch: onGetPersonalAutoById,
  } = useQuery<ApiResponseType<PersonalAutomobileResponse>, Error, PersonalAutomobileResponse>(
    [API_QUERIES.PERSONAL_AUTOMOBILE_DETAIL, { id: options.id }],
    {
      queryFn: (query) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...params] = query.queryKey;
        return responseWrapper<ApiResponseType<PersonalAutomobileResponse>>(
          apiClient.getPersonalAutoById,
          params
        );
      },
      select: getResponseData,
      enabled: false,
      ...options,
    }
  );

  const queryClient = useQueryClient();
  const handleInvalidatePersonalAutomobileDetail = () =>
    queryClient.invalidateQueries(API_QUERIES.PERSONAL_AUTOMOBILE_DETAIL);

  return {
    personalAutomobileDetail,
    error,
    isError,
    isLoading,
    onGetPersonalAutoById,
    handleInvalidatePersonalAutomobileDetail,
  };
}
