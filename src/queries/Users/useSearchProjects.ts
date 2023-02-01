import { useQuery, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { SearchProject } from './types';

export function useSearchProjects(
  options?: UseQueryOptions<ApiResponseType<{ data: SearchProject[] }>, Error, SearchProject[]> & {
    projectNumber: string;
  }
) {
  const {
    data: projects,
    error,
    isError,
    isFetching: isLoading,
    refetch: onSearchProjects,
  } = useQuery<ApiResponseType<{ data: SearchProject[] }>, Error, SearchProject[]>(
    [API_QUERIES.SEARCH_PROJECTS, { projectNumber: options.projectNumber }],
    {
      queryFn: (query) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...params] = query.queryKey;
        return responseWrapper<ApiResponseType<{ data: SearchProject[] }>>(
          apiClient.searchProjects,
          params
        );
      },
      select(data) {
        return data.data.data;
      },
      enabled: !!options.projectNumber,
      ...options,
    }
  );

  return {
    projects,
    error,
    isError,
    isLoading,
    onSearchProjects,
  };
}
