import { Box, Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { FallbackProps } from 'src/components/ErrorBoundary/CustomErrorBoundary';
import DefaultErrorFallback from 'src/components/ErrorBoundary/DefaultErrorBoundaryFallback';
import SectionLayout from 'src/containers/shared/SectionLayout';
import RefetchPO from './refetchNonPODetail';
import BreadcrumbsNonPOForm from '../Breadcrumb';

const ErrorNonPOWrapper: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
  showErrorMessage = false,
}) => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  return (
    <Box py={4}>
      <Container>
        <BreadcrumbsNonPOForm />
        <SectionLayout>
          {isEditMode ? (
            <Box>
              <Typography variant="h3" textAlign={'center'} mb={3}>
                Something went wrong.
              </Typography>
              <RefetchPO resetErrorBoundary={resetErrorBoundary} />
            </Box>
          ) : (
            <DefaultErrorFallback
              error={error}
              resetErrorBoundary={resetErrorBoundary}
              showErrorMessage={showErrorMessage}
            />
          )}
        </SectionLayout>
      </Container>
    </Box>
  );
};

export default ErrorNonPOWrapper;
