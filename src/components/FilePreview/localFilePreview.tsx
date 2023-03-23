import { Box } from '@mui/material';
import React, { Suspense, useState } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { LoadingCommon } from 'src/components/common';
import TypographyLink from 'src/components/TypographyLink';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { showLightbox } from 'src/redux/lightbox/lightboxSlice';
import { isURLImage } from 'src/utils';
import { isEmpty } from 'src/validations';

const PDFView = React.lazy(() => import('src/components/common/PDFView'));

const LocalFilePreview: React.FC<Props> = ({ file, onShowLightbox }) => {
  const { name, path } = file || {};

  const [openUrl, setOpenUrl] = useState<string>(null);
  const isImage = isURLImage(path);
  const isPdf = path.includes('.pdf');

  const getFileName = (fileName: string) => {
    return `${fileName.slice(0, 15)}...${fileName.slice(-6)}`;
  };

  const handleDownloadFile = (url: string) => {
    if (!url) return null;
    else {
      const element = document.createElement('a');
      element.href = url;
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
      element.setAttribute('download', name);
      document.body.appendChild(element);
      element.click();
      element.parentNode.removeChild(element);
      return;
    }
  };

  const handleOpenFile = () => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const { result } = e.target;
      if (result) {
        if (isImage) {
          onShowLightbox({
            images: [
              {
                title: name,
                url: result as string,
              },
            ],
          });
        } else if (isPdf) {
          setOpenUrl(result as string);
        } else {
          handleDownloadFile(result as string);
        }
      }
    };
    fileReader.readAsDataURL(file);
  };
  const pdfViewTag = document.getElementById('pdf-preview');

  return (
    <>
      <Box onClick={handleOpenFile}>
        <TypographyLink>{getFileName(name)}</TypographyLink>
      </Box>
      <Suspense fallback={<LoadingCommon />}>
        {openUrl &&
          createPortal(
            <PDFView
              url={openUrl}
              title={getFileName(name)}
              isVisible={!isEmpty(openUrl)}
              onClose={() => {
                setOpenUrl(null);
              }}
              allowDownload={false}
            />,
            pdfViewTag
          )}
      </Suspense>
    </>
  );
};

type Props = typeof mapDispatchToProps & {
  file: File & { path?: string };
};

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
  onShowLightbox: showLightbox,
};

export default connect(undefined, mapDispatchToProps)(LocalFilePreview);
