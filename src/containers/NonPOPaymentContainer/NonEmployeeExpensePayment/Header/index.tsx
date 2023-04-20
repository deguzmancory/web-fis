import { Box, Typography } from '@mui/material';
import { FC, memo } from 'react';

const Header: FC<Props> = () => {
  return (
    <Box>
      <Typography mt={2} variant="body2" textAlign={'center'}>
        Research Corporation of the University of Hawaii
      </Typography>
      <Typography mt={1} variant="h2" textAlign={'center'}>
        Non-Employee Expense Payment Form
      </Typography>
      <Typography mt={1} variant="h6" textAlign={'center'}>
        Purpose – For payment to an individual not employed by RCUH/UH. This form should NOT be used
        by UH students or UH post-doctoral fellows receiving scholarship or fellowship payments.
      </Typography>
      <Typography mt={1} variant="body2" textAlign={'center'} fontStyle={'italic'}>
        (For Nonresident Aliens and Resident Aliens (by SPT), Print Out and Submit Attachment 10 in
        the Document Library Manually to RCUH Disbursing; Do NOT Approve Online)
      </Typography>
    </Box>
  );
};

type Props = {};

export default memo(Header);
