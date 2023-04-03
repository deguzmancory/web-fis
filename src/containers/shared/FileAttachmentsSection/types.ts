export interface CommonFileAttachment {
  id?: string;
  file?: File;
  afterFinalApprove?: boolean;

  createdAt: string;
  updatedAt: string;
  name: string;
  uploadDate: string;
  size: string;
  description: string;
  url: string;
}
