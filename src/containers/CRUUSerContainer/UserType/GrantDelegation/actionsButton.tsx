import { Check, Close, Create, Delete } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { Callback } from 'src/redux/types';
import { CRUUserFormikProps, CRUUSER_KEY } from '../../helper';

const ActionsButton: React.FC<Props> = ({
  data,
  onShowDialog,
  onHideDialog,
  setRows,
  rowIndex,
  formikProps,
}) => {
  const { setFieldValue } = formikProps;

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
            const newRows = [
              ...prevRows.slice(0, rowIndex),
              ...prevRows.slice(rowIndex + 1, prevRows.length),
            ];
            setFieldValue(CRUUSER_KEY.DELEGATE_ACCESS, newRows);
            return newRows;
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
      const formattedRows = prevRows.map((row, index) => {
        return rowIndex === index
          ? {
              ...row,
              isEdit: false,
              startDate: data.startDateTemp,
              endDate: data.endDateTemp,
            }
          : row;
      });
      setFieldValue(CRUUSER_KEY.DELEGATE_ACCESS, formattedRows);
      return formattedRows;
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
  formikProps: CRUUserFormikProps;
};

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(undefined, mapDispatchToProps)(ActionsButton);
