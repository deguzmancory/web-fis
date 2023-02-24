import { MyProfile, UpdateProfilePayload } from 'src/queries';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { ErrorService, Yup } from 'src/services';
import { getTitleCase } from 'src/utils';
import { isEmpty } from 'src/validations';
import {
  CRUUserFormValue,
  getFisInfoByRole,
  getPayloadDelegateAccess,
  getPayloadUserStatus,
  getShareUserTypeDetailsPayload,
  sharedUserDetailFormSchema,
} from '../CRUUSerContainer/helper';

export const editProfileFormSchema = Yup.object().shape(
  {
    // General Info
    firstName: Yup.string().letterOnly().max(100).notTrimmable().required(),
    lastName: Yup.string().letterOnly().max(100).notTrimmable().required(),
    middleName: Yup.string().letterOnly().notTrimmable().max(5),
    defaultUserType: Yup.string().required().typeError('Please select at least 1 user type'),
    username: Yup.string().username().required(),
    email: Yup.string().notTrimmable().email().required(),
    lastLoginDate: Yup.string().notRequired(),
    passwordSetDate: Yup.string().notRequired(),
    currentPassword: Yup.string().when('newPassword', {
      is: (newPassword) => !isEmpty(newPassword),
      then: Yup.string().required(),
      otherwise: Yup.string().notRequired(),
    }),
    newPassword: Yup.string().when(
      ['currentPassword', 'newPassword'],
      (currentPassword, newPassword) => {
        if (!isEmpty(currentPassword) || !isEmpty(newPassword)) {
          return Yup.string()
            .password()
            .required()
            .test(
              'match-current-password',
              'New Password must be different from Current Password.',
              () => {
                return newPassword !== currentPassword;
              }
            );
        }

        return Yup.string().notRequired();
      }
    ),

    // UserType
    roles: Yup.array()
      .of(Yup.string().required().typeError(ErrorService.MESSAGES.required))
      .min(1, 'Please select at least 1 user type'),

    fisFaInfo: Yup.object().shape({
      ...sharedUserDetailFormSchema,
      faCode: Yup.string().nullable().optional(),
    }),
    fisPiInfo: Yup.object().shape({
      ...sharedUserDetailFormSchema,
      piCode: Yup.string().nullable().optional(),
      directInquiriesTo: Yup.string().nullable().optional(),
      phoneNumber: Yup.string().nullable().optional(),
      faStaffToReview: Yup.string().nullable().optional(),
    }),
    fisSuInfo: Yup.object().shape({
      ...sharedUserDetailFormSchema,
      directInquiriesTo: Yup.string().nullable().optional(),
      phoneNumber: Yup.string().nullable().optional(),
      faStaffToReview: Yup.string().nullable().optional(),
    }),

    // Comments
    comment: Yup.string().nullable(),
  },
  [
    ['newPassword', 'newPassword'],
    ['currentPassword', 'newPassword'],
  ]
);

export const formatEditProfilePayload = (
  values: CRUUserFormValue,
  profile: MyProfile
): UpdateProfilePayload => {
  const payload = {
    ...values,
    id: profile.id,
    username: values.username.toLowerCase(),
    firstName: getTitleCase(values.firstName),
    lastName: getTitleCase(values.lastName),
    middleName: getTitleCase(values.middleName),
    fullName: profile.fullName,
    allowMaintenanceModeLogin: profile.allowMaintenanceModeLogin,
    isDhUser: values.email.includes('datahouse.com') ? true : false,
    status: getPayloadUserStatus(values.status),
    delegateAccess: getPayloadDelegateAccess(values.delegateAccess),
    newPassword: values.newPassword || undefined,
    currentPassword: values.currentPassword || undefined,
    fisFaInfo: getFisInfoByRole({
      currentRole: ROLE_NAME.FA,
      userRoles: values.roles,
      payload: {
        ...getShareUserTypeDetailsPayload({ fisInfo: values.fisFaInfo }),
        faCode: undefined, //TODO: check
      },
    }),
    fisPiInfo: getFisInfoByRole({
      currentRole: ROLE_NAME.PI,
      userRoles: values.roles,
      payload: {
        ...getShareUserTypeDetailsPayload({ fisInfo: values.fisPiInfo, ignoreFisCodes: true }),
        piCode: values.fisPiInfo.piCode,
        directInquiriesTo: values.fisPiInfo.directInquiriesTo,
        phoneNumber: values.fisPiInfo.phoneNumber,
        faStaffToReview: values.fisPiInfo.faStaffToReview,
      },
    }),
    fisSuInfo: getFisInfoByRole({
      currentRole: ROLE_NAME.SU,
      userRoles: values.roles,
      payload: {
        ...getShareUserTypeDetailsPayload({ fisInfo: values.fisSuInfo }),
        directInquiriesTo: values.fisSuInfo.directInquiriesTo,
        phoneNumber: values.fisSuInfo.phoneNumber,
        faStaffToReview: values.fisSuInfo.faStaffToReview,
      },
    }),
  };

  delete payload.mode;
  delete payload.lastLoginDate;
  delete payload.passwordSetDate;
  delete payload.fullName;

  return payload;
};
