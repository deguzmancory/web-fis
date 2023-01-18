import { Help } from '@mui/icons-material';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { COLOR_CODE } from 'src/appConfig/constants';

export default function HelpCard() {
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
          <Help sx={{ color: '#08C', width: 75, height: 65 }} />
        </Box>
        <Typography variant="h2" textAlign={'center'} sx={{ color: '#08C' }}>
          Help
        </Typography>
        <br />
        <br />
        <Typography variant="body2">RCUH Policies and Procedures</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Modernization Financial Portal User Guide</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">New Features at a Glance</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
        <Typography variant="body2">Video Guides for the Modernized Form Changes</Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_50, marginBottom: 2 }} />
      </CardContent>
    </Card>
  );
}
