import React, { Suspense } from 'react';
import { createPortal } from 'react-dom';
import { IoIosOpen } from 'react-icons/io';
import { connect } from 'react-redux';
import { COLOR_CODE } from 'src/appConfig/constants';
import { Button, LoadingCommon, View } from 'src/components/common';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { showLightbox } from 'src/redux/lightbox/lightboxSlice';
import { FileCache } from 'src/services';
import { isURLImage } from 'src/utils';
import { isEmpty } from 'src/validations';
import { getFileName, handleDownloadFile, handleParseAndDownloadFile } from './helper';

const PDFView = React.lazy(() => import('src/components/common/PDFView'));

const DecodeUrlFilePreview: React.FC<Props> = ({ fileUrl, onShowLightbox }) => {
  const [pdfUrl, setPdfUrl] = React.useState(null);

  // const { getPresignedDownloadUrl } = useGetPOAttachmentPresignedUrl({
  //   onError(error) {
  //     handleShowErrorMsg(error);
  //   },
  // });

  const getDecodeUrl = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (typeof fileUrl === 'string') {
        const decodeUrl = FileCache.getCachedUrl(fileUrl);
        if (!decodeUrl) {
          // getPresignedDownloadUrl(
          //   {
          //     filePath: fileUrl,
          //     // attachmentId: attachmentId,
          //   },
          //   {
          //     onSuccess({ data }) {
          //       FileCache.saveCacheUrl(fileUrl, data.url);
          //       resolve(data.url);
          //     },
          //   }
          // );
        } else {
          resolve(decodeUrl);
        }
      } else {
        const decodeUrl = URL.createObjectURL(fileUrl);
        resolve(decodeUrl);
      }
    });
  };

  const handleOpenFile = async () => {
    const decodeUrl = await getDecodeUrl();
    const isImage = isURLImage(decodeUrl);
    const isPdf = decodeUrl.includes('.pdf');

    if (isImage) {
      onShowLightbox({
        images: [
          {
            title: getFileName(decodeUrl),
            url: decodeUrl,
          },
        ],
      });
    } else if (isPdf) {
      setPdfUrl(decodeUrl);
    } else {
      handleDownloadFile(decodeUrl);
    }
  };

  const pdfViewTag = document.getElementById('pdf-preview');

  return (
    <>
      <View isRowWrap align="center" onClick={() => handleOpenFile()}>
        <Button variant="link" className="fw-medium">
          {getFileName(fileUrl)}
        </Button>
        <i
          style={{
            transform: 'translateY(1px)',
          }}
          className="cursor-pointer ml-8"
        >
          <IoIosOpen size={20} color={COLOR_CODE.PRIMARY} />
        </i>
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
  fileUrl: string;
};

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
  onShowLightbox: showLightbox,
};

export default connect(undefined, mapDispatchToProps)(DecodeUrlFilePreview);
