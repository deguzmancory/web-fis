import { FileCache } from 'src/services';

export const handleDownloadFile = (url: string) => {
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

export const handleParseAndDownloadFile = (url: string) => {
  handleDownloadFile(url);
};

export const getFileName = (url: string) => {
  const fileName = FileCache.trimUuidFromUniqueId(FileCache.getUniqueIdFromUrl(url));
  return `${fileName.slice(0, 12)}...${fileName.slice(-5)}`;
};
