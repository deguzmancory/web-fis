import { UseMutationOptions, useMutation } from 'react-query';
import { UploadFilePayload, useUploadFile } from 'src/queries/File';
import { GetPresignedPOPayload } from 'src/queries/PurchaseOrders';
import apiClient from 'src/queries/apiClient';
import { responseWrapper } from 'src/queries/helpers';
import { Callback } from 'src/redux/types';
import { ErrorService } from 'src/services';
import { compressFile } from 'src/utils';

export function useUploadAuthorizationFileAttachment(
  options?: UseMutationOptions<any, Error, File> & {
    onUploadSuccess: (data?: any, variables?: UploadFilePayload, context?: unknown) => void;
    setProgress: Callback;
    id: string;
  }
) {
  let _compressFile: File = null;
  const {
    data: fileUrl,
    mutate: getAuthorizationPresignedUploadUrl,
    isSuccess,
    isLoading,
  } = useMutation<any, Error, File>({
    mutationFn: async (payload: File) => {
      _compressFile = await compressFile(payload);
      const formattedPayload: GetPresignedPOPayload = {
        fileName: _compressFile?.name,
        contentType: _compressFile?.type,
        id: options.id,
      };
      return responseWrapper<any>(apiClient.getAuthorizationPaymentFileAttachmentPresignedUrl, [
        formattedPayload,
      ]);
    },
    onSuccess: (data) => {
      uploadFile({
        url: data?.data?.url,
        fileData: _compressFile,
        setProgress: options.setProgress,
      });
    },
    ...options,
  });

  const { uploadFile, loading: isLoadingUploadFile } = useUploadFile({
    onSuccess: (data, variables, context) => {
      options.onUploadSuccess(data, variables, context);
    },
    onError: (error) => {
      ErrorService.handler(error);
    },
  });

  return {
    fileUrl,
    loading: isLoading || isLoadingUploadFile,
    isSuccess,
    getAuthorizationPresignedUploadUrl,
  };
}
