import { Box, Container, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FormikProps, useFormik } from 'formik';
import React, { Suspense } from 'react';
import { AiFillWarning } from 'react-icons/ai';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import { Accordion, Button, LoadingCommon } from 'src/components/common';
import { useGetUser } from 'src/queries/Users';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, Toastify } from 'src/services';
import { DateFormatDisplayMinute } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import { handleShowErrorMsg } from '../UsersManagement/helpers';
import BreadcrumbsUserDetail from './breadcrumbs';
import GeneralInfo from './GeneralInfo';
import {
  CRUUserFormikProps,
  cRUUserFormSchema,
  CRUUserFormValue,
  initialCRUUserFormValue,
} from './helper';
import InternalComments from './InternalComments';
import Layout from './layout';
import './styles.scss';
import UserType from './UserType';

const RefetchUser = React.lazy(() => import('./refetchUser'));
const AuditInformation = React.lazy(() => import('./AuditInformation'));

const clsPrefix = 'ctn-cruuser';

const CRUUserContainer: React.FC<Props> = ({ onShowDialog, onHideDialog }) => {
  const { userId } = useParams<{ userId: string }>();
  const [isViewMode] = React.useState(!isEmpty(userId));
  const [isErrorWhenFetchUser, setIsErrorWhenFetchUser] = React.useState(false);

  const { user, onGetUserById, isLoading } = useGetUser({
    userId: userId || null,
    onError(err: Error) {
      handleShowErrorMsg(err, 'Error when fetch data user');
      setIsErrorWhenFetchUser(true);
    },
  });

  const handleCancelButton = () => {
    onShowDialog({
      type: DIALOG_TYPES.YESNO_DIALOG,
      data: {
        title: `Attention`,
        iconTitle: <AiFillWarning color={COLOR_CODE.WARNING} size={25} />,
        content: `Changes you made may not be saved. Are you sure you want to proceed?`,
        okText: 'Yes, leave',
        cancelText: 'No, stay',
        onOk: () => {
          onHideDialog();
          Navigator.navigate(PATHS.userManagements);
        },
        onCancel: () => {
          onHideDialog();
        },
      },
    });
  };

  const handleFormSubmit = (values: CRUUserFormValue) => {
    Toastify.info('Save clicked');
  };

  const formRef = React.useRef<FormikProps<CRUUserFormValue>>(null);

  const initialFormValue = React.useMemo(() => {
    const formatDate = (date: string) => {
      if (!date) return '';
      return dayjs(date).format(DateFormatDisplayMinute);
    };
    if (isViewMode && !isEmpty(user)) {
      return {
        ...initialCRUUserFormValue,
        isViewMode: isViewMode,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName || '',
        defaultUserType: user.defaultUserType,
        username: user.username,
        email: user.email,
        lastLoginDate: formatDate(user.lastLoginDate),
        passwordSetDate: formatDate(user.passwordSetDate),
        comments: user.comments,
      };
    } else {
      return {
        ...initialCRUUserFormValue,
        isViewMode: isViewMode,
      };
    }
  }, [isViewMode, user]);

  const { values, setFieldValue, errors, touched, getFieldProps, setFieldTouched, handleSubmit } =
    useFormik<CRUUserFormValue>({
      initialValues: initialFormValue,
      onSubmit: handleFormSubmit,
      validationSchema: cRUUserFormSchema,
      innerRef: formRef,
      enableReinitialize: true,
    });
  console.log('values: ', values);

  const formikProps: CRUUserFormikProps = {
    values,
    setFieldValue,
    errors,
    touched,
    getFieldProps,
    setFieldTouched,
  };

  return (
    <Box className={`${clsPrefix}`} py={2} minHeight={'50vh'}>
      <Container maxWidth="lg">
        <BreadcrumbsUserDetail isViewMode={isViewMode} />
        <Typography mt={2} variant="h2">
          {isViewMode ? 'Edit' : 'Add'} User
        </Typography>
        {isErrorWhenFetchUser ? (
          <Suspense fallback={<LoadingCommon />}>
            <RefetchUser onGetUserById={onGetUserById} isLoading={isLoading} />
          </Suspense>
        ) : (
          <>
            <Layout>
              <GeneralInfo formikProps={formikProps} />
            </Layout>
            <Layout>
              <UserType formikProps={formikProps} />
            </Layout>
            <Layout>
              <InternalComments formikProps={formikProps} />
            </Layout>
            {isViewMode && (
              <Suspense fallback={<LoadingCommon />}>
                <Accordion title="Audit Information" className="mt-16">
                  <AuditInformation formikProps={formikProps} />
                </Accordion>
              </Suspense>
            )}
            <Layout>
              <Typography>{userId}</Typography>
              <Typography>{JSON.stringify(user)}</Typography>
            </Layout>

            <Stack my={4} flexDirection={'row'} justifyContent="center">
              <Button
                variant="outline"
                className="mr-8"
                onClick={() => {
                  handleCancelButton();
                }}
              >
                Cancel
              </Button>
              <Button onClick={() => handleSubmit()}>Save</Button>
            </Stack>
          </>
        )}
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(CRUUserContainer);
