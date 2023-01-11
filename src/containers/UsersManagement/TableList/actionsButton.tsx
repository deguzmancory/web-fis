import React from 'react';
import { Button } from 'src/components/common';
import { User } from 'src/queries/Users/types';
import { Toastify } from 'src/services';
import { connect } from 'react-redux';
import { IRootState } from 'src/redux/rootReducer';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';

const ActionsButton: React.FC<Props> = ({ data, onShowDialog, onHideDialog }) => {
  console.log('data: ', data);

  const handleDeleteUser = (user: User) => {
    onShowDialog({
      type: DIALOG_TYPES.YESNO_DIALOG,
      data: {
        title: `Delete user ${user.username}(${user.fullName})`,
        content: `You will not be able to recover this user. Are you sure you want to delete`,
        okText: 'Yes, delete',
        cancelText: 'Cancel',
        onOk: () => {
          Toastify.success(`onYes Delete ${user.username} clicked!`);
          onHideDialog();
        },
        onCancel: () => {
          onHideDialog();
        },
      },
    });
  };

  return (
    <Button
      variant="link-danger"
      fontWeightNormal
      onClick={() => {
        handleDeleteUser(data);
      }}
    >
      Delete
    </Button>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    data: User;
  };

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionsButton);
