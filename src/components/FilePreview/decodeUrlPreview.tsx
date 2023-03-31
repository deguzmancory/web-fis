import React, { Suspense } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { Button, LoadingCommon, View } from 'src/components/common';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { showLightbox } from 'src/redux/lightbox/lightboxSlice';
import { isURLImage } from 'src/utils';
import { isEmpty } from 'src/validations';
import { getFileName } from './helper';

const PDFView = React.lazy(() => import('src/components/common/PDFView'));

const DecodeUrlPreview: React.FC<Props> = ({
  decodeUrl,
  fileUrl,
  onShowLightbox,
  getDecodeUrl,
}) => {
  const [pdfUrl, setPdfUrl] = React.useState(null);

  const handleDownloadFile = (url: string) => {
    if (!url) return null;
    else {
      const element = document.createElement('a');
      element.href = url;
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
      element.setAttribute('download', 'image.jpg');
      document.body.appendChild(element);
      element.click();
      element.parentNode.removeChild(element);
      return;
    }
  };

  const handleParseAndDownloadFile = (url: string) => {
    handleDownloadFile(url);
  };

  const handleOpenFile = async () => {
    const fileDecodeUrl = decodeUrl || (await getDecodeUrl());
    const isImage = isURLImage(fileDecodeUrl);
    const isPdf = fileDecodeUrl.includes('.pdf');

    if (isImage) {
      onShowLightbox({
        images: [
          {
            title: getFileName(fileDecodeUrl),
            url: fileDecodeUrl,
          },
        ],
      });
    } else if (isPdf) {
      setPdfUrl(fileDecodeUrl);
    } else {
      handleDownloadFile(fileDecodeUrl);
    }
  };
  const pdfViewTag = document.getElementById('pdf-preview');

  return (
    <>
      <View isRowWrap align="center" onClick={() => handleOpenFile()}>
        <Button variant="link" className="fw-medium">
          {getFileName(decodeUrl || fileUrl)}
        </Button>
      </View>
      {createPortal(
        <Suspense fallback={<LoadingCommon />}>
          <PDFView
            url={pdfUrl}
            title={getFileName(pdfUrl)}
            isVisible={!isEmpty(pdfUrl)}
            onClose={() => setPdfUrl(null)}
            onDownload={() => handleParseAndDownloadFile(pdfUrl)}
          />
        </Suspense>,
        pdfViewTag
      )}
    </>
  );
};

type Props = typeof mapDispatchToProps & {
  decodeUrl?: string;
  fileUrl?: string;
  getDecodeUrl?: () => Promise<string>;
};

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
  onShowLightbox: showLightbox,
};

export default connect(undefined, mapDispatchToProps)(DecodeUrlPreview);
