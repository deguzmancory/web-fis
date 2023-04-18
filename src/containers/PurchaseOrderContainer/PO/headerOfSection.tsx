import { Stack, Typography } from '@mui/material';
import React from 'react';
import { NO_OPENER } from 'src/appConfig/constants';
import { Link } from 'src/components/common';

const HeaderOfSection: React.FC<Props> = () => {
  return (
    <Stack direction={'row'} alignItems={'center'} justifyContent="end">
      <Typography>
        <span className="has-text-danger fw-bold text-is-16">**</span> = required to Save
      </Typography>
      <Typography mx={1}>
        <span className="has-text-danger fw-bold text-is-16">*</span> = required to Submit/Approve
        RCUH
      </Typography>
      <Link href="https://www.rcuh.com/2-000/2-200/2-201/" target={'_blank'} rel={NO_OPENER}>
        RCUH Policy 2.201
      </Link>
    </Stack>
  );
};

type Props = {};

export default React.memo(HeaderOfSection);
