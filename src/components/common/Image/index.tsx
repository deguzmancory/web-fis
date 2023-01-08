import React from 'react';

const Image: React.FC<Props> = ({ alt = 'unset', ...props }) => {
  return <img alt={alt} {...props} />;
};

type Props = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {};

export default Image;
