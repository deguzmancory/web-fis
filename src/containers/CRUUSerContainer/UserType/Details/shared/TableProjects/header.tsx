import { Search } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import CustomSearchTable from 'src/components/CustomSearchTable';
import MuiPopOverFilter from 'src/components/MuiPopOverFilter';

export enum SEARCH_PROJECT_KEY {
  SEARCH_NAME = 'searchName',
}

const HeaderTableUserType = () => {
  const [isShowPopover, setIsShowPopover] = React.useState(false);
  return (
    <>
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mb={1}>
        <Typography variant="body2">User Project List</Typography>
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
              <CustomSearchTable
                label={null}
                placeholder="Search by Project Title"
                searchKey={SEARCH_PROJECT_KEY.SEARCH_NAME}
                enableAutoFocus
              />
            </Box>
          }
        />
      </Stack>
    </>
  );
};

export default HeaderTableUserType;
