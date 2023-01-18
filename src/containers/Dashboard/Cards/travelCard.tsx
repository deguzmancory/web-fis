import { AirplanemodeActive } from '@mui/icons-material';
import { Card, CardContent, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { COLOR_CODE } from 'src/appConfig/constants';

export default function TravelCard() {
  return (
    <Card
      sx={{
        borderRadius: 2,
        height: 410,
      }}
    >
      <CardContent
        sx={{
          p: 4,
          m: 2,
        }}
      >
        <Box textAlign={'center'}>
          <AirplanemodeActive sx={{ color: '#08C', width: 75, height: 65 }} />
        </Box>
        <Typography variant="h2" textAlign={'center'} sx={{ color: '#08C' }}>
          Travel
        </Typography>
        <br />
        <br />
        <Typography variant="body2">Review/Approve Travel Documents</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Pending Travel Documents</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Outstanding Travel Documents</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Approved PO Documents</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Search Travel Documents</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
      </CardContent>
    </Card>
  );
}
