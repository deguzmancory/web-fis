import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from 'src/queries/apiClient';
import { ApiResponseType, getResponseData, responseWrapper } from 'src/queries/helpers';
import { API_QUERIES } from 'src/queries/keys';
import { PettyCashDetailResponse } from './types';

export function useGetPettyCashDetail(
  options?: UseQueryOptions<
    ApiResponseType<PettyCashDetailResponse>,
    Error,
    PettyCashDetailResponse
  > & {
    id: string;
  }
) {
  const {
    data: poDetail,
    error,
    isError,
    isFetching: isLoading,
    refetch: onGetPettyCashById,
  } = useQuery<ApiResponseType<PettyCashDetailResponse>, Error, PettyCashDetailResponse>(
    [API_QUERIES.PETTY_CASH_DETAIL, { id: options.id }],
    {
      queryFn: (query) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...params] = query.queryKey;
        return responseWrapper<ApiResponseType<PettyCashDetailResponse>>(
          apiClient.getPettyCashDetail,
          params
        );
      },
      select: getResponseData,
      enabled: false,
      ...options,
    }
  );

  const queryClient = useQueryClient();
  const handleInvalidatePettyCashDetail = () =>
    queryClient.invalidateQueries(API_QUERIES.PETTY_CASH_DETAIL);

  return {
    poDetail,
    error,
    isError,
    isLoading,
    onGetPettyCashById,
    handleInvalidatePettyCashDetail,
  };
}
