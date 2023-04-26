import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { PATHS } from 'src/appConfig/paths';
import { Button } from 'src/components/common';
import { PO_ALL_FORM_DOCUMENT_TYPE } from 'src/containers/POListing/TableList/CustomSearch/SearchApproved/helpers';
import { PURCHASING_LIST_WORK_FLOW_STATUS_KEY } from 'src/containers/POListing/enum';
import { useDeletePO } from 'src/queries/PurchaseOrders/useDeletePO';
import { hideDialog } from 'src/redux/dialog/dialogSlice';
import { setFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Callback } from 'src/redux/types';
import { Navigator, Toastify } from 'src/services';
import { handleShowErrorMsg } from 'src/utils';

const DeletePOWarning: React.FC<Props> = ({
  formData,
  id,
  onDelete,
  onHideDialog,
  onSetFormData,
}) => {
  const { deletePO, isLoading: isLoadingDeletePO } = useDeletePO({
    onSuccess() {
      Toastify.success(`PO record Deleted.`);
      onHideDialog();
      if (formData.documentType === PO_ALL_FORM_DOCUMENT_TYPE.PO_CHANGE) {
        Navigator.navigate(
          `${PATHS.purchasingOrders}?workflowStatus=${PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PO_CHANGE}`
        );
      } else {
        Navigator.navigate(PATHS.dashboard);
      }
      onSetFormData(null);
    },
    onError(error, _variables, _context) {
      handleShowErrorMsg(error, 'Error when delete PO');
    },
  });

  const handleDeletePO = () => {
    deletePO({ id: id });
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Box>
      <Typography>
        Are you sure you want to delete? You will not be able to recover this document.
      </Typography>

      <Stack direction={'row'} justifyContent="flex-end" mt={3}>
        <Button
          variant="outline"
          className="mr-16"
          onClick={() => onHideDialog()}
          disabled={isLoadingDeletePO}
        >
          Cancel
        </Button>
        <Button isLoading={isLoadingDeletePO} disabled={isLoadingDeletePO} onClick={handleDeletePO}>
          Yes, delete it
        </Button>
      </Stack>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    id: string;
    onDelete?: Callback;
  };

const mapStateToProps = (state: IRootState<any>) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onHideDialog: hideDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeletePOWarning);
