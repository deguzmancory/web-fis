import { useQuery, UseQueryOptions } from 'react-query';
import { isEmpty } from 'src/validations';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { GetSearchFinancialProjectsParams, SearchFinancialProject } from './types';

export function useSearchFinancialProjects(
  options?: UseQueryOptions<
    ApiResponseType<{ projects: SearchFinancialProject[] }>,
    Error,
    SearchFinancialProject[]
  > &
    GetSearchFinancialProjectsParams
) {
  const {
    data: financialProjects,
    error,
    isError,
    isFetching: isLoading,
    refetch: onSearchFinancialProjects,
  } = useQuery<
    ApiResponseType<{ projects: SearchFinancialProject[] }>,
    Error,
    SearchFinancialProject[]
  >(
    [
      API_QUERIES.SEARCH_FINANCIAL_PROJECTS,
      {
        search: options.search,
        roleType: options.roleType,
        excludeCode: options.excludeCode,
        excludeProject: options.excludeProject,
      },
    ],
    {
      queryFn: (query) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...params] = query.queryKey;
        return responseWrapper<ApiResponseType<{ projects: SearchFinancialProject[] }>>(
          apiClient.searchFinancialProjects,
          params
        );
      },
      select(data) {
        return data.data.projects;
      },
      enabled: !isEmpty(options.search),
      ...options,
    }
  );

  return {
    financialProjects,
    error,
    isError,
    isLoading,
    onSearchFinancialProjects,
  };
}
