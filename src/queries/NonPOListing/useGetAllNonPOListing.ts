import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import {
  ApiResponseType,
  GetPropertiesParams,
  PaginationResponseType,
  responseWrapper,
} from '../helpers';
import { API_QUERIES } from '../keys';
import { NonPOListingItem } from './types';

export function useGetAllNonPOListing(
  options?: UseQueryOptions<
    ApiResponseType<PaginationResponseType<NonPOListingItem>>,
    Error,
    PaginationResponseType<NonPOListingItem>
  >
) {
  const [params, setParams] = useState<GetPropertiesParams>({});

  const {
    data: allNonPOListingResponse,
    error,
    isFetching,
    refetch: onGetNonPOListing,
  } = useQuery<
    ApiResponseType<PaginationResponseType<NonPOListingItem>>,
    Error,
    PaginationResponseType<NonPOListingItem>
  >([API_QUERIES.NON_PO_LISTING, params], {
    queryFn: (query) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...params] = query.queryKey;
      return responseWrapper<ApiResponseType<PaginationResponseType<NonPOListingItem>>>(
        apiClient.getNonPOListing,
        params
      );
    },
    notifyOnChangeProps: ['data', 'isFetching'],
    keepPreviousData: true,
    enabled: !isEmpty(params),
    ...options,
  });

  const queryClient = useQueryClient();

  const handleInvalidateAllNonPOListing = () =>
    queryClient.invalidateQueries(API_QUERIES.NON_PO_LISTING);

  const { data: nonPOListing, hasNext, payloadSize, totalRecords } = allNonPOListingResponse || {};

  return {
    nonPOListing,
    hasNext,
    payloadSize,
    totalRecords,
    error,
    isFetching,
    setParams,
    onGetNonPOListing,
    handleInvalidateAllNonPOListing,
  };
}
