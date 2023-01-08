import cn from 'classnames';
import React from 'react';

import './styles.scss';

const IconSuccess: React.FC<Props> = ({ size = 100, className }) => {
  const svgSize = (size * 60) / 100;
  return (
    <div className={cn('icon-success', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 18 18" style={{ width: svgSize }}>
        <polyline points="0 8 5 14 13 4" />
      </svg>
    </div>
  );
};

type Props = { size?: number; className?: string };

export default IconSuccess;
