import { Box } from '@mui/material';
import { FC, Suspense } from 'react';
import { connect } from 'react-redux';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import { LoadingCommon } from 'src/components/common';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import ErrorNonPOWrapper from '../shared/ErrorWrapper/index.';

const AuthorizationForPayment: FC<Props> = ({
  formData,
  isImmutableFormData,
  onSetFormData,
  onSetIsImmutableFormData,
  formAction,
}) => {
  return <Box>test</Box>;
};

const AuthorizationForPaymentWrapper: React.FC<Props> = ({ ...props }) => {
  return (
    <CustomErrorBoundary FallbackComponent={(props) => <ErrorNonPOWrapper {...props} />}>
      <Suspense
        fallback={
          <Box minHeight="80vh" p={4}>
            <LoadingCommon />
          </Box>
        }
      >
        <AuthorizationForPayment {...props} />
      </Suspense>
    </CustomErrorBoundary>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState<any>) => ({
  formData: state.form.formData,
  isImmutableFormData: state.form.isImmutableFormData,
  formAction: state.form.poFormAction,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizationForPaymentWrapper);
