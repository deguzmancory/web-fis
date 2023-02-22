import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'src/components/common';
import { useDeleteUser, useGetAllUsers } from 'src/queries/Users';
import { User } from 'src/queries/Users/types';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { Toastify } from 'src/services';
import { handleShowErrorMsg } from 'src/utils';

const ActionsButton: React.FC<Props> = ({ data, onShowDialog, onHideDialog }) => {
  const { handleInvalidateAllUser, isFetching } = useGetAllUsers();
  const { deleteUser, isLoading } = useDeleteUser({
    onSuccess() {
      Toastify.success(`${data.username} record Deleted.`);
      handleInvalidateAllUser();
    },
    onError(error, variables, context) {
      handleShowErrorMsg(error, 'Error when delete user');
    },
  });

  const handleDeleteUser = (user: User) => {
    onShowDialog({
      type: DIALOG_TYPES.YESNO_DIALOG,
      data: {
        title: `Delete user ${user.username}`,
        content: `You will not be able to recover this user. Are you sure you want to delete`,
        okText: 'Yes, delete',
        cancelText: 'Cancel',
        onOk: () => {
          deleteUser(user.id);
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
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleDeleteUser(data);
      }}
      disabled={isLoading || isFetching}
    >
      Delete
    </Button>
  );
};

type Props = typeof mapDispatchToProps & {
  data: User;
};

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(undefined, mapDispatchToProps)(ActionsButton);
