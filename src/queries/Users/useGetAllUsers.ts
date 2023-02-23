import { useState } from 'react';
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { isEmpty } from 'src/validations';
import apiClient from '../apiClient';
import { ApiResponseType, PaginationResponseType, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { GetPropertiesParams, User } from './types';

export function useGetAllUsers(
  options?: UseQueryOptions<
    ApiResponseType<PaginationResponseType<User>>,
    Error,
    PaginationResponseType<User>
  >
) {
  const [params, setParams] = useState<GetPropertiesParams>({});
  const {
    data: allUsersResponse,
    error,
    isError,
    isFetching,
    refetch: onGetAllUsers,
  } = useQuery<ApiResponseType<PaginationResponseType<User>>, Error, PaginationResponseType<User>>(
    [API_QUERIES.USERS, params],
    {
      queryFn: (query) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...params] = query.queryKey;
        return responseWrapper<ApiResponseType<PaginationResponseType<User>>>(
          apiClient.getAllUsers,
          params
        );
      },
      notifyOnChangeProps: ['data', 'isFetching'],
      keepPreviousData: true,
      enabled: !isEmpty(params),
      ...options,
    }
  );

  const queryClient = useQueryClient();

  const handleInvalidateAllUser = () => queryClient.invalidateQueries(API_QUERIES.USERS);

  const { data: users, hasNext, payloadSize, totalRecords } = allUsersResponse || {};

  return {
    users,
    hasNext,
    payloadSize,
    totalRecords,
    error,
    isError,
    isFetching,
    onGetAllUsers,
    setParams,
    handleInvalidateAllUser,
  };
}
