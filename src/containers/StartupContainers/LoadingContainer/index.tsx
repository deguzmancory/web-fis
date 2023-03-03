import { Backdrop, Box, CircularProgress } from '@mui/material';
import { COLOR_CODE } from 'src/appConfig/constants';

const LoadingContainer: React.FC<Props> = () => {
  return (
    <>
      <Backdrop sx={{ color: COLOR_CODE.WHITE, zIndex: 9999 }} open={true} onClick={() => {}}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ minHeight: '50vh' }} />
    </>
  );
};

type Props = {};

export default LoadingContainer;
