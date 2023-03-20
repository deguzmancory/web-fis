import { Add, Refresh } from '@mui/icons-material';
import { Box, Stack } from '@mui/material';
import { PATHS } from 'src/appConfig/paths';
import { Button } from 'src/components/common';
import CustomSearchTable from 'src/components/CustomSearchTable';
import { Callback } from 'src/redux/types';
import { Navigator, PermissionsService } from 'src/services';
// import CustomFilterUsersManagement from './CustomFilter';

const HeaderTable: React.FC<Props> = ({ onRefreshTable, isLoading }) => {
  const canCreatePermission = PermissionsService.vendorMaster().canUpdate;
  return (
    <Box>
      <Stack mb={2} flexDirection={'row'} justifyContent={'space-between'} alignItems={'flex-end'}>
        <Box width={'40%'}>
          <CustomSearchTable
            label="Search Vendors"
            placeholder="Search by vendor code or vendor name"
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
                Navigator.navigate(PATHS.addVendorMaster);
              }}
              disabled={isLoading}
            >
              Add Vendor Master
            </Button>
          )}
          <Button
            icon={<Add />}
            onClick={() => {
              Navigator.navigate(PATHS.addVendorRegistration);
            }}
            className="ml-16"
            disabled={isLoading}
          >
            Vendor Registration
          </Button>
        </Box>
      </Stack>
      {/* <Stack mb={2} flexDirection={'row'} justifyContent={'flex-end'} alignItems={'center'}>
        <CustomFilterUsersManagement />
      </Stack> */}
    </Box>
  );
};

type Props = {
  onRefreshTable: Callback;
  isLoading: boolean;
};

export default HeaderTable;
