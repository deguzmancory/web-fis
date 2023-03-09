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
import { VendorList } from './types';

export function useGetAllVendors(
  options?: UseQueryOptions<
    ApiResponseType<PaginationResponseType<VendorList>>,
    Error,
    PaginationResponseType<VendorList>
  >
) {
  const [params, setParams] = useState<GetPropertiesParams>({});
  const {
    data: allVendorsResponse,
    error,
    isError,
    isFetching,
    refetch: onGetAllVendors,
  } = useQuery<
    ApiResponseType<PaginationResponseType<VendorList>>,
    Error,
    PaginationResponseType<VendorList>
  >([API_QUERIES.VENDORS, params], {
    queryFn: (query) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...params] = query.queryKey;
      return responseWrapper<ApiResponseType<PaginationResponseType<VendorList>>>(
        apiClient.getAllVendors,
        params
      );
    },
    notifyOnChangeProps: ['data', 'isFetching'],
    keepPreviousData: true,
    enabled: !isEmpty(params),
    ...options,
  });

  const queryClient = useQueryClient();

  const handleInvalidateAllVendors = () => queryClient.invalidateQueries(API_QUERIES.VENDORS);

  const { data: vendors, hasNext, payloadSize, totalRecords } = allVendorsResponse || {};

  return {
    vendors,
    hasNext,
    payloadSize,
    totalRecords,
    error,
    isError,
    isFetching,
    onGetAllVendors,
    setParams,
    handleInvalidateAllVendors,
  };
}
