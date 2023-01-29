import { Close } from '@mui/icons-material';
import { IconButton, Snackbar } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { FaDownload } from 'react-icons/fa';
import { Button, LoadingCommon } from 'src/components/common';
import { useGetUrlExportUsers } from 'src/queries/Users';
import { pollAndDownloadFile, Toastify } from 'src/services';
import { DateFormat } from 'src/utils/momentUtils';
import { handleShowErrorMsg } from '../helpers';

const DownloadAllUsers: React.FC<Props> = ({ isLoading }) => {
  const [isOpenSnackbar, setIsOpenSnackbar] = React.useState(false);

  const { getUrlExportUsers, isLoading: loading } = useGetUrlExportUsers({
    onSuccess(data) {
      pollAndDownloadFile({
        get: data.get,
        head: data.head,
        fileName: `Users_${dayjs().format(DateFormat)}.csv`,
        fileType: `text/csv`,
        onSuccess: () => {
          Toastify.success('Download All Users successfully');
        },
        onError: () => {
          Toastify.error('Failed when Download All Users. Please try again');
          setIsOpenSnackbar(false);
        },
      });
    },
    onError(err) {
      handleShowErrorMsg(err);
      setIsOpenSnackbar(false);
    },
  });

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsOpenSnackbar(false);
  };

  return (
    <>
      <Button
        variant="link"
        icon={<FaDownload />}
        onClick={() => {
          setIsOpenSnackbar(true);
          getUrlExportUsers('');
        }}
        disabled={isLoading || loading}
      >
        Download All Users
      </Button>
      <Snackbar
        open={isOpenSnackbar}
        onClose={handleCloseSnackbar}
        message="Downloading..."
        action={
          <>
            <LoadingCommon />
            <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
              <Close />
            </IconButton>
          </>
        }
      />
    </>
  );
};

type Props = {
  isLoading: boolean;
};

export default DownloadAllUsers;
