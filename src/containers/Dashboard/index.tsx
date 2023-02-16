import { Box, Container, Grid, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { useProfile } from 'src/queries';
import { getRoleName } from 'src/queries/Profile/helpers';
import { IRootState } from 'src/redux/rootReducer';
import CardDashboard from './card';
import { dashboardItems } from './helpers';
import SkeletonDashboard from './skeleton';
import './styles.scss';

const Dashboard: React.FC<Props> = ({ userProfile, currentRole }) => {
  const { loading } = useProfile();
  const { fullName } = userProfile || {};

  return (
    <Box py={4}>
      <Container maxWidth={'lg'}>
        {loading ? (
          <SkeletonDashboard />
        ) : (
          <>
            <Box>
              <Typography variant="h3" paddingBottom={3}>
                Welcome {fullName || 'Anonymous'} (Financial System - {getRoleName(currentRole)})
              </Typography>
            </Box>
            <Grid container spacing={2} alignItems="stretch">
              {dashboardItems.map((card) => (
                <Grid item xs={4} key={card.title}>
                  <CardDashboard card={card} userRole={currentRole} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({
  userProfile: state.auth.user,
  currentRole: state.auth.currentRole,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
