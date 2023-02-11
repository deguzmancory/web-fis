import { QueryFunction, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, getResponseData, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { MyProfile } from './types';

export function useProfile(
  options?: UseQueryOptions<ApiResponseType<MyProfile>, Error, MyProfile>
) {
  const handleGetProfile: QueryFunction<ApiResponseType<MyProfile>, API_QUERIES> = () =>
    responseWrapper<ApiResponseType<MyProfile>>(apiClient.getMyProfile);

  const {
    data,
    error,
    isError,
    isFetching,
    refetch: getMyProfile,
  } = useQuery<ApiResponseType<MyProfile>, Error, MyProfile>([API_QUERIES.PROFILE], {
    queryFn: handleGetProfile,
    refetchOnMount: false,
    select: getResponseData,
    enabled: true,
    notifyOnChangeProps: ['data', 'isFetching'],
    ...options,
  });

  const queryClient = useQueryClient();

  const handleInvalidateProfile = () => queryClient.invalidateQueries([API_QUERIES.PROFILE]);

  return {
    profile: data,
    error,
    isError,
    loading: isFetching,
    getMyProfile,
    handleInvalidateProfile,
  };
}
