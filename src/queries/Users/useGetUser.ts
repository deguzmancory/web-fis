import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { User, UserDetail } from './types';

export function useGetUser(
  options?: UseQueryOptions<ApiResponseType<{ user: UserDetail }>, Error, UserDetail> & {
    userId: User['id'];
  }
) {
  const {
    data: user,
    error,
    isError,
    isFetching: isLoading,
    refetch: onGetUserById,
  } = useQuery<ApiResponseType<{ user: UserDetail }>, Error, UserDetail>(
    [API_QUERIES.USER, { id: options.userId }],
    {
      queryFn: (query) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...params] = query.queryKey;
        return responseWrapper<ApiResponseType<{ user: UserDetail }>>(apiClient.getUser, params);
      },
      select(data) {
        return data.data.user;
      },
      enabled: !!options.userId,
      ...options,
    }
  );

  const queryClient = useQueryClient();
  const handleInvalidateUser = () => queryClient.invalidateQueries(API_QUERIES.USER);

  return {
    user,
    error,
    isError,
    isLoading,
    onGetUserById,
    handleInvalidateUser,
  };
}
