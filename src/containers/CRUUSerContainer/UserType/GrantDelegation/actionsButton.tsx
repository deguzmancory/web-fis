import { Check, Close, Create, Delete } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { CRUUserFormikProps, CRUUSER_KEY } from '../../helper';

const ActionsButton: React.FC<Props> = ({
  data,
  onShowDialog,
  onHideDialog,
  rowIndex,
  formikProps,
  fieldName = CRUUSER_KEY.TEMP_DELEGATE_ACCESS,
}) => {
  const { setFieldValue, values } = formikProps;

  const handleDeleteRow = () => {
    onShowDialog({
      type: DIALOG_TYPES.YESNO_DIALOG,
      data: {
        title: `Remove`,
        content: `Remove this delegate’s access to the project(s)?`,
        okText: 'Remove',
        cancelText: 'Cancel',
        onOk: () => {
          onHideDialog();
          const newRows = [
            ...values.tempDelegateAccess.slice(0, rowIndex),
            ...values.tempDelegateAccess.slice(rowIndex + 1, values.tempDelegateAccess.length),
          ];
          setFieldValue(CRUUSER_KEY.DELEGATE_ACCESS, newRows);
          setFieldValue(fieldName, newRows);
        },
        onCancel: () => {
          onHideDialog();
        },
      },
    });
  };

  const handleChangeEditRow = (isEdit: boolean) => {
    const rows = values.tempDelegateAccess.map((row, index) => {
      return rowIndex === index
        ? {
            ...row,
            isEdit: isEdit,
          }
        : {
            ...row,
            isEdit: false,
          };
    });
    setFieldValue(fieldName, rows);
  };

  const handleConfirmEdit = () => {
    const newRows = values.tempDelegateAccess.map((row, index) => {
      return rowIndex === index
        ? {
            ...row,
            isEdit: false,
            startDate: data.startDateTemp,
            endDate: data.endDateTemp,
          }
        : row;
    });
    setFieldValue(CRUUSER_KEY.DELEGATE_ACCESS, newRows);
    setFieldValue(fieldName, newRows);
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
  rowIndex: number;
  formikProps: CRUUserFormikProps;
  fieldName?: CRUUSER_KEY;
};

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(undefined, mapDispatchToProps)(ActionsButton);
