import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { authResponseWrapper } from '../helpers';
import { UploadFilePayload } from './types';

export function useUploadFile(options?: UseMutationOptions<any, Error, UploadFilePayload>) {
  const {
    data: fileUpload,
    mutate: uploadFile,
    isSuccess,
    isLoading,
  } = useMutation<any, Error, UploadFilePayload>({
    mutationFn: (payload: UploadFilePayload) => {
      return authResponseWrapper<any>(apiClient.uploadFileWithProgress, [payload]);
    },
    ...options,
  });

  return {
    fileUpload,
    loading: isLoading,
    isSuccess,
    uploadFile,
  };
}
