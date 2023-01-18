import { PieChart } from '@mui/icons-material';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { COLOR_CODE } from 'src/appConfig/constants';

export default function ReportingCard() {
  return (
    <Card
      sx={{
        borderRadius: 2,
        height: 590,
      }}
    >
      <CardContent
        sx={{
          p: 4,
          m: 2,
        }}
      >
        <Box textAlign={'center'}>
          <PieChart sx={{ color: '#08C', width: 75, height: 65 }} />
        </Box>
        <Typography variant="h2" textAlign={'center'} sx={{ color: '#08C' }}>
          Reporting
        </Typography>
        <br />
        <br />
        <Typography variant="body2">UH Fiscal Reports</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">RCUH Reports</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Financial Forecast Reports</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
      </CardContent>
    </Card>
  );
}
