import React from 'react';
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { isEmpty } from 'src/validations';
import apiClient from '../apiClient';
import { ApiResponseType, getResponseData, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { SearchVendorsParams, Vendor } from './types';

export const useSearchVendors = (
  options?: UseQueryOptions<ApiResponseType<Vendor[]>, Error, Vendor[]>
) => {
  const [searchVendorParams, setSearchVendorParams] = React.useState<SearchVendorsParams>(null);
  const {
    data: vendors,
    error,
    isError,
    isFetching: isLoading,
    refetch: onSearchVendors,
  } = useQuery<ApiResponseType<Vendor[]>, Error, Vendor[]>(
    [API_QUERIES.SEARCH_VENDOR, searchVendorParams],
    {
      queryFn: (query) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...params] = query.queryKey;
        return responseWrapper<ApiResponseType<Vendor[]>>(apiClient.searchVendors, params);
      },
      select: getResponseData,
      enabled: !isEmpty(searchVendorParams),
      ...options,
    }
  );

  const queryClient = useQueryClient();
  const handleInvalidateSearchVendors = () =>
    queryClient.invalidateQueries(API_QUERIES.SEARCH_VENDOR);

  return {
    vendors,
    error,
    isError,
    isLoading,
    onSearchVendors,
    setSearchVendorParams,
    handleInvalidateSearchVendors,
  };
};
