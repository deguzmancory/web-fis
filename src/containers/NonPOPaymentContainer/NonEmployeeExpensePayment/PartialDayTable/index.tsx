import { Divider, Grid, Typography } from '@mui/material';
import { FC, memo, useState } from 'react';
import { Accordion } from 'src/components/common';

const PartialDayTable: FC<Props> = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  return (
    <Accordion
      title={
        isExpanded ? 'Partial Day Calculation Table' : 'Per Diem Partial Day Calculation Table'
      }
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded((prev) => !prev)}
    >
      <Grid container>
        <Grid item xs={12} sm={5.8} container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="body2">
              The table below is used to assign partial days to the departure day from Hawaii and
              the return day to Hawaii.
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography variant="h6">
              HAWAII DEPARTURE/ RETURN PARTIAL DAY CALCULATION TABLE
            </Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'center' }}>
            <Typography variant="body2">Time of</Typography>
            <Typography variant="body2" my={'4px'}>
              Departure/ Return
            </Typography>
            <Typography variant="body2">12:01 a.m. - 6:00 a.m.</Typography>
            <Typography variant="body2">6:01 a.m. - Noon</Typography>
            <Typography variant="body2">12:01 p.m. - 6:00 p.m.</Typography>
            <Typography variant="body2">6:01 p.m. - Midnight</Typography>
          </Grid>
          <Grid item xs={8} container sx={{ textAlign: 'center' }}>
            <Grid item xs={12}>
              <Typography variant="body2">Allowed on day of:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" my={'4px'}>
                Departure
              </Typography>
              <Typography variant="body2">1 day</Typography>
              <Typography variant="body2">3/4 day</Typography>
              <Typography variant="body2">1/2 day</Typography>
              <Typography variant="body2">1/4 day</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" my={'4px'}>
                Return
              </Typography>
              <Typography variant="body2">1/4 day</Typography>
              <Typography variant="body2">1/2 day</Typography>
              <Typography variant="body2">3/4 day</Typography>
              <Typography variant="body2">1 day</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Grid item xs={12} sm={6} container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="body2">
              The table below is used to assign partial days to the departure days from business
              destinations.
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography variant="h6">BUSINESS DESTINATION PARTIAL DAY CALCULATION TABLE</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'center' }}>
            <Typography variant="body2">Time of</Typography>
            <Typography variant="body2" my={'4px'}>
              Departure/ Return
            </Typography>
            <Typography variant="body2">12:01 a.m. - 6:00 a.m.</Typography>
            <Typography variant="body2">6:01 a.m. - Noon</Typography>
            <Typography variant="body2">12:01 p.m. - 6:00 p.m.</Typography>
            <Typography variant="body2">6:01 p.m. - Midnight</Typography>
          </Grid>
          <Grid item xs={8} container sx={{ textAlign: 'center' }}>
            <Grid item xs={12}>
              <Typography variant="body2">Partial Day Assigned to:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" my={'4px'}>
                Departure
              </Typography>
              <Typography variant="body2">1/4 day</Typography>
              <Typography variant="body2">1/2 day</Typography>
              <Typography variant="body2">3/4 day</Typography>
              <Typography variant="body2">1 day</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" my={'4px'}>
                Return
              </Typography>
              <Typography variant="body2">3/4 day</Typography>
              <Typography variant="body2">1/2 day</Typography>
              <Typography variant="body2">1/4 day</Typography>
              <Typography variant="body2">0 day</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Accordion>
  );
};

interface Props {}

export default memo(PartialDayTable);
