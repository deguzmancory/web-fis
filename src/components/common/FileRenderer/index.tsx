/* eslint-disable react-hooks/exhaustive-deps */
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { FiPaperclip } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { useComponentDidMount } from 'src/hooks';
import { Callback } from 'src/redux/types';
import { FileCache } from 'src/services';
import { isURLImage } from 'src/utils';
import { Link, View } from '..';
import './styles.scss';

const FileRenderer: React.FC<Props> = ({
  url,
  imageClassName,
  downloadFileName,
  label,
  labelClassName,
  isUpdateOnChange = false,
  onRemove,
}) => {
  const [decodeUrl, setDecodeUrl] = useState('');
  useComponentDidMount(() => {
    handleDecodeUrl();
  });

  useEffect(() => {
    if (isUpdateOnChange && url && decodeUrl) handleDecodeUrl();
  }, [url]);

  const handleDecodeUrl = () => {
    if (typeof url === 'string') {
      const decodeUrl = FileCache.getCachedUrl(url);
      if (!decodeUrl) {
        console.log('onGetDecodeUrl: ', decodeUrl);
        // onGetDecodeUrl({
        //   filePath: url,
        //   callback: (res) => {
        //     FileCache.saveCacheUrl(url, res);
        //     setDecodeUrl(res);
        //   },
        // });
      } else {
        setDecodeUrl(decodeUrl);
      }
    } else {
      const decodeUrl = URL.createObjectURL(url);
      setDecodeUrl(decodeUrl);
    }
  };

  const handleRemoveFile = () => {
    onRemove(url);
  };

  const isImage = isURLImage(typeof url === 'string' ? decodeUrl : url?.type);

  if (!decodeUrl) return null;

  const allowRemove = !!onRemove;

  if (isImage)
    return (
      <View className="cmp-file-upload__image mb-2">
        <img
          className={cn(
            'cmp-file-upload__image fit-image',
            // { 'is-loading': loading },
            imageClassName
          )}
          src={decodeUrl}
          alt={decodeUrl}
        />
        {allowRemove && (
          <IoClose
            onClick={handleRemoveFile}
            title={'Remove file'}
            className="cmp-file-upload__image-close"
          />
        )}
      </View>
    );

  if (label) {
    return (
      <View isRow align="center" className="mb-1">
        <Link
          href={decodeUrl}
          download={downloadFileName}
          target="_blank"
          className={cn('cmp-file-upload__name', labelClassName)}
        >
          {label}
        </Link>
        {allowRemove && (
          <IoClose className={cn('cmp-file-upload__icon--trash')} onClick={handleRemoveFile} />
        )}
      </View>
    );
  }

  return (
    <View isRow align="center" className="mb-1">
      <FiPaperclip className={cn('cmp-file-upload__icon mr-1')} />
      <Link
        href={decodeUrl}
        download={downloadFileName}
        target="_blank"
        className={cn('cmp-file-upload__name')}
      >
        {downloadFileName ||
          FileCache.trimUuidFromUniqueId(FileCache.getUniqueIdFromUrl(decodeUrl))}
      </Link>
      {allowRemove && (
        <IoClose className={cn('cmp-file-upload__icon--trash')} onClick={handleRemoveFile} />
      )}
    </View>
  );
};

type Props = {
  url: string | File;
  downloadFileName?: string;
  label?: string;
  labelClassName?: string;
  onRemove?: Callback;
  imageClassName?: string;
  isUpdateOnChange?: boolean;
};

export default FileRenderer;
