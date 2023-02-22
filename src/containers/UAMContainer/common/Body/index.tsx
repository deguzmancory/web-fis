import { Box, Container, Link, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { IMAGES } from 'src/appConfig/images';
import { Image } from 'src/components/common';
import Header from '../Header';
import { portalOptions } from './helpers';

const Body: React.FC<Props> = ({ children, bodyWidth = '400px' }) => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${IMAGES.backgroundDiamond})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top right',
        backgroundSize: 'auto',
        py: 8,
        bgcolor: '#E8EAE8',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <Stack flexDirection={'row'} minHeight="600px" bgcolor={'white'}>
            <Box minWidth={'260px'} bgcolor={'#19112F'}>
              <Box minHeight={'100%'}>
                <Box
                  height={'160px'}
                  sx={{
                    backgroundImage: `url(${IMAGES.backgroundDiamondSmall})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'bottom left',
                    backgroundSize: 'contain',
                  }}
                >
                  <Stack
                    flexDirection={'row'}
                    justifyContent={'center'}
                    alignItems="center"
                    minHeight={'100%'}
                  >
                    <Box
                      width={'28px'}
                      mr={2}
                      sx={{
                        transform: 'translateY(2px)',
                      }}
                    >
                      <Image src={IMAGES.iconComputer} alt="ic_computer" />
                    </Box>
                    <Typography variant="h1" color="white">
                      Log In
                    </Typography>
                  </Stack>
                </Box>
                <Box>
                  {portalOptions.map((portal) => (
                    <Link href={portal.url} key={portal.title} underline="none">
                      <Box
                        px={4}
                        py={2}
                        bgcolor={portal.isActive ? '#5C517B' : 'transparent'}
                        sx={{
                          '&:hover': {
                            bgcolor: '#523e88',
                          },
                        }}
                      >
                        <Typography variant="h5" color="white">
                          {portal.title}
                        </Typography>
                      </Box>
                    </Link>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box width={'100%'}>
              <Stack justifyContent={'center'} alignItems="center" minHeight={'100%'}>
                <Box width={bodyWidth}>
                  <Header />

                  {children}
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

type Props = {
  children: React.ReactNode;
  bodyWidth?: string;
};

export default Body;
