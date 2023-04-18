import React from 'react';
import { useDispatch } from 'react-redux';
import FileAttachmentsSection from 'src/containers/shared/FileAttachmentsSection';
import { POFileAttachment, useAddPOAttachment, useUploadPOFileAttachment } from 'src/queries';
import { useDeletePOAttachment } from 'src/queries/PurchaseOrders/useDeletePOAttachment';
import { useGetPOAttachmentPresignedUrl } from 'src/queries/PurchaseOrders/useGetPOAttachmentPresignedUrl';
import { hideAllDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { FileCache, Toastify } from 'src/services';
import { handleShowErrorMsg, isEqualPrevAndNextFormikValues, niceBytes, trimUrl } from 'src/utils';
import { isEmpty } from 'src/validations';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormValue, UpsertPOFormikProps } from '../types';
import {
  UpdatePOPaymentFormValue,
  UpdatePOPaymentFormikProps,
} from 'src/containers/PurchaseOrderContainer/POPayment/types';

const FileAttachments = <T extends UpsertPOFormikProps | UpdatePOPaymentFormikProps>({
  formikProps,
  disabled = false,
  allowActionAfterFinalApproveOnly = false,
}: Props<T>) => {
  const { fileAttachments, id: poId, placeholderFileAttachment } = formikProps.values;
  const { setFieldValue } = formikProps;
  const dispatch = useDispatch();
  const attachments = React.useMemo(() => {
    if (isEmpty(fileAttachments)) return [];

    return fileAttachments.slice().sort((cur, next) => {
      return cur.createdAt < next.createdAt ? 1 : -1;
    });
  }, [fileAttachments]);

  const [uploadProgress, setUploadProgress] = React.useState(0);

  const allowUploadFile = !disabled;
  const allowRemoveFile = !disabled;
  const defaultExpandedAccordion = !isEmpty(attachments);

  const handleFileSelect = React.useCallback(
    (files: File[]) => {
      if (isEmpty(files)) {
        Toastify.warning('Please select a file');
        return;
      }
      setFieldValue(PO_FORM_KEY.PLACEHOLDER_FILE_ATTACHMENT, {
        ...placeholderFileAttachment,
        file: files[0],
        size: niceBytes(files[0].size),
        isArtifact: true, //TODO: should check this value
      });
    },
    [placeholderFileAttachment, setFieldValue]
  );

  const { getPresignedUploadUrl, loading: isLoadingGetPresignedUrl } = useUploadPOFileAttachment({
    onUploadSuccess(data, variables, context) {
      addPoAttachment({
        id: poId,
        name: placeholderFileAttachment.file.name,
        size: placeholderFileAttachment.size,
        description: placeholderFileAttachment.descriptions,
        isArtifact: placeholderFileAttachment.isArtifact,
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
      setFieldValue(PO_FORM_KEY.PLACEHOLDER_FILE_ATTACHMENT, null);
      setFieldValue(PO_FORM_KEY.FILE_ATTACHMENTS, [...fileAttachments, data]);
    },
    onError(error) {
      handleShowErrorMsg(error);
    },
  });

  const handleUploadFile = () => {
    if (!placeholderFileAttachment) {
      Toastify.warning('Please select a file');
      return;
    }
    getPresignedUploadUrl(placeholderFileAttachment.file);
  };

  const { deletePOAttachment, isLoading } = useDeletePOAttachment({
    onError(error) {
      handleShowErrorMsg(error);
    },
  });

  const handleDeleteAttachment = React.useCallback(
    (attachment: POFileAttachment) => {
      dispatch(
        showDialog({
          type: DIALOG_TYPES.YESNO_DIALOG,
          data: {
            title: `Remove`,
            content: `Are you sure you want to delete this File Attachments?`,
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
      setFieldValue(PO_FORM_KEY.PLACEHOLDER_FILE_ATTACHMENT, {
        ...placeholderFileAttachment,
        descriptions: value,
      });
    },
    [placeholderFileAttachment, setFieldValue]
  );

  const loading = React.useMemo(() => {
    return isLoadingGetPresignedUrl || isLoading || isLoadingAddPoAttachment;
  }, [isLoadingGetPresignedUrl, isLoading, isLoadingAddPoAttachment]);

  return (
    <FileAttachmentsSection
      fileAttachments={attachments}
      disabled={disabled}
      allowActionAfterFinalApproveOnly={allowActionAfterFinalApproveOnly}
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
        setFieldValue(PO_FORM_KEY.PLACEHOLDER_FILE_ATTACHMENT, null);
      }}
      onUploadFile={handleUploadFile}
      onGetDecodeUrl={handleGetDecodeUrl}
      onDeleteAttachment={handleDeleteAttachment}
    />
  );
};

type Props<T extends UpsertPOFormikProps | UpdatePOPaymentFormikProps> = {
  formikProps: T extends UpsertPOFormikProps ? UpsertPOFormikProps : UpdatePOPaymentFormikProps;
  disabled?: boolean;
  allowActionAfterFinalApproveOnly?: boolean;
};

export default React.memo(FileAttachments, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const allowUploadFile = !nextProps.disabled;
  const allowRemoveFile = !nextProps.disabled;

  if (allowUploadFile || allowRemoveFile) return false;

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.allowActionAfterFinalApproveOnly === nextProps.allowActionAfterFinalApproveOnly &&
    isEqualPrevAndNextFormikValues<UpsertPOFormValue | UpdatePOPaymentFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender: [
        PO_FORM_KEY.FILE_ATTACHMENTS,
        PO_FORM_KEY.ID,
        PO_FORM_KEY.PLACEHOLDER_FILE_ATTACHMENT,
      ],
    })
  );
});
