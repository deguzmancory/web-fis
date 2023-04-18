import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { IMAGES } from 'src/appConfig/images';
import { Image } from 'src/components/common';
import { PO_DOCUMENT_TYPE } from 'src/queries';
import { IRootState } from 'src/redux/rootReducer';

const clsPrefix = 'ctn-navbar-desktop';

const Title = () => {
  const formData = useSelector((state: IRootState) => state.form.formData);

  const isPOChangeForm = React.useMemo(() => {
    if (formData?.documentType === PO_DOCUMENT_TYPE.PO_CHANGE) {
      return 'P.O. CHANGE FORM';
    } else return null;
  }, [formData?.documentType]);

  return (
    <Stack justifyContent={'center'} alignItems="center">
      <Typography variant="h2">{isPOChangeForm}</Typography>
      <Stack flexDirection="row">
        <Box sx={{ mr: 1 }}>
          <Image src={IMAGES.logoGrey} className={`${clsPrefix}-logo`} />
        </Box>
        <Typography variant="h2" mb={1}>
          The Research Corporation of the University of Hawaii
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Title;
