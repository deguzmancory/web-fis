import { Callback } from 'src/redux/types';

export enum FileUploadType {
  avatar = 'avatars',
  CLAIM_ISSUE_DOCUMENT = 'CLAIM_ISSUE_DOCUMENT',
}

export interface GetPresignedPayload {
  fileName?: string;
  contentType?: string;
  fileData?: File;
  type?: FileUploadType | null;
  callback?: Callback;
  fullPath?: string;
  keepOriginalQuality?: boolean;
  keyId?: string;
  url?: string;
}
export interface GetMultiPresignedPayload {
  files: GetPresignedPayload[];
  callback?: Callback;
}
export type AttachmentPayload = {
  fileUrl: string;
  name: string;
};

export type UploadFilePayload = {
  url: string;
  fileData: File;
  setProgress?: Callback;
};

export type GetPresignedDownloadPayload = {
  filePath: string;
};

export type GetPresignedDownloadResponse = {
  url: string;
};
