import { Extension } from '@mui/icons-material';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { COLOR_CODE } from 'src/appConfig/constants';

export default function MiscellaneousCard() {
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
          <Extension sx={{ color: '#08C', width: 75, height: 65 }} />
        </Box>
        <Typography variant="h2" textAlign={'center'} sx={{ color: '#08C' }}>
          Miscellaneous
        </Typography>
        <br />
        <br />
        <Typography variant="body2">Search All Documents</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">User Management</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Search Vendors</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Register for ePayments</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Check Printing</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Check Registers</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Vacation and Sick Leave Audit Page</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Global Settings</Typography>
        <Typography variant="body2">HR and Payroll Application</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">RCUH Staff Listing</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
      </CardContent>
    </Card>
  );
}
