import { Box, Container, Grid, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { useProfile } from 'src/queries';
import { IRootState } from 'src/redux/rootReducer';
import CardDashboard from './card';
import { dashboardItems } from './helpers';
import SkeletonDashboard from './skeleton';
import './styles.scss';

const Dashboard: React.FC<Props> = () => {
  const { profile, loading } = useProfile();
  const { roleName, fullName, defaultUserType } = profile || {};

  return (
    <Box py={4}>
      <Container maxWidth={'lg'}>
        {loading ? (
          <SkeletonDashboard />
        ) : (
          <>
            <Box>
              <Typography variant="h3" paddingBottom={3}>
                Welcome {fullName} (Financial System - {roleName})
              </Typography>
            </Box>
            <Grid container spacing={2} alignItems="stretch">
              {dashboardItems.map((card) => (
                <Grid item xs={4} key={card.title}>
                  <CardDashboard card={card} userRole={defaultUserType} />
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

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
