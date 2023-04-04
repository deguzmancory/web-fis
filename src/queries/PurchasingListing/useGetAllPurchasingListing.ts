import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { API_QUERIES } from '../keys';
import {
  ApiResponseType,
  GetPropertiesParams,
  PaginationResponseType,
  responseWrapper,
} from './../helpers';
import { PurchaseOrderItem } from './types';

export function useGetAllPurchasingList(
  options?: UseQueryOptions<
    ApiResponseType<PaginationResponseType<PurchaseOrderItem>>,
    Error,
    PaginationResponseType<PurchaseOrderItem>
  >
) {
  const [params, setParams] = useState<GetPropertiesParams>({});

  const {
    data: allPurchasingResponse,
    error,
    isFetching,
    refetch: onGetPurchasing,
  } = useQuery<
    ApiResponseType<PaginationResponseType<PurchaseOrderItem>>,
    Error,
    PaginationResponseType<PurchaseOrderItem>
  >([API_QUERIES.GET_PURCHASE_ORDERS, params], {
    queryFn: (query) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...params] = query.queryKey;
      return responseWrapper<ApiResponseType<PaginationResponseType<PurchaseOrderItem>>>(
        apiClient.getAppPurchasingList,
        params
      );
    },
    notifyOnChangeProps: ['data', 'isFetching'],
    keepPreviousData: true,
    enabled: !isEmpty(params),
    ...options,
  });

  const queryClient = useQueryClient();

  const handleInvalidateAllPurchases = () =>
    queryClient.invalidateQueries(API_QUERIES.GET_PURCHASE_ORDERS);

  const { data: purchases, hasNext, payloadSize, totalRecords } = allPurchasingResponse || {};

  return {
    purchases,
    hasNext,
    payloadSize,
    totalRecords,
    error,
    isFetching,
    setParams,
    onGetPurchasing,
    handleInvalidateAllPurchases,
  };
}
