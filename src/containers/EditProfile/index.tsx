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
import { Navigator, Toastify } from 'src/services';
import {
  deepKeys,
  getUncontrolledInputFieldProps,
  handleShowErrorMsg,
  scrollToTopError,
} from 'src/utils';
import { localTimeToHawaii } from 'src/utils/momentUtils';
import AuditInformation from '../CRUUSerContainer/AuditInformation';
import GeneralInfo from '../CRUUSerContainer/GeneralInfo';
import InternalComments from '../CRUUSerContainer/InternalComments';
import UserType from '../CRUUSerContainer/UserType';
import { CRUUSER_KEY, USER_MODE } from '../CRUUSerContainer/enums';
import {
  CRUUserFormValue,
  CRUUserFormikProps,
  getValueRoles,
  getValueUserStatus,
  initialCRUUserFormValue,
} from '../CRUUSerContainer/helper';
import SectionLayout from '../shared/SectionLayout';
import BreadcrumbsEditProfile from './breadcrumbs';
import { editProfileFormSchema, formatEditProfilePayload } from './helpers';

const EditProfile: React.FC<Props> = ({
  onShowDialog,
  onHideDialog,
  onHideAllDialog,
  onSetCurrentRole,
}) => {
  const { mainProfile, handleInvalidateProfile, getMyProfile } = useProfile();
  const { myPermissions } = useMyPermissions();
  const formRef = useRef<FormikProps<CRUUserFormValue>>(null);
  const { isLoading: loading, updateProfile } = useUpdateProfile({
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
    const delegateAccess = mainProfile.delegateAccesses?.map((item) => ({
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
      id: item.id || '',
    }));

    const fisFaInfo = mainProfile.fisFaInfo ?? initialCRUUserFormValue.fisFaInfo;
    const fisSuInfo = mainProfile.fisSuInfo ?? initialCRUUserFormValue.fisSuInfo;

    // PI section doesn't have userFisCodes => create an local property for reuseable purpose
    const fisPiInfo = mainProfile.fisPiInfo
      ? {
          ...mainProfile.fisPiInfo,
          userFisCodes: mainProfile.fisPiInfo.piCode
            ? [{ code: mainProfile.fisPiInfo.piCode, codeType: ROLE_NAME.PI }]
            : [],
        }
      : initialCRUUserFormValue.fisPiInfo;

    return {
      ...initialCRUUserFormValue,
      mode: USER_MODE.EDIT_PROFILE,
      firstName: mainProfile.firstName,
      lastName: mainProfile.lastName,
      middleName: mainProfile.middleName || '',
      defaultUserType: mainProfile.defaultUserType,
      username: mainProfile.username,
      email: mainProfile.email,
      lastLoginDate: localTimeToHawaii(mainProfile.lastLoginDate) || '',
      passwordSetDate: localTimeToHawaii(mainProfile.passwordSetDate) || '',
      status: getValueUserStatus(mainProfile.status),
      roles: getValueRoles(mainProfile.roles),
      comments: mainProfile.comments,
      delegateAccess: delegateAccess,
      delegatedAccess: mainProfile.delegatedAccesses,
      fisFaInfo: { ...fisFaInfo, currentFACode: null, currentSearchProject: null },
      fisPiInfo: { ...fisPiInfo, useExistingPICode: false, currentSearchProject: null },
      fisSuInfo: { ...fisSuInfo, currentPICode: null, currentSearchProject: null },
      permissions: myPermissions?.map((permission) => ({
        permissionId: permission.id,
      })),
    };
  }, [mainProfile, myPermissions]);

  const handleFormSubmit = (values: CRUUserFormValue) => {
    const payload = formatEditProfilePayload(values, mainProfile);

    updateProfile(payload, {
      onSuccess(_data, _variables, _context) {
        Toastify.success(`Profile updated successfully.`);
        handleInvalidateProfile();
        getMyProfile();
        window.scrollTo(0, 0);
      },
    });
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
          <SectionLayout>
            <GeneralInfo formikProps={formikProps} isLoading={loading} />
          </SectionLayout>
          <SectionLayout>
            <UserType
              initialPIInfo={mainProfile.fisPiInfo}
              formikProps={formikProps}
              isLoading={loading}
            />
          </SectionLayout>
          <SectionLayout>
            <InternalComments formikProps={formikProps} isLoading={loading} />
          </SectionLayout>
          <Suspense fallback={<LoadingCommon />}>
            <Accordion title="Audit Information" className="mt-16">
              <AuditInformation
                formikProps={formikProps}
                userAuditTrails={mainProfile?.userAuditTrails || []}
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
