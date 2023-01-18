import { Add, Refresh } from '@mui/icons-material';
import { Box, Stack } from '@mui/material';
import { FaDownload } from 'react-icons/fa';
import { PATHS } from 'src/appConfig/paths';
import { Button } from 'src/components/common';
import CustomSearchTable from 'src/components/CustomSearchTable';
import { Callback } from 'src/redux/types';
import { Navigator, Toastify } from 'src/services';
import CustomFilterUsersManagement from './CustomFilter';

const HeaderTable: React.FC<Props> = ({ onRefreshTable, isLoading }) => {
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
          <Button
            icon={<Add />}
            onClick={() => {
              Navigator.navigate(PATHS.addUser);
            }}
            disabled={isLoading}
          >
            Add User
          </Button>
        </Box>
      </Stack>
      <Stack mb={2} flexDirection={'row'} justifyContent={'flex-end'} alignItems={'center'}>
        <CustomFilterUsersManagement />
        <Button
          variant="link"
          icon={<FaDownload />}
          onClick={() => {
            Toastify.info('Download All Users Clicked');
          }}
          disabled={isLoading}
        >
          Download All Users
        </Button>
      </Stack>
    </Box>
  );
};

type Props = {
  onRefreshTable: Callback;
  isLoading: boolean;
};

export default HeaderTable;
