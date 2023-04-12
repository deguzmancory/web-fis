import React from 'react';
import { useDispatch } from 'react-redux';
import { getFileName } from 'src/components/FilePreview/helper';
import FileAttachmentsSection from 'src/containers/shared/FileAttachmentsSection';
import { VendorRegistrationAttachment } from 'src/queries';
import { useAddVendorRegistrationAttachment } from 'src/queries/Vendors/useAddVendorRegistrationAttachment';
import { useDeleteVendorRegistrationAttachment } from 'src/queries/Vendors/useDeleteVendorRegistrationAttachment';
import { useGetVendorRegistrationAttachmentPresignedUrl } from 'src/queries/Vendors/useGetVendorRegistrationAttachmentPresignedUrl';
import { useUploadVendorRegistrationFileAttachment } from 'src/queries/Vendors/useUploadVendorRegistrationFileAttachment';
import { hideAllDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { FileCache, Toastify } from 'src/services';
import { handleShowErrorMsg, isEqualPrevAndNextFormikValues, niceBytes, trimUrl } from 'src/utils';
import { isEmpty } from 'src/validations';
import { VENDOR_REGISTRATION_FORM_KEY } from '../enums';
import { VendorRegistrationFormikProps } from '../types';

const FileAttachments: React.FC<Props> = ({
  formikProps,
  disabled = false,
  vendorRegistrationId,
}) => {
  const { fileAttachments, placeholderFileAttachment } = formikProps.values;
  const { setFieldValue } = formikProps;
  const dispatch = useDispatch();
  const attachments = React.useMemo(() => {
    if (isEmpty(fileAttachments)) return [];

    return fileAttachments.slice().sort((cur, next) => {
      return cur.createdAt < next.createdAt ? 1 : -1;
    });
  }, [fileAttachments]);

  const allowUploadFile = !disabled;
  const allowRemoveFile = !disabled;
  const defaultExpandedAccordion = !isEmpty(attachments);

  const handleFileSelect = React.useCallback(
    (files: File[]) => {
      if (isEmpty(files)) {
        Toastify.warning('Please select a file');
        return;
      }
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.PLACEHOLDER_FILE_ATTACHMENT, {
        ...placeholderFileAttachment,
        file: files[0],
        size: niceBytes(files[0].size),
      });
    },
    [placeholderFileAttachment, setFieldValue]
  );

  const [uploadProgress, setUploadProgress] = React.useState(0);

  const { getPresignedUploadUrl, loading: isLoadingGetPresignedUrl } =
    useUploadVendorRegistrationFileAttachment({
      onUploadSuccess(data, variables, context) {
        addVendorRegistrationAttachment({
          id: vendorRegistrationId,
          name: placeholderFileAttachment.file.name,
          size: placeholderFileAttachment.size,
          description: placeholderFileAttachment.descriptions,
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
        setFieldValue(VENDOR_REGISTRATION_FORM_KEY.PLACEHOLDER_FILE_ATTACHMENT, null);
        setFieldValue(VENDOR_REGISTRATION_FORM_KEY.FILE_ATTACHMENTS, [...fileAttachments, data]);
      },
      onError(error) {
        handleShowErrorMsg(error);
      },
    });

  const handleUploadFile = React.useCallback(() => {
    if (!placeholderFileAttachment) {
      Toastify.warning('Please select a file');
      return;
    }
    getPresignedUploadUrl(placeholderFileAttachment.file);
  }, [placeholderFileAttachment, getPresignedUploadUrl]);

  const { deleteVendorRegistrationAttachment, isLoading } = useDeleteVendorRegistrationAttachment({
    onError(error) {
      handleShowErrorMsg(error);
    },
  });

  const handleDeleteAttachment = React.useCallback(
    (attachment: VendorRegistrationAttachment) => {
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
    [
      deleteVendorRegistrationAttachment,
      dispatch,
      fileAttachments,
      setFieldValue,
      vendorRegistrationId,
    ]
  );

  const { getPresignedDownloadUrl } = useGetVendorRegistrationAttachmentPresignedUrl({
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
                id: vendorRegistrationId,
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
    [getPresignedDownloadUrl, vendorRegistrationId]
  );

  const handleDescriptionInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value || '';
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.PLACEHOLDER_FILE_ATTACHMENT, {
        ...placeholderFileAttachment,
        descriptions: value,
      });
    },
    [placeholderFileAttachment, setFieldValue]
  );

  const loading = React.useMemo(() => {
    return isLoadingGetPresignedUrl || isLoading || isLoadingAddVendorRegistrationAttachment;
  }, [isLoadingGetPresignedUrl, isLoading, isLoadingAddVendorRegistrationAttachment]);

  return (
    <FileAttachmentsSection
      fileAttachments={attachments}
      disabled={disabled}
      loading={loading}
      showUploadProgress={!!uploadProgress || isLoadingGetPresignedUrl}
      uploadProgress={uploadProgress}
      allowUploadFile={allowUploadFile}
      allowRemoveFile={allowRemoveFile}
      fileSelected={placeholderFileAttachment}
      defaultExpandedAccordion={defaultExpandedAccordion}
      onFileSelect={handleFileSelect}
      onDescriptionInputChange={handleDescriptionInputChange}
      onRemoveSelectedFile={() => {
        setFieldValue(VENDOR_REGISTRATION_FORM_KEY.PLACEHOLDER_FILE_ATTACHMENT, null);
      }}
      onUploadFile={handleUploadFile}
      onGetDecodeUrl={handleGetDecodeUrl}
      onDeleteAttachment={handleDeleteAttachment}
    />
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

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender: [
        VENDOR_REGISTRATION_FORM_KEY.FILE_ATTACHMENTS,
        VENDOR_REGISTRATION_FORM_KEY.ID,
      ],
    })
  );
});
