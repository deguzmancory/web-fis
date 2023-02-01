import { useQuery, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { SearchUser } from './types';

export function useSearchUsers(
  options?: UseQueryOptions<ApiResponseType<{ data: SearchUser[] }>, Error, SearchUser[]> & {
    name: string;
    exclude?: string;
  }
) {
  const {
    data: users,
    error,
    isError,
    isFetching: isLoading,
    refetch: onSearchUsers,
  } = useQuery<ApiResponseType<{ data: SearchUser[] }>, Error, SearchUser[]>(
    [API_QUERIES.SEARCH_USER, { name: options.name, exclude: options.exclude }],
    {
      queryFn: (query) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...params] = query.queryKey;
        return responseWrapper<ApiResponseType<{ data: SearchUser[] }>>(
          apiClient.searchUsers,
          params
        );
      },
      select(data) {
        return data.data.data;
      },
      enabled: !!options.name,
      ...options,
    }
  );

  return {
    users,
    error,
    isError,
    isLoading,
    onSearchUsers,
  };
}
