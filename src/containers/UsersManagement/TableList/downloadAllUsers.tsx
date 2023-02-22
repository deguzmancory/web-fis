import { Snackbar } from '@mui/material';
import React from 'react';
import { FaDownload } from 'react-icons/fa';
import { Button, LoadingCommon } from 'src/components/common';
import { useGetUrlExportUsers } from 'src/queries/Users';
import { pollAndDownloadFile, Toastify } from 'src/services';
import { handleShowErrorMsg } from 'src/utils';
import { DateFormatDisplayShort, localTimeToHawaii } from 'src/utils/momentUtils';

const DownloadAllUsers: React.FC<Props> = ({ isLoading }) => {
  const [isOpenSnackbar, setIsOpenSnackbar] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [status, setStatus] = React.useState<'Fetching' | 'Downloading' | ''>('');

  const { getUrlExportUsers, isLoading: loading } = useGetUrlExportUsers({
    onSuccess(data) {
      setIsDownloading(true);
      setStatus('Downloading');

      const response = data.data.data;
      pollAndDownloadFile({
        get: response.get,
        head: response.head,
        fileName: `Users_${localTimeToHawaii(new Date(), DateFormatDisplayShort)}.csv`,
        fileType: `text/csv`,
        onSuccess: () => {
          setIsOpenSnackbar(false);
          setIsDownloading(false);
          setStatus('');
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
    setStatus('');
  };

  return (
    <>
      <Button
        variant="link"
        icon={<FaDownload />}
        onClick={() => {
          setIsOpenSnackbar(true);
          getUrlExportUsers('');
          setStatus('Fetching');
        }}
        disabled={isLoading || loading || isDownloading}
      >
        Download All Users
      </Button>
      <Snackbar
        open={isOpenSnackbar}
        onClose={handleCloseSnackbar}
        message={`${status}...`}
        action={
          <>
            <LoadingCommon />
            {/* <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
              <Close />
            </IconButton> */}
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
