// import React, { Suspense } from 'react';
// import { createPortal } from 'react-dom';
// import { connect } from 'react-redux';
// import { Button, LoadingCommon, View } from 'src/components/common';
// import { useGetPOAttachmentPresignedUrl } from 'src/queries/PurchaseOrders/useGetPOAttachmentPresignedUrl';
// import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
// import { showLightbox } from 'src/redux/lightbox/lightboxSlice';
// import { FileCache } from 'src/services';
// import { handleShowErrorMsg, isURLImage } from 'src/utils';
// import { isEmpty } from 'src/validations';

// const PDFView = React.lazy(() => import('src/components/common/PDFView'));

// const FilePreview: React.FC<Props> = ({ fileUrl, onShowLightbox, poId, attachmentId }) => {
//   const [pdfUrl, setPdfUrl] = React.useState(null);

//   const { getPresignedDownloadUrl } = useGetPOAttachmentPresignedUrl({
//     onError(error) {
//       handleShowErrorMsg(error);
//     },
//   });

//   const getDecodeUrl = (): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       if (typeof fileUrl === 'string') {
//         const decodeUrl = FileCache.getCachedUrl(fileUrl);
//         if (!decodeUrl) {
//           getPresignedDownloadUrl(
//             {
//               id: poId,
//               attachmentId: attachmentId,
//             },
//             {
//               onSuccess({ data }) {
//                 FileCache.saveCacheUrl(fileUrl, data.url);
//                 resolve(data.url);
//               },
//             }
//           );
//         } else {
//           resolve(decodeUrl);
//         }
//       } else {
//         const decodeUrl = URL.createObjectURL(fileUrl);
//         resolve(decodeUrl);
//       }
//     });
//   };

//   const handleDownloadFile = (url: string) => {
//     if (!url) return null;
//     else {
//       const element = document.createElement('a');
//       element.href = url;
//       element.target = '_blank';
//       element.rel = 'noopener noreferrer';
//       element.setAttribute('download', 'image.jpg');
//       document.body.appendChild(element);
//       element.click();
//       element.parentNode.removeChild(element);
//       return;
//     }
//   };

//   const handleParseAndDownloadFile = (url: string) => {
//     handleDownloadFile(url);
//   };

//   const getFileName = (url: string) => {
//     const fileName = FileCache.trimUuidFromUniqueId(FileCache.getUniqueIdFromUrl(url));
//     return `${fileName.slice(0, 12)}...${fileName.slice(-5)}`;
//   };

//   const handleOpenFile = async () => {
//     const decodeUrl = await getDecodeUrl();
//     const isImage = isURLImage(decodeUrl);
//     const isPdf = decodeUrl.includes('.pdf');

//     if (isImage) {
//       onShowLightbox({
//         images: [
//           {
//             title: getFileName(decodeUrl),
//             url: decodeUrl,
//           },
//         ],
//       });
//     } else if (isPdf) {
//       setPdfUrl(decodeUrl);
//     } else {
//       handleDownloadFile(decodeUrl);
//     }
//   };
//   const pdfViewTag = document.getElementById('pdf-preview');

//   return (
//     <>
//       <View isRowWrap align="center" onClick={() => handleOpenFile()}>
//         <Button variant="link" className="fw-medium">
//           {getFileName(fileUrl)}
//         </Button>
//       </View>
//       {createPortal(
//         <Suspense fallback={<LoadingCommon />}>
//           <PDFView
//             url={pdfUrl}
//             title={getFileName(pdfUrl)}
//             isVisible={!isEmpty(pdfUrl)}
//             onClose={() => setPdfUrl(null)}
//             onDownload={() => handleParseAndDownloadFile(pdfUrl)}
//           />
//         </Suspense>,
//         pdfViewTag
//       )}
//     </>
//   );
// };

// type Props = typeof mapDispatchToProps & {
//   fileUrl: string;
//   poId: string;
//   attachmentId: string;
// };

// const mapDispatchToProps = {
//   onShowDialog: showDialog,
//   onHideDialog: hideDialog,
//   onShowLightbox: showLightbox,
// };

// export default connect(undefined, mapDispatchToProps)(FilePreview);

export default null;
