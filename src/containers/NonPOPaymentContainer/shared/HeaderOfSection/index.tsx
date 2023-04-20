import { Stack, Typography } from '@mui/material';
import { FC, memo } from 'react';

const HeaderOfSection: FC<Props> = () => {
  return (
    <Stack direction={'row'} alignItems={'center'} justifyContent="end">
      <Typography>
        <span className="has-text-danger fw-bold text-is-16">**</span> = required to Save
      </Typography>
      <Typography mx={1}>
        <span className="has-text-danger fw-bold text-is-16">*</span> = required to Submit
      </Typography>
    </Stack>
  );
};

type Props = {};

export default memo(HeaderOfSection);
