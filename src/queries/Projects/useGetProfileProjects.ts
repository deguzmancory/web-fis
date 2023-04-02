import { useState } from 'react';
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { isEmpty } from 'src/validations';
import apiClient from '../apiClient';
import {
  ApiResponseType,
  GetPropertiesParams,
  PaginationResponseType,
  responseWrapper,
} from '../helpers';
import { API_QUERIES } from '../keys';
import { FinancialProject } from './types';

export interface GetProfileProjectsParams extends GetPropertiesParams {
  search?: string;
  searchName?: string;
  searchNumber?: string;
  includeTerminated?: boolean;
  includeInactive?: boolean;
}

export function useGetProfileProjects(
  options?: UseQueryOptions<
    ApiResponseType<PaginationResponseType<FinancialProject>>,
    Error,
    PaginationResponseType<FinancialProject>
  >
) {
  const [params, setParams] = useState<GetProfileProjectsParams>(null);
  const {
    data: allProfileProjectsResponse,
    error,
    isError,
    isFetching: isLoading,
    refetch: onGetAllProfileProjects,
  } = useQuery<
    ApiResponseType<PaginationResponseType<FinancialProject>>,
    Error,
    PaginationResponseType<FinancialProject>
  >([API_QUERIES.SEARCH_PROFILE_PROJECTS, params], {
    queryFn: (query) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...params] = query.queryKey;
      return responseWrapper<ApiResponseType<PaginationResponseType<FinancialProject>>>(
        apiClient.getProfileProjects,
        params
      );
    },
    notifyOnChangeProps: ['data', 'isFetching'],
    keepPreviousData: true,
    enabled: !isEmpty(params),
    ...options,
  });

  const queryClient = useQueryClient();

  const handleInvalidateAllProfileProjects = () =>
    queryClient.invalidateQueries(API_QUERIES.SEARCH_PROFILE_PROJECTS);

  const {
    data: profileProjects,
    hasNext,
    payloadSize,
    totalRecords,
  } = allProfileProjectsResponse || {};

  return {
    profileProjects,
    hasNext,
    payloadSize,
    totalRecords,
    error,
    isError,
    isLoading,
    currentParams: params,
    onGetAllProfileProjects,
    setParams,
    handleInvalidateAllProfileProjects,
  };
}
