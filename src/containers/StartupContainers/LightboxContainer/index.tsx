import React from 'react';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';
import { RiDownload2Fill } from 'react-icons/ri';
import { connect } from 'react-redux';
import { View } from 'src/components/common';
import { hideLightbox } from 'src/redux/lightbox/lightboxSlice';
import { IRootState } from 'src/redux/rootReducer';
import { ErrorService } from 'src/services';
import { isEmpty } from 'src/validations';
import './styles.scss';
const clsPrefix = 'ctn-lightbox';

const LightBoxContainer: React.FC<Props> = ({ onHideLightbox, images }) => {
  const image = images[0];
  const handleDownloadImageFile = async () => {
    const url = image.url;
    if (!url) return;
    try {
      const element = document.createElement('a');
      element.href = url;
      element.setAttribute('download', 'image.jpg');
      document.body.appendChild(element);
      element.click();
      element.parentNode.removeChild(element);
    } catch (err) {
      ErrorService.handler(err);
    }
  };

  const customizedLightBoxTitle = () => {
    return (
      <View isRow justify="space-between" align="center">
        <h4 style={{ color: '#fff' }} title="File name">
          {image.title}
        </h4>
        <button
          onClick={handleDownloadImageFile}
          className={`${clsPrefix}__download-btn`}
          title="Download"
        >
          <i>
            <RiDownload2Fill size={27} />
          </i>
        </button>
      </View>
    );
  };

  if (isEmpty(images)) return null;
  return (
    <Lightbox
      onClose={() => onHideLightbox()}
      image={image.url}
      title={customizedLightBoxTitle()}
    />
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const mapStateToProps = (state: IRootState) => ({
  images: state.lightbox.images,
});

const mapDispatchToProps = {
  onHideLightbox: hideLightbox,
};

export default connect(mapStateToProps, mapDispatchToProps)(LightBoxContainer);
