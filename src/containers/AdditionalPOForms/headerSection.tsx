import { Stack } from '@mui/material';
import { NO_OPENER } from 'src/appConfig/constants';
import { Link } from 'src/components/common';
import React from 'react';

const HeaderOfSection: React.FC<Props> = ({ href, label }) => {
  return (
    <Stack direction={'row'} alignItems={'center'} justifyContent="end">
      <Link href={`${href}`} target={'_blank'} rel={NO_OPENER}>
        {label}
      </Link>
    </Stack>
  );
};

type Props = { href: string; label: string };

export default HeaderOfSection;
