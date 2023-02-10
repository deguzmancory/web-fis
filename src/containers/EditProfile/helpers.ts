import { MyProfile, UpdateProfilePayload } from 'src/queries';
import { ErrorService, Yup } from 'src/services';
import { getTitleCase } from 'src/utils';
import { isEmpty } from 'src/validations';
import {
  CRUUserFormValue,
  getPayloadDelegateAccess,
  getPayloadUserStatus,
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
    fisFaInfo: null, //TODO: huy_dang implement during tabs sections
    fisPiInfo: null, //TODO: huy_dang implement during tabs sections
    fisSuInfo: null, //TODO: huy_dang implement during tabs sections
  };

  delete payload.mode;
  delete payload.lastLoginDate;
  delete payload.passwordSetDate;
  delete payload.fullName;

  return payload;
};
