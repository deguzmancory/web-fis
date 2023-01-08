/* eslint-disable react-hooks/exhaustive-deps */
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { Accept, FileRejection, useDropzone } from 'react-dropzone';

import { IoAttachOutline } from 'react-icons/io5';
import appConfig from 'src/appConfig';
import { COLOR_CODE, COMMON_TYPE } from 'src/appConfig/constants';
import { Toastify } from 'src/services';
import { Text, View } from '..';
import './styles.scss';

const FileUpload: React.FC<Props> = ({
  className,
  onChange,
  innerRef,
  numberAllow = null,
  onError,
  acceptFileType,
  message = `Drop file here or select file`,
}) => {
  const [myFiles, setMyFiles] = useState<File[]>([]);
  const [rejectFiles, setRejectFiles] = useState<FileRejection[]>([]);

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setMyFiles(acceptedFiles);
    setRejectFiles(fileRejections);
  };

  // List MIME can be found here:
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptFileType ? acceptFileType : COMMON_TYPE,
    maxSize: appConfig.MAXIMUM_FILE_SIZE,
  });

  useEffect(() => {
    if (rejectFiles.length > 0) {
      rejectFiles.forEach((file) => {
        const error = file.errors[0];
        Toastify.error(error.message);
      });
    }
    if (rejectFiles.length > 0) {
      if (rejectFiles[0]?.file?.size > appConfig.MAXIMUM_AVATAR_SIZE)
        onError('Your file size is greater than 16MB. Please try again.');
    }
  }, [rejectFiles]);

  useEffect(() => {
    if (!!numberAllow && myFiles.length > numberAllow)
      return Toastify.error('Can not upload more than 2 files');
    if (myFiles.length > 0) onChange(myFiles);
  }, [myFiles]);

  // For more info about react dropzone follow:
  // https://react-dropzone.js.org/
  return (
    <View className={cn(className, 'cmp-file-upload')}>
      <View {...getRootProps({ className: 'cmp-file-upload__body' })}>
        <input
          data-testid="upload-input"
          {...getInputProps()}
          {...(innerRef && {
            ref: innerRef,
          })}
        />
        <View isRowWrap align="center">
          <i
            style={{
              transform: 'translateY(2px)',
            }}
            className="mr-1"
          >
            <IoAttachOutline size={22} color={COLOR_CODE.PRIMARY} />
          </i>
          <Text className="has-text-primary fw-medium">{message}</Text>
        </View>
      </View>
    </View>
  );
};

type Props = {
  className?: string;
  innerRef?: any;
  numberAllow?: number;
  onChange: (...args: any[]) => void;
  onError?: (value: any) => void;
  acceptFileType?: Accept;
  message?: string;
};

export default FileUpload;
