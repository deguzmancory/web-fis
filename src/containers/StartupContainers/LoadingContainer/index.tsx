import { Backdrop, CircularProgress } from '@mui/material';
import { COLOR_CODE } from 'src/appConfig/constants';

const LoadingContainer: React.FC<Props> = () => {
  return (
    <Backdrop sx={{ color: COLOR_CODE.WHITE, zIndex: 9999 }} open={true} onClick={() => {}}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

type Props = {};

export default LoadingContainer;
