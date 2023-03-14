import { Box, SxProps } from '@mui/material';
import { COLOR_CODE } from 'src/appConfig/constants';

const SectionLayout: React.FC<Props> = ({ sx, children, header, footer }) => {
  return (
    <>
      {header && <Box mt={2}>{header}</Box>}
      <Box
        sx={sx}
        p={3}
        bgcolor={'white'}
        border={COLOR_CODE.DEFAULT_BORDER}
        {...(!header && { mt: 2 })}
      >
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

export default SectionLayout;
