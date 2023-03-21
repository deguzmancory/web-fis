import React from 'react';
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { isEmpty } from 'src/validations';
import apiClient from '../apiClient';
import { ApiResponseType, getResponseData, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { SearchQuoteParams, SuperQuote } from './types';

export const useSearchSuperQuotes = (
  options?: UseQueryOptions<ApiResponseType<SuperQuote[]>, Error, SuperQuote[]>
) => {
  const [searchQuoteParams, setSearchSuperQuoteParams] = React.useState<SearchQuoteParams>(null);
  const {
    data: superQuotes,
    error,
    isError,
    isSuccess,
    isFetching: isLoading,
    refetch: onSearchSuperQuotes,
  } = useQuery<ApiResponseType<SuperQuote[]>, Error, SuperQuote[]>(
    [API_QUERIES.SEARCH_QUOTE, searchQuoteParams],
    {
      queryFn: (query) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...params] = query.queryKey;
        return responseWrapper<ApiResponseType<SuperQuote[]>>(apiClient.searchSuperQuotes, params);
      },
      select: getResponseData,
      enabled: !isEmpty(searchQuoteParams),
      ...options,
    }
  );

  const queryClient = useQueryClient();
  const handleInvalidateSearchSuperQuotes = () =>
    queryClient.invalidateQueries(API_QUERIES.SEARCH_QUOTE);

  return {
    superQuotes,
    error,
    isError,
    isLoading,
    isSuccess,
    onSearchSuperQuotes,
    setSearchSuperQuoteParams,
    handleInvalidateSearchSuperQuotes,
  };
};
