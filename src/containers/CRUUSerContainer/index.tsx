import { Box, Container, Stack, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import { Location } from 'history';
import { isEqual } from 'lodash';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import { Accordion, Button, LoadingCommon } from 'src/components/common';
import { useProfile } from 'src/queries';
import { ROLE_NAME, isCU } from 'src/queries/Profile/helpers';
import { useCreateUser, useGetAllUsers, useGetUser } from 'src/queries/Users';
import { useUpdateUser } from 'src/queries/Users/useUpdateUser';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, PermissionsService, Toastify, TokenService } from 'src/services';
import Prompt from 'src/services/Prompt';
import {
  deepKeys,
  getUncontrolledInputFieldProps,
  handleShowErrorMsg,
  scrollToTopError,
} from 'src/utils';
import { localTimeToHawaii } from 'src/utils/dayjsUtils';
import { isEmpty } from 'src/validations';
import SectionLayout from '../shared/SectionLayout';
import BreadcrumbsUserDetail from './breadcrumbs';
import { CRUUSER_KEY, USER_MODE } from './enums';
import ErrorWrapperCRUUser from './error';
import {
  CRUUserFormValue,
  CRUUserFormikProps,
  cRUUserFormSchema,
  formatPayloadAddNew,
  formatPayloadUpdate,
  getValueRoles,
  getValueUserStatus,
  initialCRUUserFormValue,
} from './helper';
import './styles.scss';

const AuditInformation = React.lazy(() => import('./AuditInformation'));
const UserType = React.lazy(() => import('./UserType'));
const InternalComments = React.lazy(() => import('./InternalComments'));
const GeneralInfo = React.lazy(() => import('./GeneralInfo'));
const NoPermission = React.lazy(() => import('src/components/NoPermission'));

const clsPrefix = 'ctn-cruuser';

const CRUUserContainer: React.FC<Props> = ({ currentRole }) => {
  const { userId } = useParams<{ userId: string }>();

  const isEditUserMode = React.useMemo(() => {
    return !isEmpty(userId);
  }, [userId]);

  const {
    user,
    isLoading: isLoadingGetUser,
    handleInvalidateUser,
  } = useGetUser({
    userId: userId || null,
    suspense: true,
  });

  const handleCancelButton = () => {
    Navigator.navigate(PATHS.userManagements);
  };

  const { handleInvalidateAllUser } = useGetAllUsers();
  const { mainProfile, handleInvalidateProfile, getMyProfile } = useProfile();
  const {
    createUser,
    isLoading: isLoadingCreateUser,
    isSuccess: successCreateUser,
  } = useCreateUser();

  React.useEffect(() => {
    if (successCreateUser) {
      Navigator.navigate(PATHS.userManagements);
    }
  }, [successCreateUser]);

  const { updateUser, isLoading: isLoadingUpdateUser } = useUpdateUser();

  const handleFormSubmit = (values: CRUUserFormValue) => {
    if (isEditUserMode) {
      const payload = formatPayloadUpdate(values, user);
      updateUser(payload, {
        onSuccess(_data, variables, _context) {
          Toastify.success(`Update User ${variables.username} successfully.`);
          handleInvalidateUser();
          handleInvalidateAllUser();
          window.scrollTo(0, 0);
          const isMyProfile = userId === mainProfile.id;
          if (isMyProfile) {
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
    } else {
      const payload = formatPayloadAddNew(values);
      createUser(payload, {
        onSuccess(_data, variables, _context) {
          Toastify.success(`Add User ${variables.username} successfully.`);
          handleInvalidateAllUser();
        },
        onError(error, _variables, _context) {
          if (error.message === 'An account with this username already existed.') {
            setFieldError(CRUUSER_KEY.USERNAME, 'The username specified already exists.');
            handleScrollToTopError();
          }
          handleShowErrorMsg(error);
        },
      });
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
        projectNumber: item.projectNumber || null,
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

      const isViewOnly = !PermissionsService.user().canUpdate && PermissionsService.user().canView;

      return {
        ...initialCRUUserFormValue,
        mode: USER_MODE.EDIT_USER,
        isViewOnly: isViewOnly,
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

  const isViewOnly = React.useMemo(() => {
    return values.isViewOnly;
  }, [values.isViewOnly]);

  const havePermissionCreate = React.useMemo(() => {
    return PermissionsService.user().canCreate;
  }, []);

  const blockCondition = (location: Location<string>) => {
    const equalValue = isEqual(initialFormValue, values);
    let condition: boolean;
    if (!successCreateUser && equalValue) {
      condition = false;
    } else if (successCreateUser) {
      condition = false;
    } else {
      condition = !location.pathname.includes(`${PATHS.userManagements}/`) && !equalValue;
    }

    return condition;
  };

  if ((!havePermissionCreate && !isEditUserMode) || !isCU(currentRole)) {
    return (
      <Box py={2} minHeight={'50vh'}>
        <Container>
          <SectionLayout>
            <NoPermission
              buttonLink={PATHS.userManagements}
              buttonTitle={`Go to Users Management`}
            />
          </SectionLayout>
        </Container>
      </Box>
    );
  }

  return (
    <Prompt
      title={'Leave site?'}
      message={'There are unsaved changes on the Form. Are you sure you want to leave this page?'}
      condition={blockCondition}
      cancelTitle="Attention"
      cancelMessage="Clicking this button will discard the mailing address changing request. Are you sure you want to proceed?"
      cancelOkText="Yes, leave"
      cancelText="No, stay"
    >
      <Box className={`${clsPrefix}`} py={2} minHeight={'50vh'}>
        <Container maxWidth="lg">
          <BreadcrumbsUserDetail isViewMode={isEditUserMode} />
          <Typography mt={2} variant="h2">
            {isEditUserMode ? 'Edit' : 'Add'} User
          </Typography>
          <Suspense fallback={<LoadingCommon />}>
            <SectionLayout>
              <GeneralInfo formikProps={formikProps} isLoading={loading || isViewOnly} />
            </SectionLayout>
            <SectionLayout>
              <UserType
                formikProps={formikProps}
                isLoading={loading}
                initialPIInfo={user?.fisPiInfo}
              />
            </SectionLayout>
            <SectionLayout>
              <InternalComments formikProps={formikProps} isLoading={loading || isViewOnly} />
            </SectionLayout>
            {isEditUserMode && (
              <Suspense fallback={<LoadingCommon />}>
                <Accordion title="Audit Information" className="mt-16">
                  <AuditInformation
                    formikProps={formikProps}
                    userAuditTrails={user?.userAuditTrails || []}
                    isLoading={loading || isViewOnly}
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
                disabled={loading || isViewOnly}
              >
                Save
              </Button>
            </Stack>
          </Suspense>
        </Container>
      </Box>
    </Prompt>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({
  currentRole: state.auth.currentRole,
});

const mapDispatchToProps = {};

const ConnectCRUUserContainer = connect(mapStateToProps, mapDispatchToProps)(CRUUserContainer);

const CRUUserContainerWrapper = () => {
  return (
    <CustomErrorBoundary FallbackComponent={(props) => <ErrorWrapperCRUUser {...props} />}>
      <ConnectCRUUserContainer />
    </CustomErrorBoundary>
  );
};

export default CRUUserContainerWrapper;
