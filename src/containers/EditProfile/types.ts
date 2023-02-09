import { CommonFormikProps } from 'src/utils/commonTypes';
import { CRUUserFormValue } from '../CRUUSerContainer/helper';

export interface EditProfileFormValue extends CRUUserFormValue {
  currentPassword: string;
  newPassword: string;
}

export type EditProfileFormikProps = CommonFormikProps<EditProfileFormValue>;
