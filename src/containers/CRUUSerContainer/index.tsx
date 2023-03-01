import { Box, Container, Stack, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Accordion, Button, LoadingCommon } from 'src/components/common';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import { useProfile } from 'src/queries';
import { isCU, ROLE_NAME } from 'src/queries/Profile/helpers';
import { useCreateUser, useGetAllUsers, useGetUser } from 'src/queries/Users';
import { useUpdateUser } from 'src/queries/Users/useUpdateUser';
import { setCurrentRole } from 'src/redux/auth/authSlice';
import { hideAllDialog, hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, RoleService, Toastify, TokenService } from 'src/services';
import {
  deepKeys,
  getUncontrolledInputFieldProps,
  handleShowErrorMsg,
  scrollToTopError,
} from 'src/utils';
import { localTimeToHawaii } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import BreadcrumbsUserDetail from './breadcrumbs';
import { CRUUSER_KEY, USER_MODE } from './enums';
import ErrorWrapperCRUUser from './error';
import {
  CRUUserFormikProps,
  cRUUserFormSchema,
  CRUUserFormValue,
  formatPayloadAddNew,
  formatPayloadUpdate,
  getValueRoles,
  getValueUserStatus,
  initialCRUUserFormValue,
} from './helper';
import Layout from './layout';
import './styles.scss';

const AuditInformation = React.lazy(() => import('./AuditInformation'));
const UserType = React.lazy(() => import('./UserType'));
const InternalComments = React.lazy(() => import('./InternalComments'));
const GeneralInfo = React.lazy(() => import('./GeneralInfo'));
const NoPermission = React.lazy(() => import('src/components/NoPermission'));

const clsPrefix = 'ctn-cruuser';

const CRUUserContainer: React.FC<Props> = ({
  currentRole,
  onShowDialog,
  onHideDialog,
  onHideAllDialog,
  onSetCurrentRole,
}) => {
  const { userId } = useParams<{ userId: string }>();
  const [isEditUserMode] = React.useState(!isEmpty(userId));

  const {
    user,
    isLoading: isLoadingGetUser,
    handleInvalidateUser,
  } = useGetUser({
    userId: userId || null,
    suspense: true,
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
          setTimeout(() => {
            Navigator.navigate(PATHS.userManagements);
          }, 50);
        },
        onCancel: () => {
          onHideAllDialog();
        },
      },
    });
  };

  const { handleInvalidateAllUser } = useGetAllUsers();
  const { profile, handleInvalidateProfile, getMyProfile } = useProfile();
  const { createUser, isLoading: isLoadingCreateUser } = useCreateUser({
    onSuccess(_data, variables, _context) {
      Toastify.success(`Add User ${variables.username} successfully.`);
      handleInvalidateAllUser();
      Navigator.navigate(PATHS.userManagements);
    },
    onError(error, _variables, _context) {
      if (error.message === 'An account with this username already existed.') {
        setFieldError(CRUUSER_KEY.USERNAME, 'The username specified already exists.');
        handleScrollToTopError();
      }
      handleShowErrorMsg(error);
    },
  });

  const { updateUser, isLoading: isLoadingUpdateUser } = useUpdateUser({
    onSuccess(_data, variables, _context) {
      Toastify.success(`Update User ${variables.username} successfully.`);
      handleInvalidateUser();
      handleInvalidateAllUser();
      window.scrollTo(0, 0);
      const isMyProfile = userId === profile.id;
      if (isMyProfile) {
        const updatedDefaultRole = variables.defaultUserType as ROLE_NAME;

        RoleService.setCurrentRole(updatedDefaultRole);
        onSetCurrentRole(updatedDefaultRole);
        handleInvalidateProfile();
        TokenService.forceRefreshToken();
        getMyProfile();
      }
    },
    onError(error: Error, _variables, _context) {
      if (error['error']?.includes('Already found an entry for the provided username')) {
        setFieldError(CRUUSER_KEY.USERNAME, 'The username specified already exists.');
        window.scrollTo(0, 0);
      } else {
        handleShowErrorMsg(error);
      }
    },
  });

  const handleFormSubmit = (values: CRUUserFormValue) => {
    if (isEditUserMode) {
      const payload = formatPayloadUpdate(values, user);
      updateUser(payload);
    } else {
      const payload = formatPayloadAddNew(values);
      createUser(payload);
    }
  };

  const formRef = React.useRef<FormikProps<CRUUserFormValue>>(null);

  const initialFormValue = React.useMemo(() => {
    const formatDate = (date: string) => {
      if (!date) return '';
      return localTimeToHawaii(date);
    };
    if (isEditUserMode && !isEmpty(user)) {
      const delegateAccess = user.delegateAccesses.map((item) => ({
        isEdit: false,
        delegatedUserId: item.delegatedUserId,
        username: item.delegatedUser.username,
        fullName: item.delegatedUser.fullName,
        roleName: item.userRole.role.displayName,
        projectNumber: item.projectNumber,
        startDate: item.startDate,
        startDateTemp: null,
        endDate: item.endDate,
        endDateTemp: null,
        isAllProjects: item.isAllProjects,
        userId: item.userId,
        roleId: item.roleId,
        delegatedUser: item.delegatedUser,
        id: item.id,
      }));

      const fisFaInfo = user.fisFaInfo ?? initialCRUUserFormValue.fisFaInfo;
      const fisSuInfo = user.fisSuInfo ?? initialCRUUserFormValue.fisSuInfo;

      // PI section doesn't have userFisCodes => create an local property for reuseable purpose
      const fisPiInfo = user.fisPiInfo
        ? {
            ...user.fisPiInfo,
            userFisCodes: user.fisPiInfo.piCode
              ? [{ code: user.fisPiInfo.piCode, codeType: ROLE_NAME.PI }]
              : [],
          }
        : initialCRUUserFormValue.fisPiInfo;

      return {
        ...initialCRUUserFormValue,
        mode: USER_MODE.EDIT_USER,
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
        delegateAccess: delegateAccess,
        delegatedAccess: user.delegatedAccesses,
        fisFaInfo: { ...fisFaInfo, currentFACode: null, currentSearchProject: null },
        fisPiInfo: { ...fisPiInfo, useExistingPICode: false, currentSearchProject: null },
        fisSuInfo: { ...fisSuInfo, currentPICode: null, currentSearchProject: null },
        permissions: user.permissions.map((permission) => ({
          permissionId: permission.permissionId,
        })),
      };
    } else {
      return {
        ...initialCRUUserFormValue,
        mode: USER_MODE.ADD_USER,
      };
    }
  }, [isEditUserMode, user]);

  const loading = isLoadingGetUser || isLoadingCreateUser || isLoadingUpdateUser;

  const handleScrollToTopError = () => {
    return setTimeout(() => {
      scrollToTopError(deepKeys(errors));
    }, 100);
  };

  const {
    values,
    errors,
    touched,
    setFieldValue,
    getFieldProps,
    setFieldTouched,
    handleSubmit,
    setFieldError,
  } = useFormik<CRUUserFormValue>({
    initialValues: initialFormValue,
    validationSchema: cRUUserFormSchema,
    innerRef: formRef,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
  });

  const formikProps: CRUUserFormikProps = {
    values,
    errors,
    touched,
    setFieldValue,
    getFieldProps,
    setFieldTouched,
    getUncontrolledFieldProps: getUncontrolledInputFieldProps({
      values,
      setFieldTouched,
      setFieldValue,
    }),
  };

  return (
    <Box className={`${clsPrefix}`} py={2} minHeight={'50vh'}>
      <Container maxWidth="lg">
        <BreadcrumbsUserDetail isViewMode={isEditUserMode} />
        <Typography mt={2} variant="h2">
          {isEditUserMode ? 'Edit' : 'Add'} User
        </Typography>
        <Suspense fallback={<LoadingCommon />}>
          {!isCU(currentRole) ? (
            <Layout>
              <NoPermission />
            </Layout>
          ) : (
            <>
              <Layout>
                <GeneralInfo formikProps={formikProps} isLoading={loading} />
              </Layout>
              <Layout>
                <UserType
                  formikProps={formikProps}
                  isLoading={loading}
                  initialPIInfo={user?.fisPiInfo}
                />
              </Layout>
              <Layout>
                <InternalComments formikProps={formikProps} isLoading={loading} />
              </Layout>
              {isEditUserMode && (
                <Suspense fallback={<LoadingCommon />}>
                  <Accordion title="Audit Information" className="mt-16">
                    <AuditInformation
                      formikProps={formikProps}
                      userAuditTrails={user?.userAuditTrails || []}
                      isLoading={loading}
                    />
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
                    handleScrollToTopError();
                    handleSubmit();
                  }}
                  isLoading={loading}
                  disabled={loading}
                >
                  Save
                </Button>
              </Stack>
            </>
          )}
        </Suspense>
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({
  currentRole: state.auth.currentRole,
});

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
  onHideAllDialog: hideAllDialog,
  onSetCurrentRole: setCurrentRole,
};

const ConnectCRUUserContainer = connect(mapStateToProps, mapDispatchToProps)(CRUUserContainer);

const CRUUserContainerWrapper = () => {
  return (
    <CustomErrorBoundary fallback={<ErrorWrapperCRUUser />}>
      <ConnectCRUUserContainer />
    </CustomErrorBoundary>
  );
};

export default CRUUserContainerWrapper;
