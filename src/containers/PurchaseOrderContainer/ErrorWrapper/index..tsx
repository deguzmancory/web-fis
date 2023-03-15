import { Box, Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { FallbackProps } from 'src/components/ErrorBoundary/CustomErrorBoundary';
import DefaultErrorFallback from 'src/components/ErrorBoundary/DefaultErrorBoundaryFallback';
import SectionLayout from 'src/containers/shared/SectionLayout';
import BreadcrumbsPODetail from '../breadcrumbs';
import RefetchPO from './refetchPO';

const ErrorWrapperPO: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
  showErrorMessage = false,
}) => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  return (
    <Box py={4}>
      <Container>
        <BreadcrumbsPODetail isViewMode={isEditMode} />
        <SectionLayout>
          {isEditMode ? (
            <RefetchPO resetErrorBoundary={resetErrorBoundary} />
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

export default ErrorWrapperPO;
