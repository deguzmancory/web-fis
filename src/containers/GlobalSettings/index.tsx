import { Box, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import { COLOR_CODE } from 'src/appConfig/constants';
import { Accordion, Button, Input, Loading } from 'src/components/common';
import Refetch from 'src/components/Refetch';
import { useGlobalSettings } from 'src/queries';
import { isCU } from 'src/queries/Profile/helpers';
import { IRootState } from 'src/redux/store';
import { Toastify } from 'src/services';
import BreadcrumbsGlobalSettings from './breadcrumbs';
import { getFormatGlobalSettingsResponse, GlobalSettingFormatted } from './helpers';
import './styles.scss';

const NoPermission = React.lazy(() => import('src/components/NoPermission'));

const GlobalSettings: React.FC<Props> = ({ userCurrentRole }) => {
  const {
    getAllGlobalSettings,
    globalSettings,
    loading: isLoadingGlobalSettings,
    isError: isErrorGlobalSettings,
  } = useGlobalSettings();

  React.useEffect(() => {
    if (!globalSettings) {
      getAllGlobalSettings();
    } else {
      setSettings(getFormatGlobalSettingsResponse(globalSettings));
    }
  }, [getAllGlobalSettings, globalSettings]);

  const [settings, setSettings] = React.useState<GlobalSettingFormatted[]>([]);

  const loading = React.useMemo(() => {
    return isLoadingGlobalSettings;
  }, [isLoadingGlobalSettings]);

  const isError = React.useMemo(() => {
    return isErrorGlobalSettings;
  }, [isErrorGlobalSettings]);

  if (!isCU(userCurrentRole)) return <NoPermission />;
  return (
    <Box py={4} minHeight={'60vh'}>
      <Container maxWidth="md">
        <BreadcrumbsGlobalSettings />
        <Typography variant="h2" mt={2}>
          RCUH Application-Wide Global Settings
        </Typography>

        {isError ? (
          <Box p={4} m={4} bgcolor={COLOR_CODE.WHITE}>
            <Refetch
              isLoading={loading}
              onClick={() => {
                getAllGlobalSettings();
              }}
            />
          </Box>
        ) : !globalSettings ? (
          <Box p={4} m={4} bgcolor={COLOR_CODE.WHITE}>
            <Loading variant="primary" />
          </Box>
        ) : (
          <></>
        )}

        {globalSettings && (
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
              {settings.map((setting, index) => (
                <React.Fragment key={`${setting.title}-${index}`}>
                  {/* Group Title */}
                  <Box px={2} py={1} bgcolor={COLOR_CODE.PRIMARY_200}>
                    <Typography variant="h5">{setting.title}</Typography>
                  </Box>

                  <Box p={3} bgcolor={COLOR_CODE.WHITE}>
                    {setting.items.map((settingItem, settingItemIndex) => (
                      <Box
                        key={`${settingItem.settingId}-${settingItemIndex}`}
                        sx={{
                          '&:not(:last-child)': {
                            mb: 2,
                          },
                        }}
                      >
                        <Grid container spacing={0}>
                          <Grid item xs={4}>
                            <Typography variant="body1">{settingItem.settingName}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            {/* TODO: tin_pham return component input depend of settingItem.settingType */}
                            <Input value={settingItem.settingValue} disabled />
                          </Grid>
                          <Grid item xs={4}>
                            <Box ml={3}>
                              <Button
                                onClick={() => {
                                  Toastify.info(
                                    `${settingItem.settingName} (id: ${settingItem.settingId}) clicked`
                                  );
                                }}
                              >
                                Edit
                              </Button>
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

        <Box>
          <Accordion title={`Raw data settings`} className="mb-16">
            {settings && <ReactJson src={settings} />}
          </Accordion>
          <Accordion title={`Raw data globalSettings`}>
            {globalSettings && <ReactJson src={globalSettings} />}
          </Accordion>
        </Box>
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: IRootState) => ({
  userCurrentRole: state.auth.user.currentRole,
});

export default connect(mapStateToProps, undefined)(GlobalSettings);
