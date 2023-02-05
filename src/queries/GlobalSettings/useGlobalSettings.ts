import React from 'react';
import { QueryFunction, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from '../apiClient';
import { ApiResponseType, responseWrapper } from '../helpers';
import { API_QUERIES } from '../keys';
import { GlobalSettings, GLOBAL_SETTING_KEY } from './types';

export function useGlobalSettings(
  options?: UseQueryOptions<ApiResponseType<{ settings: GlobalSettings }>, Error, GlobalSettings>
) {
  const handleGetAllGlobalSettings: QueryFunction<
    ApiResponseType<{ settings: GlobalSettings }>,
    API_QUERIES
  > = () =>
    responseWrapper<ApiResponseType<{ settings: GlobalSettings }>>(apiClient.getAllGlobalSettings);
  const {
    data,
    error,
    isError,
    isFetching,
    refetch: getAllGlobalSettings,
  } = useQuery<ApiResponseType<{ settings: GlobalSettings }>, Error, GlobalSettings>(
    [API_QUERIES.GLOBAL_SETTINGS],
    {
      queryFn: handleGetAllGlobalSettings,
      refetchOnMount: false,
      select(data) {
        return data.data.settings;
      },
      enabled: false,
      notifyOnChangeProps: ['data'],
      ...options,
    }
  );

  const queryClient = useQueryClient();

  const handleInvalidateGlobalSettings = () =>
    queryClient.invalidateQueries([API_QUERIES.GLOBAL_SETTINGS]);

  return {
    globalSettings: React.useMemo(() => {
      if (!data) return null;
      const passwordResetMonths = data.find(
        (setting) => setting.settingName === GLOBAL_SETTING_KEY.PASSWORD_RESET_MONTHS
      );
      const tempPasswordValidHours = data.find(
        (setting) => setting.settingName === GLOBAL_SETTING_KEY.TEMP_PASSWORD_VALID_HOURS
      );
      const response: GlobalSettings = [passwordResetMonths, tempPasswordValidHours];
      return response;
    }, [data]),
    error,
    isError,
    loading: isFetching,
    getAllGlobalSettings,
    handleInvalidateGlobalSettings,
  };
}
