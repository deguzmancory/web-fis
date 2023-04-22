import { ErrorOutline } from '@mui/icons-material';
import { Box, Stack, SxProps, Typography } from '@mui/material';
import { COLOR_CODE } from 'src/appConfig/constants';

const FormErrorSection: React.FC<Props> = ({ sx, children, header, footer }) => {
  return (
    <>
      {header && <Box mt={2}>{header}</Box>}
      <Box
        sx={sx}
        p={3}
        bgcolor={'#fff6f6'}
        border={COLOR_CODE.DEFAULT_BORDER}
        borderColor={'error.main'}
        color={'error.main'}
        {...(!header && { mt: 2 })}
      >
        <Stack direction={'row'} alignItems={'center'} mb={2}>
          <ErrorOutline fontSize="small" />
          <Typography ml={1} color={'error.main'} fontWeight={'bold'}>
            Validation Errors / System Errors:{' '}
          </Typography>
        </Stack>

        {children}
      </Box>
      {footer}
    </>
  );
};

interface Props {
  sx?: SxProps;
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export default FormErrorSection;
