import { Check, Close, Create, Delete } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { Callback } from 'src/redux/types';

const ActionsButton: React.FC<Props> = ({
  data,

  onShowDialog,
  onHideDialog,
  setRows,
  rowIndex,
}) => {
  const handleDeleteRow = () => {
    onShowDialog({
      type: DIALOG_TYPES.YESNO_DIALOG,
      data: {
        title: `Delete`,
        content: `You will not be able to recover this user. Are you sure you want to delete`,
        okText: 'Yes, delete',
        cancelText: 'Cancel',
        onOk: () => {
          onHideDialog();
          setRows((prevRows) => {
            return [
              ...prevRows.slice(0, rowIndex),
              ...prevRows.slice(rowIndex + 1, prevRows.length),
            ];
          });
        },
        onCancel: () => {
          onHideDialog();
        },
      },
    });
  };

  const handleChangeEditRow = (isEdit: boolean) => {
    setRows((prevRows) => {
      return prevRows.map((row, index) => {
        return rowIndex === index
          ? {
              ...row,
              isEdit: isEdit,
            }
          : row;
      });
    });
  };

  const handleConfirmEdit = () => {
    setRows((prevRows) => {
      return prevRows.map((row, index) => {
        return rowIndex === index
          ? {
              ...row,
              isEdit: false,
              startDate: data.startDateTemp,
              endDate: data.endDateTemp,
            }
          : row;
      });
    });
  };

  return (
    <Stack flexDirection={'row'} justifyContent="flex-end">
      {data.isEdit ? (
        <>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleConfirmEdit();
            }}
            sx={{
              p: 0,
              mr: 1,
            }}
          >
            <Check color="success" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleChangeEditRow(false);
            }}
            sx={{
              p: 0,
            }}
          >
            <Close color="error" />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleChangeEditRow(true);
            }}
            sx={{
              p: 0,
              mr: 1,
            }}
          >
            <Create />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleDeleteRow();
            }}
            sx={{
              p: 0,
            }}
          >
            <Delete />
          </IconButton>
        </>
      )}
    </Stack>
  );
};

type Props = typeof mapDispatchToProps & {
  data: any;
  setRows: Callback;
  rowIndex: number;
};

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(undefined, mapDispatchToProps)(ActionsButton);
