import { useMutation, UseMutationOptions } from 'react-query';
import { Callback } from 'src/redux/types';
import { ErrorService } from 'src/services';
import { compressFile } from 'src/utils';
import apiClient from '../apiClient';
import { UploadFilePayload, useUploadFile } from '../File';

import { responseWrapper } from '../helpers';
import { GetPresignedVendorRegistrationPayload } from './types';

export function useUploadVendorRegistrationFileAttachment(
  options?: UseMutationOptions<any, Error, File> & {
    onUploadSuccess: (data?: any, variables?: UploadFilePayload, context?: unknown) => void;
    setProgress: Callback;
    id: string;
  }
) {
  let _compressFile: File = null;
  const {
    data: fileUrl,
    mutate: getPresignedUploadUrl,
    isSuccess,
    isLoading,
  } = useMutation<any, Error, File>({
    mutationFn: async (payload: File) => {
      _compressFile = await compressFile(payload);
      const formattedPayload: GetPresignedVendorRegistrationPayload = {
        fileName: _compressFile?.name,
        contentType: _compressFile?.type,
        id: options.id,
      };
      return responseWrapper<any>(apiClient.getVendorRegistrationFileAttachmentPresignedUrl, [
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
    getPresignedUploadUrl,
  };
}
