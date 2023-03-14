import { Box, Tooltip } from '@mui/material';
import React from 'react';
import { IoInformationCircle } from 'react-icons/io5';
import { COLOR_CODE } from 'src/appConfig/constants';

const InfoTooltip = ({ title = '' }) => {
  return (
    <Tooltip title={title} arrow>
      <Box>
        <IoInformationCircle
          size={18}
          color={COLOR_CODE.INFO}
          style={{
            transform: 'translateY(4px)',
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default React.memo(InfoTooltip);
