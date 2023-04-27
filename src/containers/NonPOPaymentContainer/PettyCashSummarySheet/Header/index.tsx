import { Box, Typography } from '@mui/material';
import { FC, memo } from 'react';

const Header: FC<Props> = () => {
  return (
    <Box>
      <Typography mt={2} variant="body2" textAlign={'center'}>
        Research Corporation of the University of Hawaii
      </Typography>
      <Typography mt={1} variant="h2" textAlign={'center'}>
        Petty Cash Summary Sheet
      </Typography>
      <Typography mt={1} variant="body2" textAlign={'center'} fontStyle={'italic'}>
        Please attach itemized listing with applicable original receipts
      </Typography>
    </Box>
  );
};

type Props = {};

export default memo(Header);
