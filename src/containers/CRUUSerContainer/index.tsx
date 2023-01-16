import { Box, Container, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FormikProps, useFormik } from 'formik';
import React, { Suspense } from 'react';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Accordion, Button, LoadingCommon } from 'src/components/common';
import { useCreateUser, useGetAllUsers, useGetUser } from 'src/queries/Users';
import { hideAllDialog, hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, Toastify } from 'src/services';
import { deepKeys, scrollToTopError } from 'src/utils';
import { DateFormatDisplayMinute } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import { handleShowErrorMsg } from '../UsersManagement/helpers';
import BreadcrumbsUserDetail from './breadcrumbs';
import GeneralInfo from './GeneralInfo';
import {
  CRUUserFormikProps,
  cRUUserFormSchema,
  CRUUserFormValue,
  CRUUSER_KEY,
  formatPayloadSubmit,
  getValueRoles,
  getValueUserStatus,
  initialCRUUserFormValue,
} from './helper';
import InternalComments from './InternalComments';
import Layout from './layout';
import './styles.scss';
import UserType from './UserType';

const RefetchUser = React.lazy(() => import('./refetchUser'));
const AuditInformation = React.lazy(() => import('./AuditInformation'));

const clsPrefix = 'ctn-cruuser';

const CRUUserContainer: React.FC<Props> = ({ onShowDialog, onHideDialog, onHideAllDialog }) => {
  const { userId } = useParams<{ userId: string }>();
  const [isViewMode] = React.useState(!isEmpty(userId));
  const [isErrorWhenFetchUser, setIsErrorWhenFetchUser] = React.useState(false);

  const {
    user,
    onGetUserById,
    isLoading: isLoadingGetUser,
  } = useGetUser({
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
        title: `Cancel`,
        content: `There are unsaved changes on the Form. Are you sure you want to leave this page?`,
        okText: 'Ok',
        cancelText: 'Cancel',
        onOk: () => {
          onHideDialog();
          Navigator.navigate(PATHS.userManagements);
        },
        onCancel: () => {
          onHideAllDialog();
        },
      },
    });
  };

  const { handleInvalidateAllUser } = useGetAllUsers();

  const { createUser, isLoading: isLoadingCreateUser } = useCreateUser({
    onSuccess(data, variables, context) {
      Toastify.success(`Add User successfully.`);
      handleInvalidateAllUser();
      Navigator.navigate(PATHS.userManagements);
    },
    onError(error, variables, context) {
      if (error.message === 'An account with this username already existed.') {
        setFieldError(CRUUSER_KEY.USERNAME, error.message);
        handleScrollToTopError();
      }
      handleShowErrorMsg(error);
    },
  });

  const handleFormSubmit = (values: CRUUserFormValue) => {
    if (isViewMode) {
      Toastify.info('Save mode Edit clicked');
    } else {
      const payload = formatPayloadSubmit(values);
      createUser(payload);
    }
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
        status: getValueUserStatus(user.status),
        roles: getValueRoles(user.roles),
        comments: user.comments,
      };
    } else {
      return {
        ...initialCRUUserFormValue,
        isViewMode: isViewMode,
      };
    }
  }, [isViewMode, user]);

  const handleScrollToTopError = () => {
    return setTimeout(() => {
      scrollToTopError(deepKeys(errors));
    }, 100);
  };

  const {
    values,
    setFieldValue,
    errors,
    touched,
    getFieldProps,
    setFieldTouched,
    handleSubmit,
    setFieldError,
  } = useFormik<CRUUserFormValue>({
    initialValues: initialFormValue,
    onSubmit: handleFormSubmit,
    validationSchema: cRUUserFormSchema,
    innerRef: formRef,
    enableReinitialize: true,
  });

  // console.log('values: ', values);
  // console.log('errors: ', errors);

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
            <RefetchUser onGetUserById={onGetUserById} isLoading={isLoadingGetUser} />
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
              <Button
                onClick={() => {
                  handleSubmit();
                  handleScrollToTopError();
                }}
                isLoading={isLoadingGetUser || isLoadingCreateUser}
                disabled={isLoadingGetUser || isLoadingCreateUser}
              >
                Save
              </Button>
            </Stack>

            {isViewMode && (
              <Accordion title={'Raw Data'}>
                <Typography>{userId}</Typography>
                {user && <ReactJson src={user} />}
              </Accordion>
            )}
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
  onHideAllDialog: hideAllDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(CRUUserContainer);
