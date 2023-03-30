import {
  Box,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ACCEPT_FILE_TYPE, COLOR_CODE } from 'src/appConfig/constants';
import CircularProgressWithLabel from 'src/components/CircularProgressWithLabel';
import { Accordion, Button, FileUpload, TextareaAutosize } from 'src/components/common';
import { StyledTableCell, StyledTableRow } from 'src/components/CustomTable';
import FilePreview from 'src/components/FilePreview';
import { VendorRegistrationAttachment } from 'src/queries';
import { useAddVendorRegistrationAttachment } from 'src/queries/Vendors/useAddVendorRegistrationAttachment';
import { useDeleteVendorRegistrationAttachment } from 'src/queries/Vendors/useDeleteVendorRegistrationAttachment';
import { useUploadVendorRegistrationFileAttachment } from 'src/queries/Vendors/useUploadVendorRegistrationFileAttachment';
import { hideAllDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { Toastify } from 'src/services';
import {
  DateFormatDisplayMinute,
  handleShowErrorMsg,
  isEqualPrevAndNextFormikValues,
  niceBytes,
  trimUrl,
} from 'src/utils';
import { localTimeToHawaii } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import { VENDOR_REGISTRATION_FORM_KEY } from '../enums';
import { VendorRegistrationFormikProps } from '../types';
import DecodeFilePreview from './filePreview';

const FileAttachments: React.FC<Props> = ({
  formikProps,
  disabled = false,
  vendorRegistrationId,
}) => {
  const { fileAttachments } = formikProps.values;
  const { setFieldValue } = formikProps;
  const dispatch = useDispatch();
  const attachments = React.useMemo(() => {
    if (isEmpty(fileAttachments)) return [];

    return fileAttachments.slice().sort((cur, next) => {
      return cur.createdAt < next.createdAt ? 1 : -1;
    });
  }, [fileAttachments]);

  const [fileSelected, setFileSelected] = React.useState<{
    file: File;
    descriptions: string;
    size: string;
    // isArtifact: boolean;
  }>(null);

  const allowUploadFile = !disabled;
  const allowRemoveFile = !disabled;
  const defaultExpandedAccordion = !isEmpty(attachments);

  const handleFileSelect = (files: File[]) => {
    if (isEmpty(files)) {
      Toastify.warning('Please select a file');
      return;
    }
    setFileSelected((prevFile) => ({
      ...prevFile,
      file: files[0],
      size: niceBytes(files[0].size),
      isArtifact: true, //TODO: should check this value
    }));
  };

  const [uploadProgress, setUploadProgress] = React.useState(0);

  const { getPresignedUploadUrl, loading: isLoadingGetPresignedUrl } =
    useUploadVendorRegistrationFileAttachment({
      onUploadSuccess(data, variables, context) {
        addVendorRegistrationAttachment({
          id: vendorRegistrationId,
          name: fileSelected.file.name,
          size: fileSelected.size,
          description: fileSelected.descriptions,
          url: trimUrl(variables?.url),
        });
      },
      onError(error) {
        handleShowErrorMsg(error);
      },
      setProgress: setUploadProgress,
      id: vendorRegistrationId,
    });

  const { addVendorRegistrationAttachment, isLoading: isLoadingAddVendorRegistrationAttachment } =
    useAddVendorRegistrationAttachment({
      onSuccess({ data }) {
        Toastify.success('Upload file attachment successfully');

        setUploadProgress(0);
        setFileSelected(null);

        setFieldValue(VENDOR_REGISTRATION_FORM_KEY.FILE_ATTACHMENTS, [...fileAttachments, data]);
      },
      onError(error) {
        handleShowErrorMsg(error);
      },
    });

  const handleUploadFile = () => {
    if (!fileSelected) {
      Toastify.warning('Please select a file');
      return;
    }
    getPresignedUploadUrl(fileSelected.file);
  };

  const { deleteVendorRegistrationAttachment, isLoading } = useDeleteVendorRegistrationAttachment({
    onError(error) {
      handleShowErrorMsg(error);
    },
  });

  const getFileName = (fileName: string) => {
    return `${fileName.slice(0, 12)}...${fileName.slice(-5)}`;
  };

  const handleDeleteAttachment = (attachment: VendorRegistrationAttachment) => {
    dispatch(
      showDialog({
        type: DIALOG_TYPES.YESNO_DIALOG,
        data: {
          title: `Remove Attachment`,
          content: `Are you sure you want to delete this File: ${getFileName(attachment.name)} ${
            attachment.description ? `- ${attachment.description}` : ''
          }?`,
          okText: 'Yes, delete it',
          cancelText: 'Cancel',
          onOk: () => {
            deleteVendorRegistrationAttachment(
              {
                id: vendorRegistrationId,
                attachmentId: attachment.id,
              },
              {
                onSuccess() {
                  Toastify.success('Delete file attachment successfully');
                  setFieldValue(
                    VENDOR_REGISTRATION_FORM_KEY.FILE_ATTACHMENTS,
                    fileAttachments.filter((fileAttachment) => fileAttachment.id !== attachment.id)
                  );
                },
              }
            );
            dispatch(hideAllDialog());
          },
          onCancel: () => {
            dispatch(hideAllDialog());
          },
        },
      })
    );
  };

  const loading = React.useMemo(() => {
    return isLoadingGetPresignedUrl || isLoading || isLoadingAddVendorRegistrationAttachment;
  }, [isLoadingGetPresignedUrl, isLoading, isLoadingAddVendorRegistrationAttachment]);

  return (
    <Accordion title="File Attachments" id="file-attachments" isExpanded={defaultExpandedAccordion}>
      {allowUploadFile && (
        <>
          <FileUpload
            acceptFileType={ACCEPT_FILE_TYPE}
            onChange={(value: any) => handleFileSelect(value)}
          />

          <Stack direction={'row'} justifyContent="flex-end" mt={2} mb={1}>
            <Typography variant="body2" fontStyle={'italic'} color={COLOR_CODE.PRIMARY_500}>
              Please click Upload to save your document.
            </Typography>
          </Stack>
        </>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                {
                  label: 'File Attachments Name',
                  width: '20%',
                },
                {
                  label: 'Description',
                  width: '20%',
                },
                {
                  label: 'Upload Date',
                  width: '20%',
                },
                {
                  label: 'Size',
                  width: '10%',
                },
                {
                  label: ' ',
                  width: '30%',
                },
              ].map((item) => (
                <StyledTableCell key={item.label} width={item.width}>
                  {item.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              border: COLOR_CODE.DEFAULT_BORDER,
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
          >
            {/* Upload file */}
            {allowUploadFile && fileSelected && (
              <StyledTableRow>
                <StyledTableCell width={'20%'}>
                  <FilePreview.LocalFilePreview file={fileSelected.file} />
                </StyledTableCell>
                <StyledTableCell width={'20%'}>
                  <TextareaAutosize
                    onChange={(event) => {
                      const value = event.target.value || '';
                      setFileSelected((prevFile) => ({
                        ...prevFile,
                        descriptions: value,
                      }));
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell width={'20%'}>
                  {dayjs().format(DateFormatDisplayMinute)}
                </StyledTableCell>
                <StyledTableCell width={'10%'}>{fileSelected.size}</StyledTableCell>
                <StyledTableCell width={'30%'}>
                  <Stack direction="row" justifyContent={'flex-end'}>
                    {(!!uploadProgress || isLoadingGetPresignedUrl) && (
                      <CircularProgressWithLabel
                        variant="determinate"
                        value={uploadProgress}
                        size={32}
                      />
                    )}
                    <Button
                      className="mx-8"
                      disabled={loading}
                      onClick={() => {
                        handleUploadFile();
                      }}
                    >
                      Upload
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFileSelected(null);
                      }}
                    >
                      Remove
                    </Button>
                  </Stack>
                </StyledTableCell>
              </StyledTableRow>
            )}

            {/* View files */}
            {isEmpty(attachments) ? (
              <StyledTableRow>
                <StyledTableCell width={'100%'} colSpan={5}>
                  <Box minHeight={'40px'}>&nbsp;</Box>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              attachments.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell width={'20%'}>
                    <DecodeFilePreview
                      fileUrl={row.url}
                      poId={vendorRegistrationId}
                      attachmentId={row.id}
                    />
                  </StyledTableCell>
                  <StyledTableCell width={'20%'}>{row.description}</StyledTableCell>
                  <StyledTableCell width={'20%'}>
                    {localTimeToHawaii(row.uploadDate)}
                  </StyledTableCell>
                  <StyledTableCell width={'10%'}>{row.size}</StyledTableCell>
                  <StyledTableCell width={'30%'}>
                    <Stack direction="row" justifyContent={'flex-end'}>
                      {allowRemoveFile && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleDeleteAttachment(row);
                          }}
                          disabled={disabled || loading}
                        >
                          Remove
                        </Button>
                      )}
                    </Stack>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Accordion>
  );
};
type Props = {
  formikProps: VendorRegistrationFormikProps;
  vendorRegistrationId: string;
  disabled?: boolean;
};

export default React.memo(FileAttachments, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const allowUploadFile = !nextProps.disabled;
  const allowRemoveFile = !nextProps.disabled;

  if (allowUploadFile || allowRemoveFile) return false;

  return isEqualPrevAndNextFormikValues({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender: [
      VENDOR_REGISTRATION_FORM_KEY.FILE_ATTACHMENTS,
      VENDOR_REGISTRATION_FORM_KEY.ID,
    ],
  });
});
