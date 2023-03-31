import { Stack, Typography } from '@mui/material';
import { NO_OPENER } from 'src/appConfig/constants';
import { Link } from 'src/components/common';
import React from 'react';

const HeaderOfSection: React.FC<Props> = ({ href, label, label_left }) => {
  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={label_left ? 'space-between' : 'end'}
    >
      {label_left ? <Typography variant="body2">UH FORM 39 (PMO)</Typography> : null}
      <Link href={`${href}`} target={'_blank'} rel={NO_OPENER}>
        {label}
      </Link>
    </Stack>
  );
};

type Props = { href: string; label: string; label_left?: string };

export default HeaderOfSection;
