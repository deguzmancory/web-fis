import { useState } from 'react';
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { isEmpty } from 'src/validations';
import apiClient from '../apiClient';
import { ApiResponseType, PaginationResponseType, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { ROLE_NAME } from '../Profile/helpers';
import { FinancialProject, GetPropertiesParams } from './types';

export interface GetFinancialProjectsParams extends GetPropertiesParams {
  search?: string;
  userType?: ROLE_NAME;
  codes?: string;
  projectNumbers?: string;
  excludeCodes?: string;
  excludeProjects?: string;
}

export function useGetFinancialProjects(
  options?: UseQueryOptions<
    ApiResponseType<PaginationResponseType<FinancialProject>>,
    Error,
    PaginationResponseType<FinancialProject>
  >
) {
  const [params, setParams] = useState<GetFinancialProjectsParams>(null);
  const {
    data: allFinancialProjectsResponse,
    error,
    isError,
    isFetching: isLoading,
    refetch: onGetAllFinancialProjects,
  } = useQuery<
    ApiResponseType<PaginationResponseType<FinancialProject>>,
    Error,
    PaginationResponseType<FinancialProject>
  >([API_QUERIES.GET_FINANCIAL_PROJECTS, params], {
    queryFn: (query) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...params] = query.queryKey;
      return responseWrapper<ApiResponseType<PaginationResponseType<FinancialProject>>>(
        apiClient.getFinancialProjects,
        params
      );
    },
    notifyOnChangeProps: ['data', 'isFetching'],
    keepPreviousData: true,
    enabled: !isEmpty(params),

    ...options,
  });

  const queryClient = useQueryClient();

  const handleInvalidateAllFinancialProjects = () =>
    queryClient.invalidateQueries(API_QUERIES.GET_FINANCIAL_PROJECTS);

  const {
    data: financialProjects,
    hasNext,
    payloadSize,
    totalRecords,
  } = allFinancialProjectsResponse || {};

  return {
    financialProjects,
    hasNext,
    payloadSize,
    totalRecords,
    error,
    isError,
    isLoading,
    currentParams: params,
    onGetAllFinancialProjects,
    setParams,
    handleInvalidateAllFinancialProjects,
  };
}
