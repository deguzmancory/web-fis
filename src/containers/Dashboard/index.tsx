import { Box, Grid, Stack, Typography } from '@mui/material';
import { connect } from 'react-redux';
import TypographyLink from 'src/components/TypographyLink';
import { IRootState } from 'src/redux/rootReducer';
import './styles.scss';
import { useProfile } from 'src/queries';
import { AirplanemodeActive } from '@mui/icons-material';
import { COLOR_CODE } from 'src/appConfig/constants';

const Dashboard: React.FC<Props> = () => {
  const { profile } = useProfile();
  const { roleName } = profile || {};
  const { fullName } = profile || {};

  return (
    <Box minHeight={'70vh'}>
      <Stack marginLeft={'7%'} marginTop={'3%'}>
        <Box>
          <Typography variant="h3">
            Welcome {fullName} ({roleName})
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item md={4}>
            <Box p={4}>
              <TypographyLink variant="h1">Purchasing</TypographyLink>
            </Box>
          </Grid>
          <Grid item md={4}>
            <Box p={4}>
              <TypographyLink variant="h1">Non-PO Payments</TypographyLink>
            </Box>
          </Grid>
          <Grid item md={4}>
            <Box p={4}>
              <AirplanemodeActive
                sx={{
                  width: 75,
                  height: 65,
                  bgColor: COLOR_CODE.PRIMARY_500,
                }}
              />
              <TypographyLink variant="h2">Travel</TypographyLink>
            </Box>
          </Grid>
          <Grid item md={4}>
            <Box p={4}>
              <TypographyLink variant="h1">Reporting</TypographyLink>
            </Box>
          </Grid>
          <Grid item md={4}>
            <Box p={4}>
              <TypographyLink variant="h1">Miscellaneous</TypographyLink>
            </Box>
          </Grid>
          <Grid item md={4}>
            <Box p={4}>
              <TypographyLink variant="h1">Help</TypographyLink>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
