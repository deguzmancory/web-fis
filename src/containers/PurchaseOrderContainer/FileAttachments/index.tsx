import React from 'react';
import { useDispatch } from 'react-redux';
import { getFileName } from 'src/components/FilePreview/helper';
import FileAttachmentsSection from 'src/containers/shared/FileAttachmentsSection';
import {
  POFileAttachmentPayload,
  useAddPOAttachment,
  useUploadPOFileAttachment,
} from 'src/queries';
import { useDeletePOAttachment } from 'src/queries/PurchaseOrders/useDeletePOAttachment';
import { useGetPOAttachmentPresignedUrl } from 'src/queries/PurchaseOrders/useGetPOAttachmentPresignedUrl';
import { hideAllDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { FileCache, Toastify } from 'src/services';
import { handleShowErrorMsg, isEqualPrevAndNextFormikValues, niceBytes, trimUrl } from 'src/utils';
import { isEmpty } from 'src/validations';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormikProps } from '../types';

const FileAttachments: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { fileAttachments, id: poId } = formikProps.values;
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
    isArtifact: boolean;
  }>(null);

  const [uploadProgress, setUploadProgress] = React.useState(0);

  const allowUploadFile = !disabled;
  const allowRemoveFile = !disabled;
  const defaultExpandedAccordion = !isEmpty(attachments);

  const handleFileSelect = React.useCallback((files: File[]) => {
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
  }, []);

  const { getPresignedUploadUrl, loading: isLoadingGetPresignedUrl } = useUploadPOFileAttachment({
    onUploadSuccess(data, variables, context) {
      addPoAttachment({
        id: poId,
        name: fileSelected.file.name,
        size: fileSelected.size,
        description: fileSelected.descriptions,
        isArtifact: fileSelected.isArtifact,
        url: trimUrl(variables?.url),
      });
    },
    onError(error) {
      handleShowErrorMsg(error);
    },
    setProgress: setUploadProgress,
    id: poId,
  });

  const { addPoAttachment, isLoading: isLoadingAddPoAttachment } = useAddPOAttachment({
    onSuccess({ data }) {
      Toastify.success('Upload file attachment successfully');

      setUploadProgress(0);
      setFileSelected(null);

      setFieldValue(PO_FORM_KEY.FILE_ATTACHMENTS, [...fileAttachments, data]);
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

  const { deletePOAttachment, isLoading } = useDeletePOAttachment({
    onError(error) {
      handleShowErrorMsg(error);
    },
  });

  const handleDeleteAttachment = React.useCallback(
    (attachment: POFileAttachmentPayload) => {
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
              deletePOAttachment(
                {
                  id: poId,
                  attachmentId: attachment.id,
                },
                {
                  onSuccess() {
                    Toastify.success('Delete file attachment successfully');

                    setFieldValue(
                      PO_FORM_KEY.FILE_ATTACHMENTS,
                      fileAttachments.filter(
                        (fileAttachment) => fileAttachment.id !== attachment.id
                      )
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
    },
    [deletePOAttachment, dispatch, fileAttachments, poId, setFieldValue]
  );

  const { getPresignedDownloadUrl } = useGetPOAttachmentPresignedUrl({
    onError(error) {
      handleShowErrorMsg(error);
    },
  });

  const handleGetDecodeUrl = React.useCallback(
    ({ attachmentId, fileUrl }: { attachmentId: string; fileUrl: string }): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (typeof fileUrl === 'string') {
          const decodeUrl = FileCache.getCachedUrl(fileUrl);
          if (!decodeUrl) {
            getPresignedDownloadUrl(
              {
                id: poId,
                attachmentId: attachmentId,
              },
              {
                onSuccess({ data }) {
                  FileCache.saveCacheUrl(fileUrl, data.url);
                  resolve(data.url);
                },
              }
            );
          } else {
            resolve(decodeUrl);
          }
        } else {
          const decodeUrl = URL.createObjectURL(fileUrl);
          resolve(decodeUrl);
        }
      });
    },
    [getPresignedDownloadUrl, poId]
  );

  const handleDescriptionInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value || '';
      setFileSelected((prevFile) => ({
        ...prevFile,
        descriptions: value,
      }));
    },
    []
  );

  const loading = React.useMemo(() => {
    return isLoadingGetPresignedUrl || isLoading || isLoadingAddPoAttachment;
  }, [isLoadingGetPresignedUrl, isLoading, isLoadingAddPoAttachment]);

  return (
    <FileAttachmentsSection
      fileAttachments={attachments}
      disabled={disabled}
      loading={loading}
      showUploadProgress={!!uploadProgress || isLoadingGetPresignedUrl}
      uploadProgress={uploadProgress}
      allowUploadFile={allowUploadFile}
      allowRemoveFile={allowRemoveFile}
      fileSelected={fileSelected}
      defaultExpandedAccordion={defaultExpandedAccordion}
      onFileSelect={handleFileSelect}
      onDescriptionInputChange={handleDescriptionInputChange}
      onRemoveSelectedFile={() => {
        setFileSelected(null);
      }}
      onUploadFile={handleUploadFile}
      onGetDecodeUrl={handleGetDecodeUrl}
      onDeleteAttachment={handleDeleteAttachment}
    />
  );
};
type Props = {
  formikProps: UpsertPOFormikProps;
  disabled?: boolean;
};

export default React.memo(FileAttachments, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const allowUploadFile = !nextProps.disabled;
  const allowRemoveFile = !nextProps.disabled;

  if (allowUploadFile || allowRemoveFile) return false;

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender: [PO_FORM_KEY.FILE_ATTACHMENTS, PO_FORM_KEY.ID],
    })
  );
});
