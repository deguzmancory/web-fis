import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, getResponseData, responseWrapper } from 'src/queries/helpers';
import { API_QUERIES } from 'src/queries/keys';
import { NonEmployeeTravelDetailResponse } from './types';

export function useGetNonEmployeeTravelDetail(
  options?: UseQueryOptions<
    ApiResponseType<NonEmployeeTravelDetailResponse>,
    Error,
    NonEmployeeTravelDetailResponse
  > & {
    id: string;
  }
) {
  const {
    data: poDetail,
    error,
    isError,
    isFetching: isLoading,
    refetch: onGetNonEmployeeTravelById,
  } = useQuery<
    ApiResponseType<NonEmployeeTravelDetailResponse>,
    Error,
    NonEmployeeTravelDetailResponse
  >([API_QUERIES.NON_EMPLOYEE_TRAVEL_DETAIL, { id: options.id }], {
    queryFn: (query) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...params] = query.queryKey;
      return responseWrapper<ApiResponseType<NonEmployeeTravelDetailResponse>>(
        apiClient.getNonEmployeeTravelDetail,
        params
      );
    },
    select: getResponseData,
    enabled: false,
    ...options,
  });

  const queryClient = useQueryClient();
  const handleInvalidateNonEmployeeTravelDetail = () =>
    queryClient.invalidateQueries(API_QUERIES.NON_EMPLOYEE_TRAVEL_DETAIL);

  return {
    poDetail,
    error,
    isError,
    isLoading,
    onGetNonEmployeeTravelById,
    handleInvalidateNonEmployeeTravelDetail,
  };
}
