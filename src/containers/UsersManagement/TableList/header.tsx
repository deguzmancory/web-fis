import { Add, Refresh } from '@mui/icons-material';
import { Box, Stack } from '@mui/material';
import { PATHS } from 'src/appConfig/paths';
import { Button } from 'src/components/common';
import CustomSearchTable from 'src/components/CustomSearchTable';
import { Callback } from 'src/redux/types';
import { Navigator, PermissionsService } from 'src/services';
import CustomFilterUsersManagement from './CustomFilter';
import DownloadAllUsers from './downloadAllUsers';

const HeaderTable: React.FC<Props> = ({ onRefreshTable, isLoading }) => {
  const canCreatePermission = PermissionsService.user().canCreate;
  return (
    <Box>
      <Stack mb={2} flexDirection={'row'} justifyContent={'space-between'} alignItems={'flex-end'}>
        <Box width={'40%'}>
          <CustomSearchTable
            label="Search User Documents"
            placeholder="Search by Username, Name, Email"
          />
        </Box>

        <Box>
          <Button
            variant="link-primary"
            className="mr-8"
            icon={<Refresh />}
            disabled={isLoading}
            onClick={() => {
              onRefreshTable();
            }}
          >
            Refresh
          </Button>
          {canCreatePermission && (
            <Button
              icon={<Add />}
              onClick={() => {
                Navigator.navigate(PATHS.addUser);
              }}
              disabled={isLoading}
            >
              Add User
            </Button>
          )}
        </Box>
      </Stack>
      <Stack mb={2} flexDirection={'row'} justifyContent={'flex-end'} alignItems={'center'}>
        <CustomFilterUsersManagement />
        <DownloadAllUsers isLoading={isLoading} />
      </Stack>
    </Box>
  );
};

type Props = {
  onRefreshTable: Callback;
  isLoading: boolean;
};

export default HeaderTable;
