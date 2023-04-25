import { Stack, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { Link } from '../../../../components/common';
import { NO_OPENER } from '../../../../appConfig/constants';

const HeaderOfSection: FC<Props> = ({ showPolicyLink = false, allowApproving = false }) => {
  return (
    <Stack direction={'row'} alignItems={'center'} justifyContent="end">
      <Typography>
        <span className="has-text-danger fw-bold text-is-16">**</span> = required to Save
      </Typography>
      <Typography mx={1}>
        <span className="has-text-danger fw-bold text-is-16">*</span> = required to Submit
        {allowApproving && <span>/Approve</span>}
      </Typography>
      {showPolicyLink && (
        <Link href="https://www.rcuh.com/2-000/2-200/2-201/" target={'_blank'} rel={NO_OPENER}>
          RCUH Policy 2.201
        </Link>
      )}
    </Stack>
  );
};

type Props = {
  showPolicyLink?: boolean;
  allowApproving?: boolean;
};

export default memo(HeaderOfSection);
