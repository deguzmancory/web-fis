import { Box, Grid, Stack, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { IRootState } from 'src/redux/rootReducer';
import './styles.scss';
import { useProfile } from 'src/queries';
import PurchasingCard from './Cards/purchasingCard';
import NonPoPaymentCard from './Cards/nonPoPaymentsCard';
import TravelCard from './Cards/travelCard';
import ReportingCard from './Cards/reportingCard';
import MiscellaneousCard from './Cards/miscellaneousCard';
import HelpCard from './Cards/helpCard';

const Dashboard: React.FC<Props> = () => {
  const { profile } = useProfile();
  const { roleName } = profile || {};
  const { fullName } = profile || {};

  return (
    <Box minHeight={'70vh'}>
      <Stack marginLeft={'7%'} marginTop={'3%'} marginRight={'7%'}>
        <Box>
          <Typography variant="h3" paddingBottom={3}>
            Welcome {fullName} ({roleName})
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <PurchasingCard />
          </Grid>
          <Grid item xs={4}>
            <NonPoPaymentCard />
          </Grid>
          <Grid item xs={4}>
            <TravelCard />
          </Grid>
          <Grid item xs={4}>
            <ReportingCard />
          </Grid>
          <Grid item xs={4}>
            <MiscellaneousCard />
          </Grid>
          <Grid item xs={4}>
            <HelpCard />
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
