import { Box, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { COLOR_CODE } from 'src/appConfig/constants';
import { Button, Input, InputMask, Loading } from 'src/components/common';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import { useGlobalSettings, useUpdateGlobalSetting } from 'src/queries';
import { isCU } from 'src/queries/Profile/helpers';
import { IRootState } from 'src/redux/store';
import { Toastify } from 'src/services';
import { handleShowErrorMsg } from 'src/utils';
import BreadcrumbsGlobalSettings from './breadcrumbs';
import ErrorWrapperGlobalSettings from './error';
import {
  getFormatGlobalSettingsResponse,
  GlobalSettingFormatted,
  updateSettingValue,
} from './helpers';
import './styles.scss';

const NoPermission = React.lazy(() => import('src/components/NoPermission'));

const GlobalSettings: React.FC<Props> = ({ userCurrentRole }) => {
  const {
    getAllGlobalSettings,
    globalSettings,
    loading: isLoadingGlobalSettings,
  } = useGlobalSettings({
    suspense: true,
  });

  React.useEffect(() => {
    if (globalSettings) {
      setSettings(getFormatGlobalSettingsResponse(globalSettings));
    }
  }, [getAllGlobalSettings, globalSettings]);

  const [settings, setSettings] = React.useState<GlobalSettingFormatted[]>([]);

  const handleEditButton = React.useCallback(
    (groupIndex: number, itemIndex: number, settingValue: string) => {
      setSettings((prevSettings) => {
        return updateSettingValue({
          currentSetting: prevSettings,
          groupIndex,
          itemIndex,
          properties: {
            isEdit: true,
            tempSettingValue: settingValue,
          },
        });
      });
    },
    []
  );

  const handleCancelButton = React.useCallback((groupIndex: number, itemIndex: number) => {
    setSettings((prevSettings) => {
      return updateSettingValue({
        currentSetting: prevSettings,
        groupIndex,
        itemIndex,
        properties: {
          isEdit: false,
          tempSettingValue: null,
        },
      });
    });
  }, []);

  const handleOnChangeValue = (groupIndex: number, itemIndex: number, value: string) => {
    setSettings((prevSettings) => {
      return updateSettingValue({
        currentSetting: prevSettings,
        groupIndex,
        itemIndex,
        properties: {
          tempSettingValue: value,
        },
      });
    });
  };

  const { updateGlobalSetting, isLoading: isLoadingUpdateGlobalSetting } = useUpdateGlobalSetting({
    onSuccess(data, variables, context) {
      Toastify.success(`Update ${variables.settingName} successfully.`);
      setSettings((prevSettings) => {
        return updateSettingValue({
          currentSetting: prevSettings,
          groupIndex: variables.groupIndex,
          itemIndex: variables.itemIndex,
          properties: {
            settingValue: variables.value,
            isEdit: false,
            tempSettingValue: null,
          },
        });
      });
    },
    onError(error, variables, context) {
      handleShowErrorMsg(error);
    },
  });
  const handleSaveButton = ({ groupIndex, itemIndex, settingId, settingName }) => {
    // eslint-disable-next-line security/detect-object-injection
    const tempSettingValue = settings[groupIndex].items[itemIndex]?.tempSettingValue;
    if (tempSettingValue && Number(tempSettingValue) < 1) {
      return Toastify.error('Please input positive number');
    } else if (tempSettingValue) {
      return updateGlobalSetting({
        settingId,
        settingName,
        value: tempSettingValue,
        groupIndex,
        itemIndex,
      });
    } else {
      return Toastify.error('Error when update setting, please try again.');
    }
  };

  const loading = React.useMemo(() => {
    return isLoadingGlobalSettings || isLoadingUpdateGlobalSetting;
  }, [isLoadingGlobalSettings, isLoadingUpdateGlobalSetting]);

  if (!isCU(userCurrentRole)) return <NoPermission />;
  return (
    <Box py={4} minHeight={'60vh'}>
      <Container maxWidth="md">
        <BreadcrumbsGlobalSettings />
        <Typography variant="h2" mt={2}>
          RCUH Application-Wide Global Settings
        </Typography>

        {!globalSettings ? (
          <Box p={4} m={4} bgcolor={COLOR_CODE.WHITE}>
            <Loading variant="primary" />
          </Box>
        ) : (
          <Box my={2}>
            {/* Title */}
            <Box px={2} py={1} bgcolor={COLOR_CODE.PRIMARY_500}>
              <Grid container spacing={0}>
                <Grid item xs={4}>
                  <Typography variant="h5" color={COLOR_CODE.WHITE}>
                    Setting Name
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    variant="h5"
                    color={COLOR_CODE.WHITE}
                    sx={{
                      fontSize: 14,
                    }}
                  >
                    Setting Value
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            {/* End Title */}

            {/* Group */}
            <Box>
              {settings.map((setting, groupIndex) => (
                <React.Fragment key={`${setting.title}-${groupIndex}`}>
                  {/* Group Title */}
                  <Box px={2} py={1} bgcolor={COLOR_CODE.PRIMARY_200}>
                    <Typography variant="h5">{setting.title}</Typography>
                  </Box>

                  {/* Group Items */}
                  <Box p={3} bgcolor={COLOR_CODE.WHITE}>
                    {setting.items.map((settingItem, itemIndex) => (
                      <Box
                        key={`${settingItem.settingId}-${itemIndex}`}
                        sx={{
                          '&:not(:last-child)': {
                            mb: 2,
                          },
                        }}
                      >
                        {/* Group Item */}
                        <Grid container spacing={0}>
                          <Grid item xs={4} sx={{ my: 'auto' }}>
                            <Typography variant="body1">{settingItem.settingName}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            {settingItem?.isEdit ? (
                              <InputMask
                                value={settingItem?.tempSettingValue || ''}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                  const value = event.target.value;
                                  handleOnChangeValue(groupIndex, itemIndex, value);
                                }}
                                min={1}
                                mask={'9999'}
                                disabled={!settingItem?.isEdit}
                              />
                            ) : (
                              <Input value={settingItem.settingValue} disabled />
                            )}
                          </Grid>
                          <Grid item xs={4}>
                            <Box ml={3}>
                              {settingItem?.isEdit ? (
                                <>
                                  <Button
                                    onClick={() => {
                                      handleSaveButton({
                                        groupIndex,
                                        itemIndex,
                                        settingId: settingItem.settingId,
                                        settingName: settingItem.settingName,
                                      });
                                    }}
                                    isLoading={loading}
                                    disabled={loading}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    className="ml-16"
                                    variant="outline"
                                    onClick={() => {
                                      handleCancelButton(groupIndex, itemIndex);
                                    }}
                                    isLoading={loading}
                                    disabled={loading}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  onClick={() => {
                                    handleEditButton(
                                      groupIndex,
                                      itemIndex,
                                      settingItem.settingValue
                                    );
                                  }}
                                  isLoading={loading}
                                  disabled={loading}
                                >
                                  Edit
                                </Button>
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Box>
                </React.Fragment>
              ))}
            </Box>

            {/* End Group */}
          </Box>
        )}
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: IRootState) => ({
  userCurrentRole: state.auth.currentRole,
});

const ConnectGlobalSettings = connect(mapStateToProps, undefined)(GlobalSettings);

const ErrorBoundaryGlobalSettings = () => {
  return (
    <CustomErrorBoundary showErrorMessage fallback={<ErrorWrapperGlobalSettings />}>
      <ConnectGlobalSettings />
    </CustomErrorBoundary>
  );
};

export default ErrorBoundaryGlobalSettings;
