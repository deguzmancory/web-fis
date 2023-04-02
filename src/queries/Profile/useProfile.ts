import { QueryFunction, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { GetMyProfileResponse } from './types';

export function useProfile(
  options?: UseQueryOptions<ApiResponseType<GetMyProfileResponse>, Error, GetMyProfileResponse>
) {
  const handleGetProfile: QueryFunction<ApiResponseType<GetMyProfileResponse>, API_QUERIES> = () =>
    responseWrapper<ApiResponseType<GetMyProfileResponse>>(apiClient.getMyProfile);

  const {
    data,
    error,
    isError,
    isFetching,
    refetch: getMyProfile,
  } = useQuery<ApiResponseType<GetMyProfileResponse>, Error, GetMyProfileResponse>(
    [API_QUERIES.PROFILE],
    {
      queryFn: handleGetProfile,
      refetchOnMount: false,
      select: (data) => data.data,
      enabled: false,
      notifyOnChangeProps: ['data', 'isFetching'],
      ...options,
    }
  );

  const queryClient = useQueryClient();

  const handleInvalidateProfile = () => queryClient.invalidateQueries([API_QUERIES.PROFILE]);

  return {
    mainProfile: data?.data,
    profile: data?.delegateUser ?? data?.data,
    error,
    isError,
    loading: isFetching,
    getMyProfile,
    handleInvalidateProfile,
  };
}
