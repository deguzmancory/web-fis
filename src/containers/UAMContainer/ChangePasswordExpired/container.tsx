import React from 'react';
import { connect } from 'react-redux';
import { PATHS } from 'src/appConfig/paths';
import ChangePasswordExpired from 'src/containers/UAMContainer/ChangePasswordExpired';
import { useProfile } from 'src/queries';
import { showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { Navigator } from 'src/services';

const CheckPasswordExpiredContainer: React.FC<Props> = ({ onShowDialog }) => {
  const { profile } = useProfile();

  React.useEffect(() => {
    if (profile && profile.passwordResetRequired) {
      Navigator.navigate(PATHS.expiredPassword);
      onShowDialog({
        type: DIALOG_TYPES.CONTENT_DIALOG,
        data: {
          title: 'Change Password',
          content: <ChangePasswordExpired />,
          onCancel: () => {},
          hideCloseButton: true,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  return null;
};

type Props = typeof mapDispatchToProps & {};

const mapDispatchToProps = {
  onShowDialog: showDialog,
};

export default connect(undefined, mapDispatchToProps)(CheckPasswordExpiredContainer);
