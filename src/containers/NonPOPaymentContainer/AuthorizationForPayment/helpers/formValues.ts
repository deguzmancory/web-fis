import { MyProfile } from 'src/queries';
import { DateFormat, localTimeToHawaii } from 'src/utils';
import { UpsertAuthorizationFormValue } from '../types';
import { emptyUpsertAuthorizationFormValue } from './constants';

export const getInitialAuthorizationFormValue = ({
  profile,
}: {
  profile: MyProfile;
}): UpsertAuthorizationFormValue => {
  return {
    ...emptyUpsertAuthorizationFormValue,
    loginName: profile.username,
    date: localTimeToHawaii(new Date(), DateFormat),
  };
};
