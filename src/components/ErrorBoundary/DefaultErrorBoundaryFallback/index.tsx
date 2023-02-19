import { Box, Container, Stack, Typography } from '@mui/material';
import { PATHS } from 'src/appConfig/paths';
import { Button } from 'src/components/common';
import { Navigator } from 'src/services';
import { FallbackProps } from '../CustomErrorBoundary';

const DefaultErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
  showErrorMessage = false,
}) => {
  const handleBackToHome = () => {
    resetErrorBoundary();
    Navigator.navigate(PATHS.dashboard);
  };

  const handleTryAgain = () => {
    resetErrorBoundary();
    window.location.reload();
  };

  return (
    <Container>
      <Box minHeight="70vh" pt={8} textAlign="center">
        <Typography variant="h1">Unfortunately, something went wrong.</Typography>
        <Typography mt={4}>
          Please refresh your browser. If the error continues, please contact our support team.
        </Typography>

        {showErrorMessage && (
          <Box mt={4}>
            <pre>{error.message}</pre>
          </Box>
        )}

        <Stack direction="row" alignItems="center" justifyContent="center" mt={4} spacing={3}>
          <Button onClick={handleBackToHome}>Back to Home</Button>
          <Button onClick={handleTryAgain} variant="outline">
            Try again
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default DefaultErrorFallback;
