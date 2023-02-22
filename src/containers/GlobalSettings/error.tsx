import { Box, Container } from '@mui/material';
import { COLOR_CODE } from 'src/appConfig/constants';
import Refetch from 'src/components/Refetch';
import { useGlobalSettings } from 'src/queries';
import { handleShowErrorMsg } from 'src/utils';
import BreadcrumbsGlobalSettings from './breadcrumbs';

const ErrorWrapperGlobalSettings = () => {
  const { getAllGlobalSettings, loading } = useGlobalSettings({
    onError(err) {
      handleShowErrorMsg(err);
    },
  });
  return (
    <Box py={4}>
      <Container>
        <BreadcrumbsGlobalSettings />
        <Box p={4} m={4} bgcolor={COLOR_CODE.WHITE}>
          <Refetch
            title="Fail to GET global settings, please try to refetch"
            isLoading={loading}
            onClick={() => {
              getAllGlobalSettings();
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ErrorWrapperGlobalSettings;
