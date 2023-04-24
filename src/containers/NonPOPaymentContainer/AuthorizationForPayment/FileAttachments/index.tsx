import { memo, useCallback, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import FileAttachmentsSection from 'src/containers/shared/FileAttachmentsSection';
import { POFileAttachment, useDeleteAuthorizationPaymentAttachment } from 'src/queries';
import { useAddAuthorizationAttachment } from 'src/queries/NonPOPayment/AuthorizationForPayment/useAddAuthorizationAttachment';
import { useGetAuthorizationPaymentAttachmentPresignedUrl } from 'src/queries/NonPOPayment/AuthorizationForPayment/useGetAuthorizationPaymentAttachmentPresignedUrl';
import { useUploadAuthorizationFileAttachment } from 'src/queries/NonPOPayment/AuthorizationForPayment/useUploadAuthorizationFileAttachment';
import { hideAllDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { FileCache, Toastify } from 'src/services';
import { handleShowErrorMsg, isEqualPrevAndNextFormikValues, niceBytes, trimUrl } from 'src/utils';
import { AUTHORIZATION_FOR_PAYMENT_KEY } from '../enum';
import { UpsertAuthorizationFormValue, UpsertAuthorizationPaymentFormikProps } from '../types';

const FileAttachments: React.FC<Props> = ({
  formikProps,
  disabled = false,
  allowActionAfterFinalApproveOnly = false,
}) => {
  const { fileAttachments, id: Id, placeholderFileAttachment } = formikProps.values;
  const { setFieldValue } = formikProps;
  const dispatch = useDispatch();
  const attachments = useMemo(() => {
    if (isEmpty(fileAttachments)) return [];

    return fileAttachments.slice().sort((cur, next) => {
      return cur.createdAt < next.createdAt ? 1 : -1;
    });
  }, [fileAttachments]);

  const [uploadProgress, setUploadProgress] = useState(0);

  const allowUploadFile = !disabled;
  const allowRemoveFile = !disabled;
  const defaultExpandedAccordion = !isEmpty(attachments);

  const handleFileSelect = useCallback(
    (files: File[]) => {
      if (isEmpty(files)) {
        Toastify.warning('Please select a file');
        return;
      }
      setFieldValue(AUTHORIZATION_FOR_PAYMENT_KEY.PLACEHOLDER_FILE_ATTACHMENT, {
        ...placeholderFileAttachment,
        file: files[0],
        size: niceBytes(files[0].size),
        isArtifact: true, //TODO: should check this value
      });
    },
    [placeholderFileAttachment, setFieldValue]
  );

  const { getAuthorizationPresignedUploadUrl, loading: isLoadingGetPresignedUrl } =
    useUploadAuthorizationFileAttachment({
      onUploadSuccess(data, variables, context) {
        addAuthorizationAttachment({
          id: Id,
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
      id: Id,
    });

  const { addAuthorizationAttachment, isLoading: isLoadingAddNonPOAttachment } =
    useAddAuthorizationAttachment({
      onSuccess({ data }) {
        Toastify.success('Upload file attachment successfully');

        setUploadProgress(0);
        setFieldValue(AUTHORIZATION_FOR_PAYMENT_KEY.PLACEHOLDER_FILE_ATTACHMENT, null);
        setFieldValue(AUTHORIZATION_FOR_PAYMENT_KEY.FILE_ATTACHMENTS, [...fileAttachments, data]);
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
    getAuthorizationPresignedUploadUrl(placeholderFileAttachment.file);
  };

  const { deleteAuthorizationPaymentAttachment, isLoading } =
    useDeleteAuthorizationPaymentAttachment({
      onError(error) {
        handleShowErrorMsg(error);
      },
    });

  const handleDeleteAttachment = useCallback(
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
              deleteAuthorizationPaymentAttachment(
                {
                  id: Id,
                  attachmentId: attachment.id,
                },
                {
                  onSuccess() {
                    Toastify.success('Delete file attachment successfully');

                    setFieldValue(
                      AUTHORIZATION_FOR_PAYMENT_KEY.FILE_ATTACHMENTS,
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
    [deleteAuthorizationPaymentAttachment, dispatch, fileAttachments, Id, setFieldValue]
  );

  const { getAuthorizationPaymentPresignedDownloadUrl } =
    useGetAuthorizationPaymentAttachmentPresignedUrl({
      onError(error) {
        handleShowErrorMsg(error);
      },
    });

  const handleGetDecodeUrl = useCallback(
    ({ attachmentId, fileUrl }: { attachmentId: string; fileUrl: string }): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (typeof fileUrl === 'string') {
          const decodeUrl = FileCache.getCachedUrl(fileUrl);
          if (!decodeUrl) {
            getAuthorizationPaymentPresignedDownloadUrl(
              {
                id: Id,
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
    [getAuthorizationPaymentPresignedDownloadUrl, Id]
  );

  const handleDescriptionInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value || '';
      setFieldValue(AUTHORIZATION_FOR_PAYMENT_KEY.PLACEHOLDER_FILE_ATTACHMENT, {
        ...placeholderFileAttachment,
        descriptions: value,
      });
    },
    [placeholderFileAttachment, setFieldValue]
  );

  const loading = useMemo(() => {
    return isLoadingGetPresignedUrl || isLoading || isLoadingAddNonPOAttachment;
  }, [isLoading, isLoadingAddNonPOAttachment, isLoadingGetPresignedUrl]);

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
        setFieldValue(AUTHORIZATION_FOR_PAYMENT_KEY.PLACEHOLDER_FILE_ATTACHMENT, null);
      }}
      onUploadFile={handleUploadFile}
      onGetDecodeUrl={handleGetDecodeUrl}
      onDeleteAttachment={handleDeleteAttachment}
    />
  );
};

type Props = {
  formikProps: UpsertAuthorizationPaymentFormikProps;
  disabled?: boolean;
  allowActionAfterFinalApproveOnly?: boolean;
};

export default memo(FileAttachments, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const allowUploadFile = !nextProps.disabled;
  const allowRemoveFile = !nextProps.disabled;

  if (allowUploadFile || allowRemoveFile) return false;

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.allowActionAfterFinalApproveOnly === nextProps.allowActionAfterFinalApproveOnly &&
    isEqualPrevAndNextFormikValues<UpsertAuthorizationFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender: [
        AUTHORIZATION_FOR_PAYMENT_KEY.FILE_ATTACHMENTS,
        AUTHORIZATION_FOR_PAYMENT_KEY.ID,
        AUTHORIZATION_FOR_PAYMENT_KEY.PLACEHOLDER_FILE_ATTACHMENT,
      ],
    })
  );
});
