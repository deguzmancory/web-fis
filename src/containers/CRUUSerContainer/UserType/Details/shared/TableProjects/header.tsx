import { Search } from '@mui/icons-material';
import { Box, Stack } from '@mui/material';
import React from 'react';
import CustomSearchTable from 'src/components/CustomSearchTable';
import MuiPopOverFilter from 'src/components/MuiPopOverFilter';

const HeaderTableUserType = () => {
  const [isShowPopover, setIsShowPopover] = React.useState(false);
  return (
    <>
      <Stack direction={'row'} justifyContent={'flex-end'} mb={1}>
        <MuiPopOverFilter
          isShow={isShowPopover}
          onShow={setIsShowPopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          label={'User Project Search'}
          icon={<Search />}
          body={
            <Box p={2}>
              <CustomSearchTable label={null} placeholder="Search by Project Title" />
            </Box>
          }
        />
      </Stack>
    </>
  );
};

export default HeaderTableUserType;
