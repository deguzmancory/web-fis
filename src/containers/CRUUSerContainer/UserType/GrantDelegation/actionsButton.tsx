import { Check, Close, Create, Delete } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { CRUUSER_KEY } from '../../enums';
import { CRUUserFormikProps } from '../../helper';

const ActionsButton: React.FC<Props> = ({
  data,
  onShowDialog,
  onHideDialog,
  rowIndex,
  formikProps,
  fieldName = CRUUSER_KEY.DELEGATE_ACCESS,
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
            ...values.delegateAccess.slice(0, rowIndex),
            ...values.delegateAccess.slice(rowIndex + 1, values.delegateAccess.length),
          ];
          setFieldValue(fieldName, newRows);
        },
        onCancel: () => {
          onHideDialog();
        },
      },
    });
  };

  const updateRows = (rows, rowIndex, data) =>
    rows.map((row, index) => {
      return rowIndex === index
        ? {
            ...row,
            isEdit: data.isEdit !== undefined ? data.isEdit : row.isEdit,
            startDate: data.startDate !== undefined ? data.startDate : row.startDate,
            endDate: data.endDate !== undefined ? data.endDate : row.endDate,
            startDateTemp:
              data.startDateTemp !== undefined ? data.startDateTemp : row.startDateTemp,
            endDateTemp: data.endDateTemp !== undefined ? data.endDateTemp : row.endDateTemp,
          }
        : row;
    });

  const handleEditRow = () => {
    setFieldValue(
      fieldName,
      updateRows(values.delegateAccess, rowIndex, {
        isEdit: true,
        startDateTemp: data.startDate,
        endDateTemp: data.endDate,
      })
    );
  };

  const handleCancelEditRow = () => {
    setFieldValue(
      fieldName,
      updateRows(values.delegateAccess, rowIndex, {
        isEdit: false,
        startDateTemp: null,
        endDateTemp: null,
      })
    );
  };

  const handleConfirmEdit = () => {
    setFieldValue(
      fieldName,
      updateRows(values.delegateAccess, rowIndex, {
        isEdit: false,
        startDate: data.startDateTemp,
        endDate: data.endDateTemp,
      })
    );
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
              handleCancelEditRow();
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
              handleEditRow();
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
