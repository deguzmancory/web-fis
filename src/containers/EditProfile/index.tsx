import { Box, Container, Stack, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import { Suspense, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import { PATHS } from 'src/appConfig/paths';
import { Accordion, Button, LoadingCommon } from 'src/components/common';
import { useMyPermissions, useProfile } from 'src/queries';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { useUpdateProfile } from 'src/queries/Profile/useUpdateProfile';
import { setCurrentRole } from 'src/redux/auth/authSlice';
import { hideAllDialog, hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { IRootState } from 'src/redux/store';
import { Navigator, RoleService, Toastify } from 'src/services';
import {
  deepKeys,
  getUncontrolledInputFieldProps,
  handleShowErrorMsg,
  scrollToTopError,
} from 'src/utils';
import { localTimeToHawaii } from 'src/utils/momentUtils';
import AuditInformation from '../CRUUSerContainer/AuditInformation';
import { CRUUSER_KEY, USER_MODE } from '../CRUUSerContainer/enums';
import GeneralInfo from '../CRUUSerContainer/GeneralInfo';
import {
  CRUUserFormikProps,
  CRUUserFormValue,
  getValueRoles,
  getValueUserStatus,
  initialCRUUserFormValue,
} from '../CRUUSerContainer/helper';
import InternalComments from '../CRUUSerContainer/InternalComments';
import Layout from '../CRUUSerContainer/layout';
import UserType from '../CRUUSerContainer/UserType';
import BreadcrumbsEditProfile from './breadcrumbs';
import { editProfileFormSchema, formatEditProfilePayload } from './helpers';

const EditProfile: React.FC<Props> = ({
  onShowDialog,
  onHideDialog,
  onHideAllDialog,
  onSetCurrentRole,
}) => {
  const { profile, handleInvalidateProfile } = useProfile();
  const { myPermissions } = useMyPermissions();
  const formRef = useRef<FormikProps<CRUUserFormValue>>(null);
  const { isLoading: loading, updateProfile } = useUpdateProfile({
    onSuccess(_data, variables, _context) {
      const updatedDefaultRole = variables.defaultUserType as ROLE_NAME;

      Toastify.success(`Profile updated successfully.`);
      RoleService.setCurrentRole(updatedDefaultRole);
      onSetCurrentRole(updatedDefaultRole);
      handleInvalidateProfile();
      window.scrollTo(0, 0);
    },
    onError(error, _variables, _context) {
      if (error.message?.includes('Current password is incorrect')) {
        setFieldError(CRUUSER_KEY.CURRENT_PASSWORD, 'Current password is incorrect');
        window.scrollTo(0, 0);
      } else {
        handleShowErrorMsg(error);
      }
    },
  });
  const initialFormValue = useMemo(() => {
    const delegateAccess = profile.delegateAccesses?.map((item) => ({
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
      id: item.id || '',
    }));

    const fisFaInfo = profile.fisFaInfo ?? initialCRUUserFormValue.fisFaInfo;
    const fisSuInfo = profile.fisSuInfo ?? initialCRUUserFormValue.fisSuInfo;

    // PI section doesn't have userFisCodes => create an local property for reuseable purpose
    const fisPiInfo = profile.fisPiInfo
      ? {
          ...profile.fisPiInfo,
          profileFisCodes: profile.fisPiInfo.piCode
            ? [{ code: profile.fisPiInfo.piCode, codeType: ROLE_NAME.PI }]
            : [],
        }
      : initialCRUUserFormValue.fisPiInfo;

    return {
      ...initialCRUUserFormValue,
      mode: USER_MODE.EDIT_PROFILE,
      firstName: profile.firstName,
      lastName: profile.lastName,
      middleName: profile.middleName || '',
      defaultUserType: profile.defaultUserType,
      username: profile.username,
      email: profile.email,
      lastLoginDate: localTimeToHawaii(profile.lastLoginDate) || '',
      passwordSetDate: localTimeToHawaii(profile.passwordSetDate) || '',
      status: getValueUserStatus(profile.status),
      roles: getValueRoles(profile.roles),
      comments: profile.comments,
      delegateAccess: delegateAccess,
      delegatedAccess: profile.delegatedAccesses,
      fisFaInfo: { ...fisFaInfo, currentFACode: null, currentSearchProject: null },
      fisPiInfo: { ...fisPiInfo, useExistingPICode: false, currentSearchProject: null },
      fisSuInfo: { ...fisSuInfo, currentPICode: null, currentSearchProject: null },
      permissions: myPermissions?.map((permission) => ({
        permissionId: permission.id,
      })),
    };
  }, [profile, myPermissions]);

  const handleFormSubmit = (values: CRUUserFormValue) => {
    const payload = formatEditProfilePayload(values, profile);

    updateProfile(payload);
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
    validationSchema: editProfileFormSchema,
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

  const handleScrollToTopError = () => {
    return setTimeout(() => {
      scrollToTopError(deepKeys(errors));
    }, 100);
  };

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
            Navigator.navigate(PATHS.dashboard);
          }, 50);
        },
        onCancel: () => {
          onHideAllDialog();
        },
      },
    });
  };

  return (
    <Box py={2} minHeight={'50vh'}>
      <Container maxWidth="lg">
        <BreadcrumbsEditProfile />
        <Typography mt={2} variant="h2">
          Edit My Profile
        </Typography>

        <Suspense fallback={<LoadingCommon />}>
          <Layout>
            <GeneralInfo formikProps={formikProps} isLoading={loading} />
          </Layout>
          <Layout>
            <UserType
              initialPIInfo={profile.fisPiInfo}
              formikProps={formikProps}
              isLoading={loading}
            />
          </Layout>
          <Layout>
            <InternalComments formikProps={formikProps} isLoading={loading} />
          </Layout>
          <Suspense fallback={<LoadingCommon />}>
            <Accordion title="Audit Information" className="mt-16">
              <AuditInformation
                formikProps={formikProps}
                userAuditTrails={profile?.userAuditTrails || []}
                isLoading={loading}
              />
            </Accordion>
          </Suspense>

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
        </Suspense>
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
  onSetCurrentRole: setCurrentRole,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
