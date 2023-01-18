import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { IoServer } from 'react-icons/io5';
import { COLOR_CODE } from 'src/appConfig/constants';

export default function PurchasingCard() {
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
          <IoServer style={{ color: '#08C', width: 75, height: 65 }} />
        </Box>
        <Typography variant="h2" textAlign={'center'} sx={{ color: '#08C' }}>
          Purchasing
        </Typography>
        <Typography variant="body2" textAlign={'center'}>
          POs & PO Payments
        </Typography>
        <br />
        <Typography variant="body2">Review/Approve PO Documents over $24,999</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Pending PO Documents</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Outstanding PO Documents</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Approved PO Documents</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Search PO Documents</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
      </CardContent>
    </Card>
  );
}
