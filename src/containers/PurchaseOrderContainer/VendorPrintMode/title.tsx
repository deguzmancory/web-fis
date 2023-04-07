import { Stack, Typography } from '@mui/material';

const Title = () => {
  return (
    <Stack justifyContent={'center'} alignItems="center" flexDirection={'row'}>
      {/* TODO: Tuyen Tran add logo */}
      {/* <Box sx={{ transform: 'translateY(15px)' }}>
        <Image src={IMAGES.logo} className={`${clsPrefix}-logo`} />
      </Box> */}
      <Typography variant="h2" mb={1}>
        The Research Corporation of the University of Hawaii
      </Typography>
    </Stack>
  );
};

export default Title;
