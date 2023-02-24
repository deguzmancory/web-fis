import Compressor from 'compressorjs';

export const compressFile = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const isImage = ['image/jpg', 'image/jpeg', 'image/png'].includes(file?.type);

    if (isImage) {
      new Compressor(file, {
        quality: 0.7,
        maxWidth: 900,
        maxHeight: 900,
        convertSize: 0,
        success(result: File) {
          resolve(result);
        },
        error(err: Error) {
          reject(err);
        },
      });
    } else {
      resolve(file);
    }
  });
};

export const getFileType = (file: File) => {
  if (!!file.type) return file.type;
  if (file.name.includes('.rar')) return 'application/x-rar-compressed';
  if (file.name.includes('.7z')) return 'application/x-7z-compressed';
  return 'image/png';
};
