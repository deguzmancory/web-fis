import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import React, { Fragment, useRef } from 'react';
import { Accept } from 'react-dropzone';
import { Button } from 'src/components/common';
import FileUpload from 'src/components/common/FileUpload';
import { Callback } from 'src/redux/types';
import './styles.scss';

const AttachmentUploadButton: React.FC<Props> = ({
  acceptFileType,
  icon,
  content = 'upload',
  onAddAttachment,
  onError,
}) => {
  const inputRef = useRef(null);

  const handleOpenSelectFileModal = () => {
    inputRef.current.click();
  };

  const handleSelectFile = (files: File[]) => {
    onAddAttachment(files);
    // inputRef.current.value = null;
  };

  return (
    <Fragment>
      <Button
        variant="link"
        className="mb-4 cmp-upload-button text-is-16"
        onClick={handleOpenSelectFileModal}
        type="button"
      >
        <i className="cmp-upload-button__icon">{icon}</i>
        {content}
      </Button>
      <FileUpload
        acceptFileType={acceptFileType}
        className="is-hidden"
        onChange={handleSelectFile}
        innerRef={inputRef}
        onError={(errorMessage) => onError(errorMessage)}
      />
    </Fragment>
  );
};

type Props = {
  acceptFileType: Accept;
  icon?: ReactJSXElement;
  content: string;
  onAddAttachment: Callback;
  onError: (value: any) => void;
};

export default AttachmentUploadButton;
