import { Box, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import ReactJson from 'react-json-view';
import { COLOR_CODE } from 'src/appConfig/constants';
import { Accordion } from 'src/components/common';
import Refetch from 'src/components/Refetch';
import { useGlobalSettings } from 'src/queries';

import './styles.scss';

const GlobalSettings: React.FC<Props> = () => {
  const { getAllGlobalSettings, globalSettings, loading: isLoading } = useGlobalSettings();

  React.useEffect(() => {
    if (!globalSettings) {
      getAllGlobalSettings();
    }
  }, [getAllGlobalSettings, globalSettings]);

  const loading = React.useMemo(() => {
    return isLoading;
  }, [isLoading]);

  return (
    <Box py={4} minHeight={'60vh'}>
      <Container maxWidth="lg">
        <Typography variant="h2">Global Settings</Typography>

        <Box my={2} p={4} bgcolor={COLOR_CODE.WHITE} border={COLOR_CODE.DEFAULT_BORDER}>
          {!globalSettings ? (
            <Refetch
              isLoading={loading}
              onClick={() => {
                getAllGlobalSettings();
              }}
            />
          ) : (
            <>
              <Typography variant="h4" mb={1}>
                Users Management
              </Typography>

              <Grid container spacing={2}>
                <>
                  {globalSettings.map((setting, index) => (
                    <React.Fragment key={`${setting.settingName}-${index}`}>
                      <Grid item xs={6}>
                        <Typography>{setting.settingName}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          {setting.settingValue} ({setting.settingType})
                        </Typography>
                      </Grid>
                    </React.Fragment>
                  ))}
                </>
              </Grid>
            </>
          )}
        </Box>

        <Accordion title={`Raw data globalSettings`}>
          {globalSettings && <ReactJson src={globalSettings} />}
        </Accordion>
      </Container>
    </Box>
  );
};

type Props = {};

export default GlobalSettings;
