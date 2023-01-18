import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { IoWallet } from 'react-icons/io5';
import { COLOR_CODE } from 'src/appConfig/constants';

export default function NonPoPaymentCard() {
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
          <IoWallet style={{ color: '#08C', width: 75, height: 65 }} />
        </Box>
        <Typography variant="h2" textAlign={'center'} sx={{ color: '#08C' }}>
          Non-PO Payments
        </Typography>
        <br />
        <br />
        <Typography variant="body2">Review/Approve Payments over $24,999</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Pending Payments</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Approved Payments</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Search payments</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
      </CardContent>
    </Card>
  );
}
